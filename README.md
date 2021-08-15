# Backend Service

A Node.js backend service application.

## Installation

```bash
$ npm install
```

## Usage

### Start server

```bash
$ npm run start
```

### Run in Docker

```bash
$ docker build -t backend-service .

$ docker compose up -d
```

## Heroku

### App Setup

```bash
$ heroku login

$ heroku create <app-name>

# Add Postgres add-on to app
$ heroku addons:create heroku-postgresql:hobby-dev

# Set config var to access Postgres without SSL
$ heroku config:set PGSSLMODE=no-verify

# Set config vars that we need for our app
$ heroku config:set JWT_SECRET=some_secret
$ heroku config:set JWT_EXPIRY=900
$ heroku config:set SALT_ROUNDS=10

# Set the stack to container for Docker deployment
$ heroku stack:set container
```

### Automatic Deployment from GitHub

1. Go to your Heroku app dashboard > `Deploy` tab
2. Under `Deployment method`, select `GitHub` and allow access
3. Search and connect to your GitHub repository
4. Under `Automatic deploys`:
   1. Check `Wait for CI to pass before deploy`
   2. Select `Enable Automatic Deploys`
