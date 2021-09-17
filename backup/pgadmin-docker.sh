#!/usr/local/bin/bash

docker run \
  -p 80:80 \
  -e 'PGADMIN_DEFAULT_EMAIL=james.ee.sg@gmail.com' \
  -e 'PGADMIN_DEFAULT_PASSWORD=mypassword'\
  --name dev-pgadmin -d \
  dpage/pgadmin4


#docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' dev-postgres
