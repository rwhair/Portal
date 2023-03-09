package main

import (
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"math"
	"os"
	"strconv"
	"strings"

	"github.com/pkg/errors"
	"github.com/signintech/gopdf"
)

const (
	xColW = 1.15
	xCol1 = 0.99
	xCol2 = xCol1 + xColW
	xCol3 = xCol2 + xColW
	xCol4 = xCol3 + xColW
	xCol5 = xCol4 + xColW
	xCol6 = xCol5 + xColW

	xColC1 = xCol1 + 0.01

	xColBx = -0.0355

	// Send Records To
	xColB1x = xColBx + 1.15 // 1.115
	xColB2x = xColBx + 1.84
	xColB3x = xColBx + 2.5

	// Delivery Method
	xColB4x = xColBx + 3.53 // 3.4945
	xColB5x = xColBx + 4.325
	xColB6x = xColBx + 5.02

	// Timeframe
	xColB7x = xColBx + 5.92
	//xColB8x = xColB7x + 0
	xColB9x = xColBx + 7.03

	xColCx  = -0.0305
	xColC1x = xColCx + 1.04
	xColC2x = xColCx + 2.74
	xColC3x = xColCx + 4.505
	xColC4x = xColCx + 6.205

	xColE1 = xCol1 + 0.04

	yRowH  = 0.42
	yRowA1 = 2.20
	yRowA2 = yRowA1 + yRowH

	yRowB2 = 3.6
	yRowB3 = yRowB2 + yRowH
	yRowB4 = yRowB3 + yRowH
	yRowB5 = yRowB4 + yRowH

	yRowB1x = 3.156

	// rwh 2019/08/05
	// hack because I forgot start/end date and had to add them back in at the last minute...
	yRowOff = yRowH

	yRowC0  = 5.38
	yRowC1x = yRowB1x + 2.26 + yRowOff
	yRowC2x = yRowC1x + 0.18
	yRowC3x = yRowC2x + 0.18
	yRowC4x = yRowC3x + 0.18
	yRowC5x = yRowC4x + 0.18
	yRowC6x = yRowC5x + 0.18

	yRowC4 = 6.01 + yRowOff

	yRowD1 = 6.66 + yRowOff
	yRowD2 = yRowD1 + yRowH
	yRowD3 = yRowD2 + yRowH
	yRowD4 = yRowD3 + yRowH

	yRowE1 = 8.69 + yRowOff
	yRowE2 = yRowE1 + yRowH
	yRowE3 = yRowE2 + yRowH

	picX       = 4.75
	picY       = 8.47 + yRowOff
	picWidth   = 2.4
	picHeight  = 1.6
	picCenterX = picX + (picWidth * 0.5)
	picCenterY = picY + (picHeight * 0.5)
)

// PDF is used to generate a PDF document from a template.
type PDF struct {
	gopdf.GoPdf
	x, y float64
}

// LoadTemplate loads a .pdf file from disk to use as a template.
func (pdf *PDF) LoadTemplate(path string) error {
	pdf.Start(gopdf.Config{Unit: gopdf.Unit_IN, PageSize: gopdf.Rect{W: 8.5, H: 11.0}})
	pdf.AddPage()

	tpl := pdf.ImportPage(path, 1, "/MediaBox")
	pdf.UseImportedTemplate(tpl, 0, 0, 8.5, 11)
	pdf.SetFillColor(0, 0, 0)

	return nil
}

// LoadFont loads a .ttf file from disk and assigns it the given name.
func (pdf *PDF) LoadFont(name string, path string) error {
	return pdf.AddTTFFont(name, path)
}

// Printf writes a formatted line of text at the current location.
func (pdf *PDF) Printf(format string, args ...interface{}) {
	pdf.SetX(pdf.x)
	pdf.SetY(pdf.y)
	pdf.Cell(nil, fmt.Sprintf(format, args...))
}

// Generate generates a PDF for the given request data.
func (pdf *PDF) Generate(r *Request) error {
	pdf.SetFillColor(0, 0, 0)

	totalCost, err := strconv.ParseFloat(r.Summary.Payment.BankTransfer.Amount, 64)
	if err != nil {
		totalCost = 0
	}

	if totalCost != 0 {
		pdf.x = 6
		pdf.y = 0.5
		pdf.Printf("Amount Paid: $%0.2f", totalCost)
	}

	// Patient's Name
	pdf.x = xCol1
	pdf.y = yRowA1
	pdf.Printf(strings.Join([]string{r.Patient.FirstName, r.Patient.LastName}, " "))

	// AKA or Maiden Name
	pdf.x = xCol3
	pdf.y = yRowA1
	pdf.Printf(r.Patient.AKA)

	// Date of Birth
	pdf.x = xCol5
	pdf.y = yRowA1
	pdf.Printf(r.Patient.DateOfBirth)

	// SSN
	//pdf.x = 6.76
	pdf.x = xCol6
	pdf.y = yRowA1
	pdf.Printf(fmt.Sprintf("XXX-XX-%s", r.Patient.SSN))

	// Email
	pdf.x = xCol1
	pdf.y = yRowA2
	pdf.Printf(r.Patient.Email)

	// Phone Number
	pdf.x = xCol4
	pdf.y = yRowA2
	pdf.Printf(r.Patient.PhoneNumber)

	// Send Records To: Patient
	pdf.x = xColB1x
	pdf.y = yRowB1x
	if r.Records.Recipient == "P" {
		pdf.Printf("X")
	}

	// Send Records To: Doctor
	pdf.x = xColB2x
	pdf.y = yRowB1x
	if r.Records.Recipient == "D" {
		pdf.Printf("X")
	}

	// Send Records To: Third Party
	pdf.x = xColB3x
	pdf.y = yRowB1x
	if r.Records.Recipient == "T" {
		pdf.Printf("X")
	}

	// Delivery Method: Email
	pdf.x = xColB4x
	pdf.y = yRowB1x
	if r.Records.DeliveryMethod == "E" {
		pdf.Printf("X")
	}

	// Delivery Method: Fax
	pdf.x = xColB5x
	pdf.y = yRowB1x
	if r.Records.DeliveryMethod == "F" {
		pdf.Printf("X")
	}

	// Delivery Method: Mail
	pdf.x = xColB6x
	pdf.y = yRowB1x
	if r.Records.DeliveryMethod == "M" {
		pdf.Printf("X")
	}

	// Timeframe: 1-2 days
	pdf.x = xColB7x
	pdf.y = yRowB1x
	if r.Records.Timeframe == "F" {
		pdf.Printf("X")
	}

	// Timeframe: 3-5 days
	pdf.x = xColB9x
	pdf.y = yRowB1x
	if r.Records.Timeframe == "S" {
		pdf.Printf("X")
	}

	// Recipient:
	pdf.x = xCol1
	pdf.y = yRowB2
	switch r.Records.Recipient {
	case "P":
		pdf.Printf(strings.Join([]string{r.Patient.FirstName, r.Patient.LastName}, " "))
	case "D":
		dname := strings.Join([]string{r.Records.Doctor.FirstName, r.Records.Doctor.LastName}, " ")
		switch {
		case dname != "" && r.Records.Doctor.Facility != "":
			pdf.Printf("%s (%s)", dname, r.Records.Doctor.Facility)
		case dname != "":
			pdf.Printf(dname)
		case r.Records.Doctor.Facility != "":
			pdf.Printf(r.Records.Doctor.Facility)
		}
	case "T":
		tname := strings.Join([]string{r.Records.ThirdParty.FirstName, r.Records.ThirdParty.LastName}, " ")
		switch {
		case tname != "" && r.Records.ThirdParty.Company != "":
			pdf.Printf("%s (%s)", tname, r.Records.ThirdParty.Company)
		case tname != "":
			pdf.Printf(tname)
		case r.Records.ThirdParty.Company != "":
			pdf.Printf(r.Records.ThirdParty.Company)
		}
	}

	// Recipient: Email
	pdf.x = xCol1
	pdf.y = yRowB3
	switch r.Records.Recipient {
	case "P":
		pdf.Printf(r.Patient.Email)
	case "D":
		pdf.Printf(r.Records.Doctor.Email)
	case "T":
		pdf.Printf(r.Records.ThirdParty.Email)
	}

	// Recipient: Fax
	pdf.x = xCol4
	pdf.y = yRowB3
	switch r.Records.Recipient {
	case "P":
		pdf.Printf(r.Records.Patient.Fax)
	case "D":
		pdf.Printf(r.Records.Doctor.Fax)
	case "T":
		pdf.Printf(r.Records.ThirdParty.Fax)
	}

	var address, city, state, zip string
	switch r.Records.Recipient {
	case "P":
		address = strings.Join([]string{r.Records.Patient.Address, r.Records.Patient.AddressLine2}, " ")
		city = r.Records.Patient.City
		state = r.Records.Patient.State
		zip = r.Records.Patient.ZipCode
	case "D":
		address = strings.Join([]string{r.Records.Doctor.Address, r.Records.Doctor.AddressLine2}, " ")
		city = r.Records.Doctor.City
		state = r.Records.Doctor.State
		zip = r.Records.Doctor.ZipCode
	case "T":
		address = strings.Join([]string{r.Records.ThirdParty.Address, r.Records.ThirdParty.AddressLine2}, " ")
		city = r.Records.ThirdParty.City
		state = r.Records.ThirdParty.State
		zip = r.Records.ThirdParty.ZipCode
	}

	// Recipient: Address
	pdf.x = xCol1
	pdf.y = yRowB4
	pdf.Printf(address)

	// Recipient: City
	pdf.x = xCol1
	pdf.y = yRowB5
	pdf.Printf(city)

	// Recipient: State
	pdf.x = xCol4
	pdf.y = yRowB5
	pdf.Printf(state)

	// Recipient: ZIP Code
	pdf.x = xCol5
	pdf.y = yRowB5
	pdf.Printf(zip)

	// Records: Records From Date
	pdf.x = xCol1
	pdf.y = yRowC0
	pdf.Printf(r.Records.StartDate)

	// Records: Records To Date
	pdf.x = xCol4
	pdf.y = yRowC0
	pdf.Printf(r.Records.EndDate)

	// Records: Records
	pdf.x = xColC1x
	pdf.y = yRowC1x
	if strings.Contains(r.Records.InfoRequested, "R") {
		pdf.Printf("X")
	}

	// Records: Bills
	pdf.x = xColC2x
	pdf.y = yRowC1x
	if strings.Contains(r.Records.InfoRequested, "B") {
		pdf.Printf("X")
	}

	// Records: Films (Images)
	pdf.x = xColC1x
	pdf.y = yRowC2x
	if strings.Contains(r.Records.InfoRequested, "F") {
		pdf.Printf("X")
	}

	// Disability Forms
	pdf.x = xColC2x
	pdf.y = yRowC2x
	if strings.Contains(r.Records.InfoRequested, "D") {
		pdf.Printf("X")
	}

	// Records: Specific Information Requested
	pdf.x = xColC1
	pdf.y = yRowC4
	pdf.Printf(r.Records.SpecificInfoRequested)

	// Reason for Release: Continuing Care
	pdf.x = xColC3x
	pdf.y = yRowC1x
	if r.Records.ReasonForRelease == "Continuing Care" {
		pdf.Printf("X")
	}

	// Reason for Release: Insurance Underwriting
	pdf.x = xColC4x
	pdf.y = yRowC1x
	if r.Records.ReasonForRelease == "Insurance Underwriting" {
		pdf.Printf("X")
	}

	// Reason for Release: Transfer Care
	pdf.x = xColC3x
	pdf.y = yRowC2x
	if r.Records.ReasonForRelease == "Transfer Care" {
		pdf.Printf("X")
	}

	// Reason for Release: Insurance Claim
	pdf.x = xColC4x
	pdf.y = yRowC2x
	if r.Records.ReasonForRelease == "Insurance Claim" {
		pdf.Printf("X")
	}

	// Reason for Release: Second Opinion
	pdf.x = xColC3x
	pdf.y = yRowC3x
	if r.Records.ReasonForRelease == "Second Opinion" {
		pdf.Printf("X")
	}

	// Reason for Release: Undisclosed
	pdf.x = xColC4x
	pdf.y = yRowC3x
	if r.Records.ReasonForRelease == "Undisclosed" {
		pdf.Printf("X")
	}

	// Reason for Release: Personal
	pdf.x = xColC3x
	pdf.y = yRowC4x
	if r.Records.ReasonForRelease == "Personal" {
		pdf.Printf("X")
	}

	// Reason for Release: VRO
	pdf.x = xColC4x
	pdf.y = yRowC4x
	if r.Records.ReasonForRelease == "VRO" {
		pdf.Printf("X")
	}

	// Reason for Release: Litigation
	pdf.x = xColC3x
	pdf.y = yRowC5x
	if r.Records.ReasonForRelease == "Litigation" {
		pdf.Printf("X")
	}

	// Reason for Release: Disability Form
	pdf.x = xColC4x
	pdf.y = yRowC5x
	if r.Records.ReasonForRelease == "Disability Form" {
		pdf.Printf("X")
	}

	// Doctor/Facility:
	pdf.x = xCol1
	pdf.y = yRowD1
	dname := strings.Join([]string{r.Doctor.FirstName, r.Doctor.LastName}, " ")
	switch {
	case dname != "" && r.Doctor.Facility != "":
		pdf.Printf("%s (%s)", dname, r.Doctor.Facility)
	case dname != "":
		pdf.Printf(dname)
	case r.Doctor.Facility != "":
		pdf.Printf(r.Doctor.Facility)
	}

	// Doctor/Facility: Phone Number
	pdf.x = xCol1
	pdf.y = yRowD2
	pdf.Printf(r.Doctor.PhoneNumber)

	// Doctor/Facility: Fax
	pdf.x = xCol4
	pdf.y = yRowD2
	pdf.Printf(r.Doctor.Fax)

	// Address
	pdf.x = xCol1
	pdf.y = yRowD3
	pdf.Printf(strings.Join([]string{r.Doctor.Address, r.Doctor.AddressLine2}, " "))

	// City
	pdf.x = xCol1
	pdf.y = yRowD4
	pdf.Printf(r.Doctor.City)

	// State
	pdf.x = xCol4
	pdf.y = yRowD4
	pdf.Printf(r.Doctor.State)

	// ZIP Code
	pdf.x = xCol5
	pdf.y = yRowD4
	pdf.Printf(r.Doctor.ZipCode)

	// Signature: Requestor
	pdf.x = xColE1
	pdf.y = yRowE1
	pdf.Printf(r.Summary.Signature)

	// Signature: Requestor Email
	pdf.x = xColE1
	pdf.y = yRowE2
	pdf.Printf(r.Summary.Email)

	if r.Patient.ID != "" {
		pdf.x = xColE1
		pdf.y = yRowE3
		pdf.Printf(r.Patient.ID)
	}

	return nil
}

// LoadProfilePic ...
func (pdf *PDF) LoadProfilePic(path string) error {
	fp, err := os.Open(path)
	if err != nil {
		return errors.Wrapf(err, "error opening profile picture %s", path)
	}
	defer fp.Close()

	pic, _, err := image.Decode(fp)
	if err != nil {
		return errors.Wrapf(err, "error decoding profile picture %s", path)
	}

	b := pic.Bounds()
	w := float64(b.Max.X-b.Min.X) / 96
	h := float64(b.Max.Y-b.Min.Y) / 96
	scale := math.Min(picWidth/w, picHeight/h)
	w *= scale
	h *= scale
	x := picCenterX - (w / 2)
	y := picCenterY - (h / 2)
	rect := &gopdf.Rect{W: w, H: h}
	pdf.Image(path, x, y, rect)
	pdf.SetX(x)
	pdf.SetY(y)
	pdf.CellWithOption(rect, "", gopdf.CellOption{Border: gopdf.Left | gopdf.Right | gopdf.Top | gopdf.Bottom})

	return nil
}

// Save ...
func (pdf *PDF) Save(path string) error {
	pdf.WritePdf(path)
	return nil
}
