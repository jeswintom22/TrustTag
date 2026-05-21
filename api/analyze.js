import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { productName } = req.body;
  if (!productName || !productName.trim()) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a product safety analyst. Return ONLY valid JSON, no markdown.
          Schema: { "product": string, "category": string, "overallSafetyScore": number(1-10),
          "pros": [{"point": string, "source": string}],
          "cons": [{"point": string, "source": string}],
          "regulatoryStatus": string, "keyIngredients": [{"name": string, "safetyNote": string}],
          "recommendation": string }`
        },
        { role: "user", content: `Analyze the safety of: ${productName}` }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const data = JSON.parse(raw);
    return res.status(200).json(data);
  } catch (err) {
    if (err.status === 429) return res.status(429).json({ error: "Rate limit reached. Please wait." });
    return res.status(500).json({ error: "Analysis failed. Try again." });
  }
}