# API Documentation

## Overview

This documentation covers a set of commonly used REST APIs that will come in handy when building your next project. Although self-hosting is recommended, you can use the public server if desired.

---

## Text Storage API

### POST /store-text

This endpoint allows users to store text.

#### Request

- **Method:** POST
- **URL:** `/store-text`
- **Content-Type:** `application/json`

#### Request Body

The request body must be a JSON object containing the following field:

- `text` (string, required): The text to be stored. It must not exceed 50,000 characters.

#### Response

- **Status Code:** 
  - `200 OK` - If the text is successfully stored.
  - `400 Bad Request` - If the text is missing or exceeds the character limit.

- **Response Body:**
  - On success:
    ```json
    {
      "url": "http://localhost:<PORT>/get-text/<id>"
    }
    ```
  - On error:
    ```json
    {
      "error": "Text is required"
    }
    ```
    or
    ```json
    {
      "error": "Text exceeds 50,000 character limit"
    }
    ```

#### Example Request

```bash
curl -X POST http://localhost:<PORT>/store-text \
-H "Content-Type: application/json" \
-d '{"text": "Your text here"}'
```

## GET /get-weather

> This is unavailable in the public API. You must self-host to use this.

This endpoint retrieves the current weather information for a specified city.

#### Request

- **Method:** GET
- **URL:** `/get-weather`
- **Query Parameters:**
  - `city` (string, required): The name of the city for which to retrieve weather information.

#### Response

- **Status Code:**
  - `200 OK` - If the weather information is successfully retrieved.
  - `400 Bad Request` - If the city parameter is missing.
  - `500 Internal Server Error` - If there is an error while fetching data from the weather API.

- **Response Body:**
  - On success: The weather data returned from the OpenWeatherMap API in JSON format.
  - On error (missing city):
    ```json
    {
      "error": "City is required"
    }
    ```
  - On error (internal server error):
    ```json
    {
      "error": "Internal server error"
    }
    ```

#### Example Request

```bash
curl '/get-weather?city=London'
```

## Generate UUID

Used to generate a UUID

```bash
curl /generate-uuid
```

**Example response**

```json
{"uuid":"5559eab9-e763-4dad-bc2b-3844852aee20"}
```

## Convert Timestamp

Used to convert a millisecond time to human-readable timestamp.

```bash
curl /convert-timestamp?timestamp=1708545600
```

**Example response**

```json
{
  "timestamp": "1708545600",
  "datetime": "2024-02-21T20:00:00.000Z"
}
```

## Currency Exchange

Used to convert the prices between two currencies.

```bash
curl '/get-currency-exchange?base=USD&target=INR'
```

> Please make sure that you put the base and target currency code in CAPITALS.

**Example response**

```json
{
  "base": "USD",
  "target": "INR",
  "rate": 87.32
}
```
