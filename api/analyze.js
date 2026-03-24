const { analyzeProduct } = require("../server/analyzeProduct");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { productName } = req.body;

  if (!productName || typeof productName !== "string" || productName.trim() === "") {
    return res.status(400).json({ error: "Product name is required." });
  }

  try {
    const result = await analyzeProduct(productName.trim());
    res.json(result);
  } catch (err) {
    if (err.status === 429) {
      res.status(429).json({ error: "Rate limit reached. Please wait and try again." });
    } else {
      res.status(500).json({ error: "Analysis failed. Please try again." });
    }
  }
};