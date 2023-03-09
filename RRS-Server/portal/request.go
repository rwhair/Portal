package main

// Request represents the payload of a request sent by the client.
type Request struct {
	Patient struct {
		FirstName    string `json:"firstName"`
		LastName     string `json:"lastName"`
		AKA          string `json:"aka"`
		DateOfBirth  string `json:"dateOfBirth"`
		SSN          string `json:"ssn"`
		Email        string `json:"email"`
		ConfirmEmail string `json:"confirmEmail"`
		PhoneNumber  string `json:"phoneNumber"`
		ID           string `json:"id"`
	} `json:"patient"`
	Records struct {
		Recipient             string `json:"recipient"`
		StartDate             string `json:"startDate"`
		EndDate               string `json:"endDate"`
		InfoRequested         string `json:"infoRequested"`
		ReasonForRelease      string `json:"reasonForRelease"`
		SpecificInfoRequested string `json:"specificInfoRequested"`
		DeliveryMethod        string `json:"deliveryMethod"`
		Timeframe             string `json:"timeframe"`
		Patient               struct {
			FirstName    string `json:"firstName"`
			LastName     string `json:"lastName"`
			Fax          string `json:"fax"`
			ConfirmFax   string `json:"confirmFax"`
			Email        string `json:"email"`
			ConfirmEmail string `json:"confirmEmail"`
			Address      string `json:"address"`
			AddressLine2 string `json:"addressLine2"`
			City         string `json:"city"`
			State        string `json:"state"`
			ZipCode      string `json:"zipCode"`
		} `json:"patient"`
		Doctor struct {
			Facility     string `json:"facility"`
			FirstName    string `json:"firstName"`
			LastName     string `json:"lastName"`
			Fax          string `json:"fax"`
			ConfirmFax   string `json:"confirmFax"`
			Email        string `json:"email"`
			ConfirmEmail string `json:"confirmEmail"`
			Address      string `json:"address"`
			AddressLine2 string `json:"addressLine2"`
			City         string `json:"city"`
			State        string `json:"state"`
			ZipCode      string `json:"zipCode"`
		} `json:"doctor"`
		ThirdParty struct {
			Company      string `json:"company"`
			FirstName    string `json:"firstName"`
			LastName     string `json:"lastName"`
			Fax          string `json:"fax"`
			ConfirmFax   string `json:"confirmFax"`
			Email        string `json:"email"`
			ConfirmEmail string `json:"confirmEmail"`
			Address      string `json:"address"`
			AddressLine2 string `json:"addressLine2"`
			City         string `json:"city"`
			State        string `json:"state"`
			ZipCode      string `json:"zipCode"`
		} `json:"thirdParty"`
	}
	Doctor struct {
		Facility     string `json:"facility"`
		FirstName    string `json:"firstName"`
		LastName     string `json:"lastName"`
		PhoneNumber  string `json:"phoneNumber"`
		Fax          string `json:"fax"`
		Address      string `json:"address"`
		AddressLine2 string `json:"addressLine2"`
		City         string `json:"city"`
		State        string `json:"state"`
		ZipCode      string `json:"zipCode"`
	}
	Upload struct {
		SSN string `json:"ssn"`
		ID  string `json:"id"`
	} `json:"upload"`
	Summary struct {
		Email              string `json:"email"`
		ConfirmEmail       string `json:"confirmEmail"`
		EmailSameAsPatient bool   `json:"emailSameAsPatient"`
		Acknowledge        bool   `json:"acknowledge"`
		Signature          string `json:"signature"`
		Token              string `json:"token"`
		Payment            struct {
			Type       string `json:"type"`
			CreditCard struct {
				Number       string `json:"number"`
				Name         string `json:"name"`
				ExpDate      string `json:"expDate"`
				SecurityCode string `json:"securityCode"`
				FirstName    string `json:"firstName"`
				LastName     string `json:"lastName"`
				Address      string `json:"address"`
				AddressLine2 string `json:"addressLine2"`
				City         string `json:"city"`
				State        string `json:"state"`
				ZipCode      string `json:"zipCode"`
			} `json:"creditCard"`
			BankTransfer struct {
				AccountType   string `json:"accountType"`
				AccountName   string `json:"accountName"`
				RoutingNumber string `json:"routingNumber"`
				AccountNumber string `json:"accountNumber"`
				BankName      string `json:"bankName"`
				CheckNumber   string `json:"checkNumber"`
				Amount        string `json:"amount"`
				FirstName     string `json:"firstName"`
				LastName      string `json:"lastName"`
				Address       string `json:"address"`
				AddressLine2  string `json:"addressLine2"`
				City          string `json:"city"`
				State         string `json:"state"`
				ZipCode       string `json:"zipCode"`
			} `json:"bankTransfer"`
		} `json:"payment"`
	} `json:"summary"`
	Request struct {
		User struct {
			Type string `json:"type"`
		} `json:"user"`
		Request struct {
			Type string `json:"type"`
		}
	} `json:"request"`
}

func (r *Request) getInfoRequested() string {
	switch r.Records.InfoRequested {
	case "R":
		return "records"
	case "F":
		return "films"
	case "B":
		return "bills"
	case "RF":
		return "records and films"
	case "RFB":
		return "records, films, and bills"
	case "D":
		return "disability forms"
	default:
		return "records"
	}
}

func (r *Request) getDestination() string {
	switch r.Records.Recipient {
	case "P":
		return "you"
	case "D":
		if r.Records.Doctor.Facility != "" {
			return r.Records.Doctor.Facility
		}
		return "your doctor"
	case "T":
		if r.Records.ThirdParty.Company != "" {
			return r.Records.ThirdParty.Company
		}
		return "a third party"
	default:
		return "your chosen recipient"
	}
}

func (r *Request) getShippingMethod() string {
	switch r.Records.DeliveryMethod {
	case "E":
		return "email"
	case "F":
		return "fax"
	case "M":
		return "mail"
	default:
		return "email"
	}
}

func (r *Request) getDeliveryTimeframe() string {
	switch r.Records.Timeframe {
	case "F":
		return "1-2 days"
	case "S":
		return "3-5 days"
	default:
		return "7 days"
	}
}
