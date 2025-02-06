const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://xentro-task.web.app",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.get("/users", async (req, res) => {
  const search = req?.query?.search;
  const city = req?.query?.city;
  // console.log(search);

  // let query = {};

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();

    let result = data;

    if (search) {
      result = data?.filter((user) =>
        user?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (city && city !== "All City") {
      result = result?.filter((user) =>
        user?.address?.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
