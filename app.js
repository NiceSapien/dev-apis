const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

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
    });

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
        }});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
