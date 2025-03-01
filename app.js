const express = require("express");
const { rateLimit } = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs:  5 * 60 * 1000, // 5 minutes
  limit: 30, // each IP can make up to 30 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});

app.use(limiter);

const textStorage = {};

const generateId = () => crypto.randomBytes(4).toString("hex");

app.post("/store-text", (req, res) => {
    const { text } = req.body;

    // Validate input
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    if (text.length > 50000) {
        return res.status(400).json({ error: "Text exceeds 50,000 character limit" });
    }

    const id = generateId();
    textStorage[id] = text;

    setTimeout(() => {
        delete textStorage[id];
    }, 48 * 60 * 60 * 1000);
    res.json({ url: `https://devapi.heckstack.tech/get-text/${id}` });
});

// GET endpoint to retrieve text
app.get("/get-text/:id", (req, res) => {
    const { id } = req.params;
    const text = textStorage[id];

    if (!text) {
        return res.status(404).json({ error: "Text not found or expired" });
    }

    res.send( text );
});



app.post("/hash-password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ error: "Password is required" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    res.status(200).json({ hashedPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/generate-uuid", (req, res) => {
  res.json({ uuid: uuidv4() });
});

app.get("/convert-timestamp", (req, res) => {
  const { timestamp } = req.query;
  if (!timestamp)
    return res.status(400).json({ error: "Timestamp is required" });

  const date = new Date(parseInt(timestamp) * 1000);
  if (isNaN(date.getTime()))
    return res.status(400).json({ error: "Invalid timestamp" });

  res.json({ timestamp, datetime: date.toISOString() });
});
/* Self-Hosting only
app.get("/get-weather", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}); */

app.get("/get-currency-exchange", async (req, res) => {
  const { base, target } = req.query;
  if (!base || !target)
    return res.status(400).json({ error: "Base and target are required" });

  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${base}`
    );
    const rate = response.data.rates[target];
    if (!rate)
      return res.status(400).json({ error: "Invalid base or target currency" });

    res.json({ base, target, rate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
