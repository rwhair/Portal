package main

import (
	"database/sql"

	"github.com/labstack/echo"
)

// SendTo ...
type SendTo string

// SendTo ...
const (
	SendToDoctor     = SendTo("D")
	SendToPatient    = SendTo("P")
	SendToThirdParty = SendTo("T")
)

// DeliveryMethod ...
type DeliveryMethod string

// DeliveryMethod ...
const (
	DeliveryElectronic = DeliveryMethod("E")
	DeliveryFax        = DeliveryMethod("F")
	DeliveryMail       = DeliveryMethod("M")
)

// InfoRequested ...
type InfoRequested string

// InfoRequested ...
const (
	InfoRecords           = InfoRequested("R")
	InfoFilms             = InfoRequested("F")
	InfoBills             = InfoRequested("B")
	InfoRecordsFilms      = InfoRecords + InfoFilms
	InfoRecordsFilmsBills = InfoRecords + InfoFilms + InfoBills
	InfoDisabilityForms   = InfoRequested("D")
)

// DeliveryTimeframe ...
type DeliveryTimeframe string

// DeliveryTimeframe ...
const (
	// 1-2 days
	DeliveryExpedited = "F"
	// 3-5 days
	DeliveryStandard = "S"
)

// Pricing ...
type Pricing struct {
	Code                string            `json:"code"`
	SendTo              SendTo            `json:"sendTo"`
	InfoRequested       InfoRequested     `json:"infoRequested"`
	DeliveryMethod      DeliveryMethod    `json:"deliveryMethod"`
	DeliveryTimeframe   DeliveryTimeframe `json:"deliveryTimeframe"`
	BaseChargeCents     int               `json:"baseChargeCents"`
	DeliveryChargeCents int               `json:"deliveryChargeCents"`
}

// PricingTable ...
type PricingTable []Pricing

// Get ...
func (pt PricingTable) Get(code string) PricingTable {
	var pts PricingTable
	for i := 0; i < len(pt); i++ {
		if pt[i].Code == code {
			pts = append(pts, pt[i])
		}
	}
	return pts
}

func initPricingTable(db *sql.DB) (PricingTable, error) {
	rows, err := db.Query(`
		select 
			code, 
			send_to, 
			info_requested, 
			delivery_method, 			
			delivery_timeframe, 
			base_charge_cents,
			delivery_charge_cents
		from portal_pricing
	`)
	if err != nil {
		return nil, err
	}

	var pricingTable PricingTable
	for rows.Next() {
		var p Pricing
		if err := rows.Scan(&p.Code, &p.SendTo, &p.InfoRequested, &p.DeliveryMethod, &p.DeliveryTimeframe, &p.BaseChargeCents, &p.DeliveryChargeCents); err != nil {
			return nil, err
		}
		pricingTable = append(pricingTable, p)
	}

	return pricingTable, nil
}

func handlePricing(ctx echo.Context) (err error) {
	c := ctx.(*Context)
	return c.JSON(200, c.pricing)
}
