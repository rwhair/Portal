package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/pkg/errors"
)

// AuthEndpointURL is the URL to the authorize.net API endpoint.
// In development and staging, this will be the authorize.net sandbox.
var AuthEndpointURL = os.Getenv("AUTH_ENDPOINT_URL")

// ProcessPayment submits a request to create a transaction to authorize.net
// and returns the result received.
func ProcessPayment(request *CreateTransactionRequest) (*CreateTransactionResponse, error) {
	if request.TransactionRequest.Amount == 0 {
		return nil, nil
	}

	url := AuthEndpointURL

	buf := new(bytes.Buffer)
	enc := json.NewEncoder(buf)
	if err := enc.Encode(request); err != nil {
		return nil, errors.Wrap(err, "error encoding transaction request")
	}

	fmt.Fprintf(os.Stderr, "Request:\n%s\n\n", buf.String())

	r, err := http.Post(url, "application/json", buf)
	if err != nil {
		return nil, errors.Wrap(err, "error posting transaction request")
	}
	defer r.Body.Close()

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, errors.Wrap(err, "error reading transaction response")
	}

	body = bytes.TrimPrefix(body, []byte("\xef\xbb\xbf"))
	fmt.Fprintf(os.Stderr, "Response:\n%s\n\n", string(body))

	rd := bytes.NewReader(body)

	res := new(CreateTransactionResponse)
	dec := json.NewDecoder(rd)
	if err := dec.Decode(&res); err != nil {
		return nil, errors.WithMessage(errors.Wrap(err, "error decoding transaction response"), fmt.Sprintf("Request:\n%s\n\nResponse:%s\n\n", buf.String(), string(body)))
	}

	return res, nil
}

// MerchantAuthentication ...
type MerchantAuthentication struct {
	Name           string `json:"name"`
	TransactionKey string `json:"transactionKey"`
}

// TransactionType ...
type TransactionType string

const (
	// AuthOnlyTransaction is an authorize-only transaction.
	AuthOnlyTransaction = TransactionType("authOnlyTransaction")

	// AuthCaptureTransaction is an authorize-and-capture transaction.
	AuthCaptureTransaction = TransactionType("authCaptureTransaction")
)

// CreateTransactionRequest ...
type CreateTransactionRequest struct {
	createTransactionRequest `json:"createTransactionRequest"`
}

type createTransactionRequest struct {
	MerchantAuthentication MerchantAuthentication `json:"merchantAuthentication"`
	ClientID               string                 `json:"clientId,omitempty"`
	RefID                  string                 `json:"refId,omitempty"`
	TransactionRequest     TransactionRequest     `json:"transactionRequest"`
}

// TransactionRequest ...
type TransactionRequest struct {
	TransactionType TransactionType `json:"transactionType"`
	Amount          float64         `json:"amount"`
	Payment         PaymentType     `json:"payment"`
	PONumber        string          `json:"poNumber,omitempty"`
	Customer        CustomerData    `json:"customer"`
	BillTo          CustomerAddress `json:"billTo"`
	ShipTo          CustomerAddress `json:"shipTo"`
}

// CreateTransactionResponse ...
type CreateTransactionResponse struct {
	createTransactionResponse
}

type createTransactionResponse struct {
	RefID               string              `json:"refId,omitempty"`
	Messages            Messages            `json:"messages"`
	SessionToken        string              `json:"sessionToken,omitempty"`
	TransactionResponse TransactionResponse `json:"transactionResponse"`
}

// TransactionResponse ...
type TransactionResponse struct {
	ResponseCode    string `json:"responseCode,omitempty"`
	RawResponseCode string `json:"rawResponseCode,omitempty"`
	AuthCode        string `json:"authCode,omitempty"`
	AvsResultCode   string `json:"avsResultCode,omitempty"`
	CvvResultCode   string `json:"cvvResultCode,omitempty"`
	CavvResultCode  string `json:"cavvResultCode,omitempty"`
	TransID         string `json:"transId,omitempty"`
	RefTransID      string `json:"refTransId,omitempty"`
	TransHash       string `json:"transHash,omitempty"`
	TestRequest     string `json:"testRequest,omitempty"`
	AccountNumber   string `json:"accountNumber,omitempty"`
	EntryMode       string `json:"entryMode,omitempty"`
	AccountType     string `json:"accountType,omitempty"`
	SplitTenderID   string `json:"splitTenderId,omitempty"`
	PrePaidCard     struct {
		RequestedAmount string `json:"requestedAmount,omitempty"`
		ApprovedAmount  string `json:"approvedAmount,omitempty"`
		BalanceOnCard   string `json:"balanceOnCard,omitempty"`
	} `json:"prePaidCard,omitempty"`
	Errors []struct {
		ErrorCode string `json:"errorCode,omitempty"`
		ErrorText string `json:"errorText,omitempty"`
	} `json:"errors:omitempty"`
}

// ResultCode is a success/failure code for responses.
type ResultCode string

// ResultCode enumerated values
const (
	ResultCodeOk    = ResultCode("Ok")
	ResultCodeError = ResultCode("Error")
)

// Messages provides the result of the request, including success/failure
// and any informational or error messages describing the result.
type Messages struct {
	ResultCode ResultCode `json:"resultCode"`
	Message    []struct {
		Code string `json:"code"`
		Text string `json:"text"`
	} `json:"message"`
}

// PaymentType represents the type of payment (credit card, bank account, etc.)
type PaymentType interface {
	isPaymentType()
}

// CreditCardPayment holds the data necessary to process a credit card payment.
type CreditCardPayment struct {
	creditCardPaymentInfo `json:"creditCard"`
}

type creditCardPaymentInfo struct {
	CardNumber     string `json:"cardNumber"`
	ExpirationDate string `json:"expirationDate"`
	CardCode       string `json:"cardCode"`
}

// marker interface method
func (p *CreditCardPayment) isPaymentType() {}

// BankAccountType is used to identify the type of account being drawn from.
type BankAccountType string

// BankAccountType enumerated values.
const (
	CheckingAccount         = BankAccountType("checking")
	SavingsAccount          = BankAccountType("savings")
	BusinessCheckingAccount = BankAccountType("business checking")
)

// BankAccountPayment holds the data necessary to process a payment from a bank account.
type BankAccountPayment struct {
	bankAccountPaymentInfo `json:"bankAccount"`
}

type bankAccountPaymentInfo struct {
	AccountType   BankAccountType `json:"accountType,omitempty"`
	RoutingNumber string          `json:"routingNumber"`
	AccountNumber string          `json:"accountNumber"`
	NameOnAccount string          `json:"nameOnAccount"`
	BankName      string          `json:"bankName,omitempty"`
	CheckNumber   string          `json:"checkNumber,omitempty"`
}

// marker interface method
func (p *BankAccountPayment) isPaymentType() {}

// CustomerType indicates whether a customer is an individual or business.
type CustomerType string

// CustomerType enumerated values
const (
	CustomerTypeIndividual = CustomerType("individual")
	CustomerTypeBusiness   = CustomerType("business")
)

// CustomerData contains information on the customer submitting the transaction.
type CustomerData struct {
	Type  CustomerType `json:"type,omitempty"`
	ID    string       `json:"id,omitempty"`
	Email string       `json:"email,omitempty"`
}

// CustomerAddress represents a billing or shipping address.
type CustomerAddress struct {
	FirstName   string `json:"firstName,omitempty"`
	LastName    string `json:"lastName,omitempty"`
	Company     string `json:"company,omitempty"`
	Address     string `json:"address,omitempty"`
	City        string `json:"city,omitempty"`
	State       string `json:"state,omitempty"`
	Zip         string `json:"zip,omitempty"`
	Country     string `json:"country,omitempty"`
	PhoneNumber string `json:"phoneNumber,omitempty"`
	FaxNumber   string `json:"faxNumber,omitempty"`
	Email       string `json:"email,omitempty"`
}
