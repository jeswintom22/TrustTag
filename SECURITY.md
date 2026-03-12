# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in TrustTag, please follow responsible disclosure:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email the maintainer directly or open a private GitHub security advisory.
3. Include a clear description of the vulnerability, steps to reproduce, and potential impact.
4. You will receive a response within 72 hours.

We will work to patch confirmed vulnerabilities promptly and credit you in the release notes if desired.

## Security Practices in This Project

### API Key Management
- API keys are stored in `.env` files which are excluded from version control via `.gitignore`.
- The `.env.example` file contains only placeholder values — never real keys.
- Never commit a real `GROQ_API_KEY` or any other secret to the repository.

### Input Validation
- The `/api/analyze` endpoint validates that `productName` is a non-empty string before forwarding to the AI model.
- Express `express.json()` middleware limits the request body to prevent oversized payloads.

### CORS
- CORS is enabled globally for development. For production deployment, restrict the `origin` option in `cors()` to your frontend domain only:
  ```js
  app.use(cors({ origin: "https://your-frontend-domain.com" }));
  ```

### AI Output
- This application parses AI-generated JSON. Malformed responses are caught and return a 500 error — they are never forwarded raw to the client.
- AI-generated safety reports are informational only and do not constitute medical or legal advice.

### Rate Limiting
- The server returns 429 errors when the upstream Groq API rate limit is reached. For production use, consider adding `express-rate-limit` to the Express server to prevent abuse.

### Dependency Security
- Run `npm audit` regularly to check for known vulnerabilities in dependencies.
- Keep `groq-sdk`, `express`, and other packages updated.

## Recommended Production Hardening

- Add `helmet` middleware: `npm install helmet` → `app.use(require('helmet')())`
- Add `express-rate-limit` for the `/api/analyze` route
- Restrict CORS to your production frontend domain
- Deploy behind HTTPS only
- Store secrets in a secrets manager (e.g. Railway variables, Vercel env, AWS Secrets Manager) rather than flat `.env` files
