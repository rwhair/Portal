package main // import "github.com/rrsmedical/cmd/reqfetch"

import (
	"flag"
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/pkg/errors"
)

const (
	awsRegion   = "us-west-2"
	awsS3Bucket = "rrs-portal-requests"
)

// Session wraps an AWS session with helpers for accessing various services.
type Session struct {
	aws *session.Session
}

// NewSession returns a Session for the given AWS region.
func NewSession(region string) *Session {
	return &Session{aws: session.Must(session.NewSession(&aws.Config{Region: aws.String(region)}))}
}

// Bucket returns the S3 bucket with the given name.
func (s *Session) Bucket(name string) *Bucket {
	return &Bucket{
		name:     name,
		svc:      s3.New(s.aws),
		download: s3manager.NewDownloader(s.aws),
	}
}

// Bucket provides access to a single AWS S3 bucket.
type Bucket struct {
	name     string
	svc      *s3.S3
	download *s3manager.Downloader
}

// ListObjectsByPrefix returns up to 1000 objects from the bucket with keys
// that match the given prefix.
func (b *Bucket) ListObjectsByPrefix(prefix string) ([]*s3.Object, error) {
	input := &s3.ListObjectsV2Input{
		Bucket: aws.String(b.name),
		Prefix: aws.String(prefix),
	}
	result, err := b.svc.ListObjectsV2(input)
	if err != nil {
		return nil, err
	}
	return result.Contents, nil
}

// RenameObject performs a logical rename by creating a copy of an object
// in the S3 bucket and then deleting the original.
func (b *Bucket) RenameObject(oldkey, newkey string) (err error) {
	if err := b.CopyObject(oldkey, newkey); err != nil {
		return errors.Wrapf(err, "RenameObject: error copying old object")
	}
	if err := b.DeleteObject(oldkey); err != nil {
		return errors.Wrapf(err, "RenameObject: error deleting old object")
	}
	return nil
}

// DeleteObject deletes an object from the bucket.
func (b *Bucket) DeleteObject(key string) error {
	input := &s3.DeleteObjectInput{
		Bucket: aws.String(b.name),
		Key:    aws.String(key),
	}
	if _, err := b.svc.DeleteObject(input); err != nil {
		return errors.Wrapf(err, "DeleteObject: error deleting %s", key)
	}
	return nil
}

// CopyObject creates a copy of an object in the bucket with a new key.
func (b *Bucket) CopyObject(oldkey, newkey string) error {
	input := &s3.CopyObjectInput{
		CopySource: aws.String(url.PathEscape(fmt.Sprintf("%s/%s", b.name, oldkey))),
		Bucket:     aws.String(b.name),
		Key:        aws.String(newkey),
	}
	if _, err := b.svc.CopyObject(input); err != nil {
		return errors.Wrapf(err, "CopyObject: error copying %s to %s", oldkey, newkey)
	}
	return nil
}

// DownloadFile downloads an object from the bucket and saves it to
// the given path.
func (b *Bucket) DownloadFile(key string, path string) error {
	input := &s3.GetObjectInput{
		Bucket: aws.String(b.name),
		Key:    aws.String(key),
	}
	result, err := b.svc.GetObject(input)
	if err != nil {
		return errors.Wrapf(err, "DownloadFile: error fetching object %s", key)
	}
	defer result.Body.Close()

	if err := os.MkdirAll(filepath.Dir(path), 0777); err != nil {
		return errors.Wrapf(err, "DownloadFile: error creating directory %s", filepath.Dir(path))
	}

	fp, err := os.Create(path)
	if err != nil {
		return errors.Wrapf(err, "DownloadFile: error creating file %s", path)
	}
	defer fp.Close()

	if _, err := io.Copy(fp, result.Body); err != nil {
		fp.Close()
		os.Remove(fp.Name())
		return errors.Wrapf(err, "DownloadFile: error writing file %s", path)
	}

	return nil
}

func main() {
	log.SetFlags(0)
	log.SetPrefix("reqfetch: ")

	var (
		awsAccessKeyID, awsSecretAccessKey, outputDir string
	)

	flag.StringVar(&awsAccessKeyID, "id", "", "AWS access key ID")
	flag.StringVar(&awsSecretAccessKey, "key", "", "AWS secret access key")
	flag.StringVar(&outputDir, "o", ".", "output directory")

	flag.Parse()

	if awsAccessKeyID == "" || awsSecretAccessKey == "" {
		flag.Usage()
		os.Exit(1)
	}

	os.Setenv("AWS_ACCESS_KEY_ID", awsAccessKeyID)
	os.Setenv("AWS_SECRET_ACCESS_KEY", awsSecretAccessKey)

	session := NewSession(awsRegion)
	bucket := session.Bucket(awsS3Bucket)
	objects, err := bucket.ListObjectsByPrefix("inbox/")
	if err != nil {
		log.Fatalln(err)
	}

	fetched := 0
	for i := 0; i < len(objects); i++ {
		key := *objects[i].Key
		if key == "inbox/" {
			continue
		}
		path := filepath.Join(outputDir, strings.TrimPrefix(key, "inbox/"))
		if err := bucket.DownloadFile(key, path); err != nil {
			log.Println(errors.Wrapf(err, "%s: error downloading file from S3", path))
			continue
		}
		fetched++
		key2 := strings.Replace(key, "inbox/", "archive/", 1)
		if err := bucket.RenameObject(key, key2); err != nil {
			log.Println(errors.Wrapf(err, "%s: error archiving object in S3", path))
		}
	}

	log.Printf("%d file(s) fetched\n", fetched)
}
