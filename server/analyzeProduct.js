const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function analyzeProduct(productName) {
  console.log("Calling Groq with product:", productName);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a product safety analyst. Return ONLY valid JSON, no markdown, no backticks.`,
      },
      {
        role: "user",
        content: `Analyze "${productName}" for safety and compliance. Return this exact JSON structure:
{
  "product": "product name",
  "category": "food/pharmaceutical/cosmetic",
  "overallSafetyScore": 7,
  "pros": [{"point": "...", "source": "General Knowledge"}],
  "cons": [{"point": "...", "source": "General Knowledge"}],
  "regulatoryStatus": "...",
  "keyIngredients": [{"name": "...", "safetyNote": "..."}],
  "recommendation": "..."
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  });

  const text = completion.choices[0].message.content;
  console.log("Raw Groq response:", text);
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

module.exports = { analyzeProduct };
