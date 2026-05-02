# Profiles API

Production-ready Node.js REST API that accepts a name, enriches it using external services, classifies the result, stores it in SQLite, and exposes CRUD endpoints with filtering.

## Tech Stack

- Node.js + Express
- Axios (external API calls)
- Sequelize + SQLite
- UUID v7 (`uuid` package)

## External APIs Used

- [Genderize](https://api.genderize.io?name=ella)
- [Agify](https://api.agify.io?name=ella)
- [Nationalize](https://api.nationalize.io?name=ella)

## Upstream Validation Rules (Strict)

The API enforces strict type/numeric validation on upstream responses before classification and persistence. If any rule fails, the API returns `502` with:

```json
{
  "status": "error",
  "message": "<ExternalApi> returned an invalid response"
}
```

Rules:

- `Genderize` must include:
  - `gender` as `string`
  - `probability` as `number`
  - `count` as `number` and `count !== 0`
- `Agify` must include:
  - `age` as `number`
- `Nationalize` must include:
  - `country` as a non-empty array
  - at least one country object where:
    - `country_id` is `string`
    - `probability` is `number`

Only validated Nationalize countries are used for top-country selection.

## Project Structure

```text
src/
  server.js
  app.js
  routes/
    profiles.js
  controllers/
    profileController.js
  services/
    genderizeService.js
    agifyService.js
    nationalizeService.js
    profileService.js
  models/
    profileModel.js
  database/
    db.js
  utils/
    validator.js
    classification.js
    errors.js
```

## Setup

```bash
npm install
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Default base URL:

```text
http://localhost:3000
```

---

## API Reference

### 1) POST `/api/profiles`

Creates a profile for a given `name`, unless it already exists (idempotent by unique name).

#### Success (new profile) - `201`

```bash
curl.exe -i -X POST "http://localhost:3000/api/profiles" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"ella\"}"
```

Response:

```json
{
  "status": "success",
  "data": {
    "id": "018f....",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 12345,
    "age": 29,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.45,
    "created_at": "2026-05-01T15:00:00.000Z"
  }
}
```

#### Success (already exists) - `200`

Run the same request again:

```bash
curl.exe -i -X POST "http://localhost:3000/api/profiles" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"ella\"}"
```

Response:

```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": {
    "id": "018f....",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 12345,
    "age": 29,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.45,
    "created_at": "2026-05-01T15:00:00.000Z"
  }
}
```

#### Missing/empty name - `400`

Missing field:

```bash
curl.exe -i -X POST "http://localhost:3000/api/profiles" ^
  -H "Content-Type: application/json" ^
  -d "{}"
```

Empty string:

```bash
curl.exe -i -X POST "http://localhost:3000/api/profiles" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"   \"}"
```

Error format:

```json
{
  "status": "error",
  "message": "name is required"
}
```

or

```json
{
  "status": "error",
  "message": "name cannot be empty"
}
```

#### Invalid type - `422`

```bash
curl.exe -i -X POST "http://localhost:3000/api/profiles" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":123}"
```

Response:

```json
{
  "status": "error",
  "message": "name must be a string"
}
```

#### External API invalid response - `502`

Use a synthetic/uncommon name to increase chance of null/empty upstream data:

```bash
curl.exe -i -X POST "http://localhost:3000/api/profiles" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"zzzzzzzzzzzzzzzzzz\"}"
```

Possible response format (depends on which upstream fails validation):

```json
{
  "status": "error",
  "message": "Genderize returned an invalid response"
}
```

or

```json
{
  "status": "error",
  "message": "Agify returned an invalid response"
}
```

or

```json
{
  "status": "error",
  "message": "Nationalize returned an invalid response"
}
```

---

### 2) GET `/api/profiles/:id`

#### Success - `200`

First create a profile and copy its `id`, then:

```bash
curl.exe -i "http://localhost:3000/api/profiles/<PROFILE_ID>"
```

Response:

```json
{
  "status": "success",
  "data": {
    "id": "018f....",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 12345,
    "age": 29,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.45,
    "created_at": "2026-05-01T15:00:00.000Z"
  }
}
```

#### Not found - `404`

```bash
curl.exe -i "http://localhost:3000/api/profiles/00000000-0000-7000-8000-000000000000"
```

Response:

```json
{
  "status": "error",
  "message": "Profile not found"
}
```

---

### 3) GET `/api/profiles`

Returns all profiles with optional case-insensitive filters:

- `gender`
- `country_id`
- `age_group`

#### Success (all) - `200`

```bash
curl.exe -i "http://localhost:3000/api/profiles"
```

#### Success (filtered, case-insensitive) - `200`

```bash
curl.exe -i "http://localhost:3000/api/profiles?gender=FEMALE&country_id=us&age_group=ADULT"
```

Response shape:

```json
{
  "status": "success",
  "count": 1,
  "data": [
    {
      "id": "018f....",
      "name": "ella",
      "gender": "female",
      "gender_probability": 0.99,
      "sample_size": 12345,
      "age": 29,
      "age_group": "adult",
      "country_id": "US",
      "country_probability": 0.45,
      "created_at": "2026-05-01T15:00:00.000Z"
    }
  ]
}
```

---

### 4) DELETE `/api/profiles/:id`

#### Success - `204`

```bash
curl.exe -i -X DELETE "http://localhost:3000/api/profiles/<PROFILE_ID>"
```

No response body.

#### Not found - `404`

```bash
curl.exe -i -X DELETE "http://localhost:3000/api/profiles/00000000-0000-7000-8000-000000000000"
```

Response:

```json
{
  "status": "error",
  "message": "Profile not found"
}
```

---

## Global 404 (Unknown Route) - `404`

```bash
curl.exe -i "http://localhost:3000/api/unknown"
```

Response:

```json
{
  "status": "error",
  "message": "Route not found"
}
```

## Internal Error - `500`

The API returns:

```json
{
  "status": "error",
  "message": "Internal server error"
}
```

One practical way to simulate a server-side `500` is to force a DB write failure:

1. Stop the API.
2. Make `profiles.sqlite` read-only.
3. Start the API.
4. Call `POST /api/profiles`.

Example request:

```bash
curl.exe -i -X POST "http://localhost:3000/api/profiles" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"force500\"}"
```

---

## Notes

- IDs are UUID v7.
- `created_at` is generated dynamically in UTC ISO 8601 format.
- Name uniqueness guarantees idempotent profile creation.
- CORS header is enabled: `Access-Control-Allow-Origin: *`.
