#!/usr/bin/env bash
source /conf/env
cd /server
./bin/portal -log syslog > /dev/null 2> /dev/null < /dev/null &
