import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MAX_PRODUCT_NAME_LENGTH = 200;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 10;
const RATE_LIMIT_WINDOW_SECONDS = Number(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60;

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const memoryBuckets = new Map();

function getAllowedOrigins(req) {
  const origins = new Set(
    (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  );
  if (req.headers.host) origins.add(`https://${req.headers.host}`);
  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  return origins;
}

function getClientIp(req) {
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp) return realIp.trim();
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

async function hitRedis(key) {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["SET", key, "0", "EX", String(RATE_LIMIT_WINDOW_SECONDS), "NX"],
      ["INCR", key],
    ]),
  });
  if (!res.ok) throw new Error(`Rate limit store error: ${res.status}`);
  const results = await res.json();
  const count = Number(results?.[1]?.result);
  if (!Number.isFinite(count)) throw new Error("Rate limit store returned an invalid count");
  return count;
}

function hitMemory(key) {
  const now = Date.now();
  let bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000 };
    memoryBuckets.set(key, bucket);
  }
  bucket.count += 1;
  if (memoryBuckets.size > 10000) {
    for (const [k, b] of memoryBuckets) if (b.resetAt <= now) memoryBuckets.delete(k);
  }
  return bucket.count;
}

async function isRateLimited(ip) {
  const key = `trusttag:analyze:${ip}`;
  let count;
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      count = await hitRedis(key);
    } catch {
      count = hitMemory(key);
    }
  } else {
    count = hitMemory(key);
  }
  return count > RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const originAllowed = !origin || getAllowedOrigins(req).has(origin);

  if (origin && originAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (!originAllowed) return res.status(403).json({ error: "Origin not allowed" });
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const productName = req.body?.productName;
  if (typeof productName !== "string" || !productName.trim()) {
    return res.status(400).json({ error: "Product name is required" });
  }
  const trimmedName = productName.trim();
  if (trimmedName.length > MAX_PRODUCT_NAME_LENGTH) {
    return res
      .status(400)
      .json({ error: `Product name must be at most ${MAX_PRODUCT_NAME_LENGTH} characters` });
  }

  if (await isRateLimited(getClientIp(req))) {
    res.setHeader("Retry-After", String(RATE_LIMIT_WINDOW_SECONDS));
    return res.status(429).json({ error: "Too many requests. Please wait a minute and try again." });
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
        { role: "user", content: `Analyze the safety of: ${trimmedName}` }
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
