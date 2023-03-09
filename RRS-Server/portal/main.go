package main // import "github.com/rrsmedical/RRS-Server/portal"

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/google/uuid"
	"github.com/jordan-wright/email"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/pkg/errors"
)

const awsRegion = "us-west-2"

// !!!!! SET THIS TO FALSE TO PROCESS PAYMENTS !!!!!!!
const disablePaymentProcessor = false

var (
	authorizeLoginID        = os.Getenv("AUTH_LOGIN_ID")
	authorizeTransactionKey = os.Getenv("AUTH_TRANSACTION_KEY")
	reCaptchaSecretKey      = os.Getenv("RECAPTCHA_SECRET_KEY")
)

var (
	db *sql.DB
)

func generateFilename(id RequestID, ext string, t time.Time, timeframe string, seq int, test bool) string {
	inbox := "inbox"
	if test {
		inbox = "inbox-test"
	}
	if seq < 2 {
		return fmt.Sprintf("%s/NEW_XXX_2693-NOCODE_ORDER, WEB_%s_(%s_%s)%s", inbox, t.Format("20060102"), id, timeframe, ext)
	}
	return fmt.Sprintf("%s/NEW_XXX_2693-NOCODE_ORDER, WEB_%s_(%s_%s%d)%s", inbox, t.Format("20060102"), id, timeframe, seq, ext)
}

func handlePortalSubmit(ctx echo.Context) (err error) {
	var (
		req    *Request
		xr     *CreateTransactionRequest
		result *CreateTransactionResponse
	)

	c := ctx.(*Context)
	defer func() {
		var payload, authRequest, authResponse sql.NullString

		id := uuid.New()

		var buf strings.Builder
		enc := json.NewEncoder(&buf)

		payload.Valid = true
		if e := enc.Encode(req); e != nil {
			//c.Logger().Printf("%s", e)
			buf.Reset()
			payload.Valid = false
		}
		payload.String = buf.String()
		buf.Reset()

		authRequest.Valid = true
		if e := enc.Encode(xr); e != nil {
			//c.Logger().Printf("%s", e)
			buf.Reset()
			authRequest.Valid = false
		}
		authRequest.String = buf.String()
		buf.Reset()

		authResponse.Valid = true
		if e := enc.Encode(result); e != nil {
			//c.Logger().Printf("%s", e)
			buf.Reset()
			authRequest.Valid = false
		}
		authResponse.String = buf.String()
		buf.Reset()

		_, e := db.Exec(`
				insert into portal_request(request_id, code, created_at, blob_url, payload, auth_request, auth_response)
				values ($1, $2, current_time, $3, $4, $5, $6)
			`, id, c.RequestID, fmt.Sprintf("s3://%s/%s?region=%s", c.bucket, c.RequestID, awsRegion), payload, authRequest, authResponse)
		if e != nil {
			log.Printf("error inserting request into database: %s\n", e)
			return
		}
	}()

	form, err := c.MultipartForm()
	if err != nil {
		err = c.BadRequest(err, "error parsing form data for request")
		return
	}

	values, err := c.FormFile("values")
	if err != nil {
		err = c.BadRequest(err, "request data is missing JSON payload")
		return
	}

	if imageFile, ok := form.File["image"]; ok {
		rd, err := imageFile[0].Open()
		if err == nil {
			c.Upload(fmt.Sprintf("metadata/%s%s", c.RequestID, filepath.Ext(imageFile[0].Filename)), rd, nil)
		}
	}

	if valuesFile, ok := form.File["values"]; ok {
		rd, err := valuesFile[0].Open()
		if err == nil {
			c.Upload(fmt.Sprintf("metadata/%s.json", c.RequestID), rd, nil)
		}
	}

	vr, err := values.Open()
	if err != nil {
		err = c.InternalServerError(err, "error opening JSON payload")
		return
	}

	req = new(Request)

	dec := json.NewDecoder(vr)
	if err = dec.Decode(req); err != nil {
		err = c.BadRequest(err, "error decoding JSON payload")
		return
	}

	r, err := c.verifyRequest(req)
	if err == nil {
		buf, err := json.Marshal(r)
		if err == nil {
			rd := bytes.NewReader(buf)
			c.Upload(fmt.Sprintf("recaptcha/%s.json", c.RequestID), rd, nil)
		}
	}

	// rwh 2019-08-05
	// HACK: this field ended up being redundant, so the client will
	// populate it with total cost for both bank transfer and credit
	// card transactions so we don't have to keep the calculations in
	// sync between client and server
	// TODO: add some sanity checking
	totalCost, err := strconv.ParseFloat(req.Summary.Payment.BankTransfer.Amount, 64)
	if err != nil {
		totalCost = 0
	}

	html := fmt.Sprintf(emailMessage, c.RequestID, req.getInfoRequested(), req.getDestination(), req.getShippingMethod(), req.getDeliveryTimeframe(), totalCost)

	if totalCost != 0 {
		xr = new(CreateTransactionRequest)
		xr.MerchantAuthentication.Name = authorizeLoginID
		xr.MerchantAuthentication.TransactionKey = authorizeTransactionKey
		xr.RefID = c.RequestID.String()

		payment := &xr.TransactionRequest
		payment.TransactionType = AuthCaptureTransaction
		payment.Amount = totalCost

		switch req.Summary.Payment.Type {
		case "C":
			cc := new(CreditCardPayment)
			payment.Payment = cc
			cc.CardNumber = req.Summary.Payment.CreditCard.Number
			expDate := strings.Replace(req.Summary.Payment.CreditCard.ExpDate, "/", "", -1)
			cc.ExpirationDate = fmt.Sprintf("20%s-%s", expDate[2:], expDate[0:2])
			cc.CardCode = req.Summary.Payment.CreditCard.SecurityCode
			payment.BillTo.FirstName = req.Summary.Payment.CreditCard.FirstName
			payment.BillTo.LastName = req.Summary.Payment.CreditCard.LastName
			payment.BillTo.Address = strings.Join([]string{req.Summary.Payment.CreditCard.Address, req.Summary.Payment.CreditCard.AddressLine2}, " ")
			payment.BillTo.City = req.Summary.Payment.CreditCard.City
			payment.BillTo.State = req.Summary.Payment.CreditCard.State
			payment.BillTo.Zip = req.Summary.Payment.CreditCard.ZipCode
		case "B":
			bank := new(BankAccountPayment)
			payment.Payment = bank
			bank.BankName = req.Summary.Payment.BankTransfer.BankName
			bank.CheckNumber = req.Summary.Payment.BankTransfer.CheckNumber
			bank.AccountNumber = req.Summary.Payment.BankTransfer.AccountNumber
			bank.RoutingNumber = req.Summary.Payment.BankTransfer.RoutingNumber
			bank.NameOnAccount = strings.Join([]string{req.Summary.Payment.BankTransfer.FirstName, req.Summary.Payment.BankTransfer.LastName}, " ")
			switch strings.ToLower(req.Summary.Payment.BankTransfer.AccountType)[0] {
			case 'C':
				bank.AccountType = CheckingAccount
			case 'S':
				bank.AccountType = SavingsAccount
			default:
				bank.AccountType = CheckingAccount
			}
			payment.BillTo.FirstName = req.Summary.Payment.BankTransfer.FirstName
			payment.BillTo.LastName = req.Summary.Payment.BankTransfer.LastName
			payment.BillTo.Address = strings.Join([]string{req.Summary.Payment.BankTransfer.Address, req.Summary.Payment.BankTransfer.AddressLine2}, " ")
			payment.BillTo.City = req.Summary.Payment.BankTransfer.City
			payment.BillTo.State = req.Summary.Payment.BankTransfer.State
			payment.BillTo.Zip = req.Summary.Payment.BankTransfer.ZipCode
		}

		switch req.Records.Recipient {
		case "P":
			payment.Customer.Type = CustomerTypeIndividual
		default:
			payment.Customer.Type = CustomerTypeBusiness
		}
		payment.Customer.Email = req.Summary.Email

		if !disablePaymentProcessor {
			result, err = ProcessPayment(xr)
			if err != nil {
				err = c.Errorf(http.StatusInternalServerError, err, "payment processor failed")
				return
			}
			if result != nil && result.Messages.ResultCode == ResultCodeError {
				if result.Messages.ResultCode == ResultCodeError {
					err = errors.New("payment rejected by payment processor")
					for i := 0; i < len(result.Messages.Message); i++ {
						msg := &result.Messages.Message[i]
						err = errors.WithMessagef(err, "%s (%s)", msg.Text, msg.Code)
					}
					err = c.Errorf(http.StatusBadRequest, err, "error submitting payment information")
					return
				}

				if result.TransactionResponse.ResponseCode != "1" {
					switch result.TransactionResponse.ResponseCode {
					case "2":
						err = errors.New("transaction was declined")
					case "4":
						err = errors.New("transaction held for review")
					default:
						err = errors.New("error processing transaction")
					}
					for i := 0; i < len(result.TransactionResponse.Errors); i++ {
						msg := &result.TransactionResponse.Errors[i]
						err = errors.WithMessagef(err, "%s (%s)", msg.ErrorText, msg.ErrorCode)
					}
					err = c.Errorf(http.StatusBadRequest, err, "payment was not accepted")
					return
				}
			}
		}
	}

	picFilePath, err := c.getPicFile()
	if picFilePath != "" {
		defer os.Remove(picFilePath)
	}
	//c.Logger().Info("getPicFile: \"%s\" - %v\n", picFilePath, err)

	pdfFile, err := ioutil.TempFile("", "*.pdf")
	if err != nil {
		err = c.InternalServerError(err, "error creating temporary file")
		return
	}

	pdfFilePath := pdfFile.Name()
	defer os.Remove(pdfFilePath)
	pdfFile.Close()

	pdf := new(PDF)

	templatePath, err := filepath.Abs("portal/template/template.pdf")
	if err != nil {
		err = c.InternalServerError(err, "error locating pdf template file")
		return
	}

	if err = pdf.LoadTemplate(templatePath); err != nil {
		err = c.InternalServerError(err, "error reading pdf template from local path %s", templatePath)
		return
	}

	fontPath, err := filepath.Abs("portal/template/Inconsolata-Regular.ttf")
	if err != nil {
		err = c.InternalServerError(err, "error locating pdf font file")
		return
	}

	fontName := "Inconsolata"
	if err = pdf.LoadFont("Inconsolata", fontPath); err != nil {
		err = c.InternalServerError(err, "error reading font %s from local path %s", fontName, fontPath)
		return
	}

	if err = pdf.SetFont(fontName, "", 10); err != nil {
		err = c.InternalServerError(err, "error setting pdf font to %s", fontName)
		return
	}

	if err = pdf.Generate(req); err != nil {
		err = c.InternalServerError(err, "error generating pdf from request data")
		return
	}

	if picFilePath != "" {
		if err = pdf.LoadProfilePic(picFilePath); err != nil {
			err = c.InternalServerError(err, "error writing image %s to pdf %s", picFilePath, pdfFilePath)
			return
		}
	}

	if err = pdf.Save(pdfFilePath); err != nil {
		err = c.InternalServerError(err, "error writing pdf to local path %s", pdfFilePath)
		return
	}

	timeframe := "Standard"
	if req.Records.Timeframe == "F" {
		timeframe = "Fast"
	}

	ts := time.Now()
	filename := generateFilename(c.RequestID, filepath.Ext(pdfFilePath), ts, timeframe, 1, req.Patient.SSN == "0000")

	meta := make(map[string]*string)
	meta["request"] = aws.String(c.RequestID.String())
	if err = c.UploadFile(filename, pdfFilePath, meta); err != nil {
		err = c.InternalServerError(err, "error uploading pdf %s for request %s to S3 bucket %s as %s", pdfFilePath, c.RequestID, c.bucket, filename)
		return
	}

	seq := 2
	for name, file := range form.File {
		for i := 0; i < len(file); i++ {
			if name == "values" || name == "image" {
				continue
			}

			ext := filepath.Ext(file[i].Filename)
			s3name := generateFilename(c.RequestID, ext, ts, timeframe, seq, req.Patient.SSN == "0000")
			seq++

			var rd multipart.File
			rd, err = file[i].Open()
			if err != nil {
				err = c.InternalServerError(err, "error opening request file %s[%d] (%s)", name, i, filename)
				return
			}

			if err = c.Upload(s3name, rd, meta); err != nil {
				err = c.InternalServerError(err, "error uploading request file %s[%d] (%s)", name, i, filename)
				return
			}
		}
	}

	if totalCost != 0 && disablePaymentProcessor {
		err = c.InternalServerError(err, "The payment processor is currently disabled for maintenance.")
		return err
	}

	e := email.NewEmail()
	e.From = smtpUser
	e.To = []string{req.Summary.Email}
	e.Bcc = []string{emailBccUser}
	e.Subject = emailSubject
	e.HTML = []byte(html)
	if err = e.Send(fmt.Sprintf("%s:%s", smtpHost, smtpPort), &LoginAuth{smtpUser, smtpPass, smtpHost}); err != nil {
		log.Printf("error sending confirmation email for %s to %s: %s\n", c.RequestID, req.Summary.Email, err)
		err = nil
	}

	return c.Ok()
}

func main() {
	logPath := os.Getenv("LOG_PATH")

	fp, err := os.Open(logPath)
	if err == nil {
		log.SetOutput(fp)
		defer fp.Close()
	}

	log.SetPrefix("portal: ")

	rand.Seed(time.Now().UnixNano())
	awsSession := session.Must(session.NewSession(&aws.Config{Region: aws.String(awsRegion)}))

	inputPath, err := filepath.Abs("portal/template")
	if err != nil {
		panic(errors.Wrapf(err, "error locating input directory %s", inputPath))
	}

	outputPath := filepath.Join(os.TempDir(), "rrs-portal-files")
	if err = os.MkdirAll(outputPath, 0777); err != nil {
		panic(errors.Wrapf(err, "error creating output directory %s", outputPath))
	}

	db, err = sql.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalln(err)
	}

	pt, err := initPricingTable(db)
	if err != nil {
		log.Fatalln(err)
	}

	var sb strings.Builder
	enc := json.NewEncoder(&sb)
	_ = enc.Encode(pt)
	log.Println(sb.String())

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(func(h echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := NewContext(c, db, pt, awsSession, inputPath, outputPath)
			return h(cc)
		}
	})
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Printf("Listening on port %s\n", port)
	e.POST("/portal/submit", handlePortalSubmit)
	e.GET("/portal/pricing", handlePricing)
	log.Fatalln(e.Start(":" + port))
}
