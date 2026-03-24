import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { productName } = req.body;

  if (!productName || typeof productName !== "string") {
    return res.status(400).json({ error: "Product name is required." });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `Analyze "${productName}" and return JSON`,
        },
      ],
    });

    const text = completion.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();

    res.status(200).json(JSON.parse(clean));
  } catch (err) {
    res.status(500).json({ error: "Analysis failed" });
  }
}