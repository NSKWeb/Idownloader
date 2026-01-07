# Backend API

Base URL (dev): `http://localhost:4000/api`

## Response format

Success:

```json
{ "data": { /* payload */ } }
```

Error:

```json
{
  "error": {
    "message": "Human readable message",
    "code": "SOME_CODE",
    "details": null
  }
}
```

## Auth

### POST /auth/register
Body:

```json
{ "email": "user@example.com", "password": "strong password" }
```

Returns:

```json
{ "data": { "user": {"id":"...","email":"..."}, "tokens": {"accessToken":"...","refreshToken":"..."} } }
```

### POST /auth/login
Body:

```json
{ "email": "user@example.com", "password": "strong password" }
```

### POST /auth/refresh
Body:

```json
{ "refreshToken": "..." }
```

### POST /auth/logout
Body:

```json
{ "refreshToken": "..." }
```

## Profiles (protected)

### GET /profiles
### POST /profiles
### GET /profiles/:id
### PUT /profiles/:id
### DELETE /profiles/:id

## Automations (protected)

### GET /automations
### POST /automations
### DELETE /automations/:id

## User (protected)

### GET /user
### PUT /user
