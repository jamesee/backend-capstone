#!/usr/local/bin/bash


docker run -d --name dev-postgres \
 -e POSTGRES_PASSWORD=password \
 -v /Users/james/Developments/SGInnovate/backend-capstone/sql:/home/james/sql  \
 -v postgres-data:/var/lib/postgresql/data  \
 -p 5432:5432 \
 postgres
