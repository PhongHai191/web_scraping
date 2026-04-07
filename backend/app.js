require("dotenv").config();

const express = require("express");
const pool = require("./db/db");

const app = express();
app.use(express.json());

// serve frontend
app.use(express.static("public"));

// API: GET products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC LIMIT 50"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});