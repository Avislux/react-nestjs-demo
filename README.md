# Running project with Docker
Node will need to be installed for this to work. Ideally `prisma generate` is part of the Docker build process, 
but I did not have time to smooth that out. Environment variables have been set in docker-compose.yml, 
but they are not being read from there properly so I've committed the .env files to make these smooth out testing.
Run the following in order:
```
cd server
npx prisma generate
cd ..
docker compose up -d
``` 
In the backend container, run
```
npx prisma db push
npx prisma db seed
```

Visit http://localhost

If you get an issue with the backend container failing due to an error with binaryTargets do the following:
* Make copy of the error from Docker regarding the suggested change to `binaryTargets`
* Run `docker compose down`
* Delete the backend image in Docker
* Modify `server/prisma/schema.prisma` with the suggested change from the error.
* Run `npx prisma generate` in your regular terminal outside docker in the `server` directory
* Run `docker compose up -d` at the root of the project again.
# Test Credentials
* email: `alice@example.com`
* password: `password`


# Backup if docker compose does not work:
Assumes you are on a Windows environment with postgres already running and have Node installed.

Without docker, run the following in separate console windows.

```
cd server
npx prisma generate
npx prisma db seed
npm start
```
```
cd app
npm run dev
```


Create a `server/.env` file setting DATABASE_URL to
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
```
Create a `app/.env` file
```
VITE_API_HOST="http://localhost:3000"
```
Test at http://localhost:5173/


# API
All endpoints other than `auth/login` require an Authorization header. This header has the value of `Bearer tokenString` where tokenString is the `access_token` parameter returned from the `auth/login` endpoint
## POST /auth/login
Takes JSON payload with post parameters
```
email: alice@example.com
password: "password"
```
### Response
```
{
    "access_token": "eyJhbGciOiJI.....",
    "name": "Alice"
}
```
### Error
```
{
    "message": "The provided credentials are invalid.",
    "error": "Unauthorized",
    "statusCode": 401
}
```
## GET /invoices
Gets all invoices
## GET /invoices/:id
Gets data of an invoice with a specific ID.
## GET /invoices/total
Requires a query parameter `due_date` in YYYY-MM-DD format

