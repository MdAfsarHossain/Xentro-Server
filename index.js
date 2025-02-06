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

// Get all users from API
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

// Get a single user from API
app.get("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
});

// Get all products from API
app.get("/products", async (req, res) => {
  const search = req?.query?.search;
  const sort = req?.query?.sort;
  // console.log(sort);

  try {
    const response = await fetch("https://api.restful-api.dev/objects");
    const data = await response.json();
    let result = data;

    if (search) {
      result = data?.filter((product) =>
        product?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "ASC" || sort === "DESC") {
      result.sort((a, b) => {
        const priceA = a?.data?.price || 0;
        const priceB = b?.data?.price || 0;
        return sort === "ASC" ? priceA - priceB : priceB - priceA;
      });
    }

    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single product from API
app.get("/product/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const response = await fetch(
      `https://api.restful-api.dev/objects/${productId}`
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    res.status(404).json({ error: "Product not found" });
  }
});

// ALL POST requests
// Add New Product
app.post("/product", async (req, res) => {
  const newProduct = req.body;
  // console.log(newProduct);
  const response = await axios.post(
    "https://api.restful-api.dev/objects",
    newProduct,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  res.status(201).json(response.data);
});

// ALl DELETE Request
// Delete a single product from the database
app.delete("/product/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  // console.log(productId);
  // const response = await axios.delete(
  //   `https://api.restful-api.dev/objects/${productId}`
  // );

  res.status(200).json({ message: "Product deleted successfully" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Xentro Tech Info Server!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
