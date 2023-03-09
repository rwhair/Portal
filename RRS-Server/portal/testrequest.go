package main

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

func addFormFile(w *multipart.Writer, fieldName string, path string) {
	fp, err := os.Open(path)
	if err != nil {
		log.Fatalln(err)
	}
	defer fp.Close()

	part, err := w.CreateFormFile(fieldName, filepath.Base(path))
	if err != nil {
		log.Fatalln(err)
	}
	io.Copy(part, fp)
}

func submitTestRequest(req string, pic string, docs ...string) {
	log.Println("Entering test mode... waiting 5s for server to start...")
	time.Sleep(5 * time.Second)

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)

	addFormFile(writer, "values", req)
	addFormFile(writer, "image", pic)
	for i := 0; i < len(docs); i++ {
		addFormFile(writer, "document", docs[i])
	}

	if err := writer.Close(); err != nil {
		log.Fatalln(err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	request, err := http.NewRequest("POST", "http://localhost:"+port+"/api/portal/submit", body)
	if err != nil {
		log.Fatalln(err)
	}
	request.Header.Set("Content-Type", writer.FormDataContentType())

	client := new(http.Client)
	response, err := client.Do(request)
	if err != nil {
		log.Fatalln(err)
	}

	buf, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatalln(err)
	}
	response.Body.Close()

	fmt.Printf("Status: %v\n", response.StatusCode)
	fmt.Printf("\n----------Header----------\n")
	fmt.Println(response.Header)
	fmt.Printf("\n---------- Body ----------\n")
	fmt.Println(string(buf))

}
