# Cimet Admin Console

- This project uses KeystoneJS, [get familiarised here](https://keystonejs.com/docs)

### Prerequisites

- NodeJS == 16.16.0 (install [nvm](https://github.com/creationix/nvm) and run `nvm install 16.16.0`)
- Postgres 13
  - You can spin up postgres instance on your local machine using docker (recommended).
  - You can directly install and run postgres on your machine as a background service.

### Docker Setup

- [Install docker if not already present](https://docs.docker.com/desktop/install)
- Run `docker ps -a` to see postgres is running already, if not do the next step
- Run `docker compose -f zarf/docker/docker-compose.yaml up -d` to start postgres on docker containers.

## Getting Started

- Clone this project from Github
- Install npm packages `yarn install`
- Create .env file in the folder `cp .env.example .env`
- Start the server `yarn dev`
- Visit `http://localhost:3004` to view the website

## Testing

## Run HTTPS locally

generate self-signed certificates locally in your project folder

```
  openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
  openssl rsa -in keytmp.pem -out key.pem
```

- You can access the website now like this, `https://localhost:3004`

## Helpers

- Follow this guide for clean migrations - https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/squashing-migrations

### Postgres dump

- psql --host localhost --port 5432 --username prisma --dbname epic < backup.sql
