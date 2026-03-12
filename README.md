# Real-Time Label Compliance Checker — TrustTag

A full-stack web application that instantly generates AI-powered safety and compliance reports for any consumer product — food, pharmaceutical, or cosmetic — using the Groq API (LLaMA 3.3 70B).

## Features

- **AI Safety Reports** — Powered by `llama-3.3-70b-versatile` via Groq's free-tier API
- **Structured JSON Reports** — Overall safety score, pros/cons with sources, regulatory status, key ingredients
- **Color-Coded Safety Badge** — Green (7-10), Yellow (4-6), Red (1-3)
- **Mobile-Responsive UI** — Built with React + Tailwind CSS
- **Rate Limit Handling** — Clean user-facing error messages for API quota errors

## Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS        |
| Backend   | Node.js + Express                     |
| AI Engine | Groq API (`llama-3.3-70b-versatile`)  |
| HTTP      | Axios                                 |
| Config    | dotenv                                |

## Project Structure

```
/
├── server/
│   ├── index.js            # Express server — CORS, /api/analyze route, error handling
│   └── analyzeProduct.js   # Groq API call — LLaMA 3.3 70B, JSON parsing
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx        # Input + submit button with validation
│   │   │   ├── ReportCard.jsx       # Full report layout
│   │   │   ├── SafetyBadge.jsx      # Score badge + progress bar
│   │   │   ├── ProsConsPanel.jsx    # Two-column pros/cons cards
│   │   │   └── IngredientsTable.jsx # Ingredient safety table
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .env.example
├── .gitignore
├── requirements.txt
├── SECURITY.md
└── package.json
```

## Setup & Usage

### 1. Clone the repository

```bash
git clone <repo-url>
cd TrustTag
```

### 2. Get a free Groq API key

Sign up at **https://console.groq.com** → API Keys. No billing required.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and add your key:

```
GROQ_API_KEY=gsk_...
PORT=3001
```

### 4. Install dependencies

```bash
# Server dependencies
npm install

# Client dependencies
npm install --prefix client
```

Or both at once:

```bash
npm run install:all
```

### 5. Run the application

```bash
npm run dev
```

This starts:
- Backend → `http://localhost:3001`
- Frontend → `http://localhost:5173`

Run separately if needed:

```bash
# Terminal 1
npm run server

# Terminal 2
npm run client
```

### 6. Open in browser

Navigate to `http://localhost:5173` and search for any product.

**Example searches:**
- `Children's Mineral Sunscreen SPF 50`
- `Ibuprofen 200mg tablets`
- `Red Bull Energy Drink`
- `Neutrogena Hydro Boost Water Gel`

## API Endpoint

### `POST /api/analyze`

**Request:**
```json
{ "productName": "Tylenol Extra Strength" }
```

**Response:**
```json
{
  "product": "Tylenol Extra Strength",
  "category": "pharmaceutical",
  "overallSafetyScore": 7,
  "pros": [
    { "point": "Effective OTC pain and fever relief", "source": "General Knowledge" }
  ],
  "cons": [
    { "point": "Risk of liver damage with overdose or alcohol use", "source": "General Knowledge" }
  ],
  "regulatoryStatus": "FDA-approved OTC analgesic/antipyretic",
  "keyIngredients": [
    { "name": "Acetaminophen 500mg", "safetyNote": "Safe at recommended doses; hepatotoxic in overdose" }
  ],
  "recommendation": "Safe for adults at recommended doses. Do not exceed 4g/day. Avoid alcohol."
}
```

**Error responses:**

| Status | Meaning |
|--------|---------|
| 400 | Product name missing or empty |
| 429 | Groq rate limit reached — wait and retry |
| 500 | Unexpected server error |

## Notes

- Reports are AI-generated from training knowledge. Always consult a healthcare professional before making medical decisions.
- The Groq free tier supports `llama-3.3-70b-versatile` with generous rate limits (no billing required).
