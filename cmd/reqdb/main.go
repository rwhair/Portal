package main

import (
	"context"
	"flag"
	"io"
	"log"
	"os"
	"strings"
	"time"

	"gocloud.dev/blob"
	_ "gocloud.dev/blob/fileblob"
	_ "gocloud.dev/blob/s3blob"
	"gocloud.dev/postgres"
	_ "gocloud.dev/postgres/awspostgres"
)

/*
awspostgres://postgres@rrs-dev-db.c5pecaqqi39s.us-west-2.rds.amazonaws.com/rrs-dev-db
"s3://rrs-portal-requests/?region=us-west-2")
*/

func main() {
	var config struct {
		dbURL     string
		bucketURL string
	}

	flag.StringVar(&config.dbURL, "db", "", "database URL")
	flag.StringVar(&config.bucketURL, "blob", "", "blob bucket URL")

	flag.Parse()

	if config.dbURL == "" || config.bucketURL == "" {
		flag.Usage()
		os.Exit(1)
	}

	ctx := context.Background()

	db, err := postgres.Open(ctx, config.dbURL)
	if err != nil {
		log.Fatalln(err)
	}
	defer db.Close()

	ts := new(time.Time)
	row := db.QueryRowContext(ctx, "select max(request_timestamp) from portal_request")
	if err := row.Scan(&ts); err != nil {
		log.Fatalln(err)
	}

	if ts == nil {
		tm := time.Date(1970, 1, 1, 0, 0, 0, 0, time.Local)
		ts = &tm
	}

	bucket, err := blob.OpenBucket(ctx, config.bucketURL)
	if err != nil {
		log.Fatalln(err)
	}
	defer bucket.Close()

	it := bucket.List(&blob.ListOptions{Prefix: "metadata/"})
	for {
		obj, err := it.Next(ctx)
		if err == io.EOF {
			break
		}

		if err != nil {
			log.Fatalln(err)
		}

		if strings.HasSuffix(obj.Key, ".json") && obj.ModTime.After(*ts) {
			buf, err := bucket.ReadAll(ctx, obj.Key)
			if err != nil {
				log.Printf("%s: %s\n", obj.Key, err)
				continue
			}

			if _, err := db.ExecContext(ctx, "call json_insert_portal_request($1, $2, $3)", strings.TrimSuffix(strings.TrimPrefix(obj.Key, "metadata/"), ".json"), obj.ModTime, string(buf)); err != nil {
				log.Printf("%s: %s\n", obj.Key, err)
				continue
			}
		}
	}
}
