package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

func pdfTest() error {
	fp, err := os.Open("portal/template/request.json")
	if err != nil {
		return err
	}
	defer fp.Close()

	req := new(Request)
	dec := json.NewDecoder(fp)
	if err := dec.Decode(req); err != nil {
		return err
	}

	picFile, err := os.Open("portal/template/profile.jpg")
	if err != nil {
		return err
	}
	defer picFile.Close()

	picFilePath := picFile.Name()

	if err := picFile.Close(); err != nil {
		return err
	}

	pdfFile, err := ioutil.TempFile("", "*.pdf")
	if err != nil {
		return err
	}

	pdfFilePath := pdfFile.Name()
	pdfFile.Close()

	pdf := new(PDF)

	templatePath, err := filepath.Abs("portal/template/template.pdf")
	if err != nil {
		return err
	}

	if err := pdf.LoadTemplate(templatePath); err != nil {
		return err
	}

	fontPath, err := filepath.Abs("portal/template/Inconsolata-Regular.ttf")
	if err != nil {
		return err
	}

	fontName := "Inconsolata"
	if err := pdf.LoadFont("Inconsolata", fontPath); err != nil {
		return err
	}

	if err := pdf.SetFont(fontName, "", 10); err != nil {
		return err
	}

	if err := pdf.Generate(req); err != nil {
		return err
	}

	if err := pdf.LoadProfilePic(picFilePath); err != nil {
		return err
	}

	if err := pdf.Save(pdfFilePath); err != nil {
		return err
	}

	fmt.Printf("%s\n", pdfFilePath)
	return nil
}
