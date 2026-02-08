# GoRidy Backend API Documentation

## Endpoints

### POST /users/register

#### Description
Register a new user account. Creates a new user with provided credentials and returns an authentication token.

#### Request

**Method:** `POST`

**URL:** `/users/register`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "fullname": {
    "firstname": "string (required, min 3 characters)",
    "lastname": "string (optional, min 3 characters if provided)"
  },
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)"
}
```

#### Request Body Fields

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `fullname.firstname` | String | Yes | Minimum 3 characters |
| `fullname.lastname` | String | No | Minimum 3 characters if provided |
| `email` | String | Yes | Valid email format |
| `password` | String | Yes | Minimum 6 characters |

#### Example Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Responses

##### Success (201 Created)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**Status Code:** `201 Created`

##### Validation Error (400 Bad Request)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid value",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "Jo",
      "msg": "First name must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request`

Returned when:
- Email is not a valid email format
- First name is less than 3 characters
- Password is less than 6 characters
- Required fields are missing

##### Server Error (500 Internal Server Error)

```json
{
  "error": "Error message"
}
```

**Status Code:** `500 Internal Server Error`

Returned when:
- Database connection fails
- Email already exists in database
- Server-side validation error

#### Status Codes

| Code | Description |
|------|-------------|
| `201` | User successfully registered, token and user data returned |
| `400` | Validation error - check response for specific error messages |
| `500` | Internal server error - contact administrator |

#### Notes

- Password is automatically hashed using bcrypt before storage
- Email must be unique across the system
- JWT token is generated and returned for authentication
- The returned user object does not include the password field

---

### POST /users/login

#### Description
Authenticate an existing user. Validates credentials and returns a JWT token and user data on success.

#### Request

**Method:** `POST`

**URL:** `/users/login`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)"
}
```

#### Example Request

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Responses

##### Success (200 OK)

**Example Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzZmNDMyMTljNTNhMDAwMDEyMzQ1NjciLCJpYXQiOjE3MzQ2Nzg2MzJ9.KvJ3X4pY8qZ9wL5nM2oP6rS9tUvWxYz3aB7cD1eF4gH",
  "user": {
    "_id": "676f43219c53a00001234567",
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**Status Code:** `200 OK`

##### Validation Error (400 Bad Request)

```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request`

##### Unauthorized (401 Unauthorized)

```json
{
  "message": "Invalid email or password"
}
```

**Status Code:** `401 Unauthorized`

Returned when credentials are invalid.

##### Server Error (500 Internal Server Error)

```json
{
  "error": "Error message"
}
```

**Status Code:** `500 Internal Server Error`

### GET /users/profile

#### Description
Returns the authenticated user's profile. Requires a valid JWT provided either in the `token` cookie or the `Authorization: Bearer <token>` header.

#### Request

**Method:** `GET`

**URL:** `/users/profile`

**Headers / Cookies:**

- Send cookie: `token=<jwt>` or
- Header: `Authorization: Bearer <jwt>`

#### Responses

##### Success (200 OK)

```json
{
  "_id": "676f43219c53a00001234567",
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com"
}
```

**Status Code:** `200 OK`

##### Unauthorized (401 Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

**Status Code:** `401 Unauthorized`

#### Example Request (cookie)

```bash
curl -X GET http://localhost:3000/users/profile \
  -b "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Request (header)

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### GET /users/logout

#### Description
Logs out the authenticated user by clearing the `token` cookie and storing the JWT in the blacklist so it cannot be reused. Accepts the JWT in the `token` cookie or the `Authorization: Bearer <token>` header.

#### Request

**Method:** `GET`

**URL:** `/users/logout`

**Headers / Cookies:**

- Send cookie: `token=<jwt>` or
- Header: `Authorization: Bearer <jwt>`

#### Responses

##### Success (200 OK)

```json
{
  "message": "Logged out"
}
```

**Status Code:** `200 OK`

##### Unauthorized (401 Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

**Status Code:** `401 Unauthorized`

#### Example Request (cookie)

```bash
curl -X GET http://localhost:3000/users/logout \
  -b "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Request (header)

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### POST /users/login

#### Description
Authenticate an existing user. Validates credentials and returns a JWT token and user data on success.

#### Request

**Method:** `POST`

**URL:** `/users/login`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)"
}
```

#### Example Request

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Responses

##### Success (200 OK)

**Example Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzZmNDMyMTljNTNhMDAwMDEyMzQ1NjciLCJpYXQiOjE3MzQ2Nzg2MzJ9.KvJ3X4pY8qZ9wL5nM2oP6rS9tUvWxYz3aB7cD1eF4gH",
  "user": {
    "_id": "676f43219c53a00001234567",
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**Status Code:** `200 OK`

##### Validation Error (400 Bad Request)

```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request`

##### Unauthorized (401 Unauthorized)

```json
{
  "message": "Invalid email or password"
}
```

**Status Code:** `401 Unauthorized`

Returned when credentials are invalid.

##### Server Error (500 Internal Server Error)

```json
{
  "error": "Error message"
}
```

**Status Code:** `500 Internal Server Error`

---
