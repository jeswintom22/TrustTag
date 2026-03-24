require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyzeProduct } = require("./analyzeProduct");

const app = express();
const PORT = process.env.PORT || 3001;

console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);

app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  const { productName } = req.body;

  if (!productName || typeof productName !== "string" || productName.trim() === "") {
    return res.status(400).json({ error: "Product name is required and must be a non-empty string." });
  }

  try {
    const result = await analyzeProduct(productName.trim());
    res.json(result);
  } catch (err) {
    console.error("ERROR STATUS:", err.status);
    console.error("ERROR MESSAGE:", err.message);
    console.error("FULL ERROR:", JSON.stringify(err, null, 2));
    if (err.status === 429) {
      res.status(429).json({
        error: "Rate limit reached. Please wait a few seconds and try again.",
      });
    } else {
      res.status(500).json({ error: "Analysis failed. Please try again." });
    }
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
