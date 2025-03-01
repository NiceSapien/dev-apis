These are a few, commonly used, REST APIs that will come in handy when building your next project. Although I recommend you to self-host these, you can use the public server if you want!

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
