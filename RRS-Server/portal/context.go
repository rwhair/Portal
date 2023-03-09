package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"runtime/debug"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/labstack/echo"
	"github.com/pkg/errors"

	_ "github.com/lib/pq"
)

const (
	RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify"
)

const (
	requestIDChars       = "2346789CFHKPRVXY"
	requestIDLength      = 6
	requestIDNumAttempts = 32
)

// RequestID ...
type RequestID uint32

// InvalidRequestID is a value that will never be a valid request.
const InvalidRequestID = RequestID(0xFFFFFFFF)

func (id RequestID) String() string {
	var buf [requestIDLength]byte
	for i := 0; i < len(buf); i += 2 {
		buf[i+0] = requestIDChars[id&0xF]
		id >>= 4
		buf[i+1] = requestIDChars[id&0xF]
		id >>= 4
	}
	return fmt.Sprintf("%s-%s", string(buf[0:3]), string(buf[3:6]))
}

// NewRequestID generates a 24-bit request id, in the form of a 6-character
// string using a 16-character alphabet.
func (c *Context) NewRequestID() RequestID {
	id := RequestID(uint32(rand.Intn(0xFFFFFF)))
	//c.Logger().Printf("ID: %d (%s)\n", uint32(id), id)
	return id
}

// Context wraps an echo.Context with everything else we need to handle a
// request.
type Context struct {
	echo.Context
	RequestID             RequestID
	pricing               PricingTable
	bucket                string
	db                    *sql.DB
	s3                    *s3.S3
	upload                *s3manager.Uploader
	session               *session.Session
	inputPath, outputPath string
}

// NewContext creates a new context to wrap an echo.Context and an AWS session.
func NewContext(ctx echo.Context, db *sql.DB, pt PricingTable, awsSession *session.Session, inputPath string, outputPath string) *Context {
	cc := &Context{Context: ctx, inputPath: inputPath, outputPath: outputPath, session: awsSession}
	cc.db = db
	cc.pricing = pt.Get(cc.Site())
	cc.bucket = os.Getenv("AWS_S3_BUCKET")
	cc.s3 = s3.New(cc.session)
	cc.upload = s3manager.NewUploader(cc.session)
	cc.RequestID = cc.NewRequestID()
	return cc
}

// Site returns the domain name that the API was accessed from.
func (c *Context) Site() string {
	return c.Request().Header.Get("X-Forwarded-Host")
}

// Ok returns an "error" representing a successful request, with the
// request ID in the payload.
func (c *Context) Ok() error {
	id := c.RequestID.String()
	return c.JSON(http.StatusOK, &Response{Success: true, RequestID: &id})
}

// Errorf returns a formatted error message with the given HTTP status code.
func (c *Context) Errorf(code int, err error, format string, args ...interface{}) error {
	e := errors.Wrapf(err, format, args...).Error()
	return c.JSON(code, &Response{Success: false, Error: &e})
}

// BadRequest returns a formatted http.StatusBadRequest error.
func (c *Context) BadRequest(err error, format string, args ...interface{}) error {
	return c.Errorf(http.StatusBadRequest, err, format, args...)
}

// InternalServerError returns a formatted http.StatusInternalServerError error.
func (c *Context) InternalServerError(err error, format string, args ...interface{}) error {
	return c.Errorf(http.StatusInternalServerError, err, format, args...)
}

// Upload creates an S3 object using data from the given reader with a key
// generated from the request ID and the given name.
func (c *Context) Upload(name string, rd io.ReadSeeker, meta map[string]*string) error {
	buf, err := ioutil.ReadAll(rd)
	if err != nil {
		return err
	}

	key := name
	//c.Logger().Printf("Bucket: %s, Key: %s", c.bucket, key)

	params := &s3.PutObjectInput{
		Bucket:        aws.String(c.bucket),
		Key:           aws.String(key),
		Body:          bytes.NewReader(buf),
		ContentType:   aws.String(http.DetectContentType(buf)),
		ContentLength: aws.Int64(int64(len(buf))),
		Metadata:      meta,
	}

	svc := s3.New(c.session)
	if _, err := svc.PutObject(params); err != nil {
		log.Printf("Error uploading to S3: %s\n", err)
		return err
	}
	return nil
}

// UploadFile opens a file on disk and passes it along to Upload()
func (c *Context) UploadFile(name string, path string, meta map[string]*string) error {
	fp, err := os.Open(path)
	if err != nil {
		return err
	}
	defer fp.Close()
	return c.Upload(name, fp, meta)
}

func (c *Context) getPicFile() (path string, err error) {
	defer func() {
		if r := recover(); r != nil {
			debug.PrintStack()
			if e, ok := r.(error); ok {
				err = e
				return
			}
			err = fmt.Errorf("%v", r)
			return
		}
	}()

	image, err := c.FormFile("image")
	if err != nil {
		return "", nil
	}

	ir, err := image.Open()
	if err != nil {
		return "", c.InternalServerError(err, "error opening identity photo")
	}

	picFile, err := ioutil.TempFile("", fmt.Sprintf("*.%s", filepath.Ext(image.Filename)))
	if err != nil {
		return "", c.InternalServerError(err, "error getting path to identity photo")
	}
	defer picFile.Close()

	picFilePath := picFile.Name()
	if _, err := io.Copy(picFile, ir); err != nil {
		return "", c.InternalServerError(err, "error writing identity photo to local path %s", picFilePath)
	}

	return picFilePath, nil
}

type reCaptchaResponse struct {
	Success     bool     `json:"success"`
	ChallengeTS string   `json:"challenge_ts"`
	Hostname    string   `json:"hostname"`
	ErrorCodes  []string `json:"error-codes,omitempty"`
}

func (c *Context) verifyRequest(req *Request) (*reCaptchaResponse, error) {
	if reCaptchaSecretKey == "" {
		err := errors.New("verifyRequest: RECAPTCHA_SECRET_KEY not set, unable to verify request")
		fmt.Println(err)
		return nil, err
	}

	res, err := http.PostForm(RECAPTCHA_URL, url.Values{
		"secret":   {reCaptchaSecretKey},
		"response": {req.Summary.Token},
		"remoteip": {c.RealIP()},
	})
	if err != nil {
		err = fmt.Errorf("verifyRequest: POST failed (%w)", err)
		fmt.Println(err)
		return nil, err
	}
	defer res.Body.Close()

	var r reCaptchaResponse
	dec := json.NewDecoder(res.Body)
	if err := dec.Decode(&r); err != nil {
		err = fmt.Errorf("verifyRequest: error verifying reCAPTCHA request (%w)", err)
		fmt.Println(err)
		return nil, err
	}
	return &r, nil
}
