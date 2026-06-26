# Security Audit

## Fixed Issues
- Removed hardcoded admin password from frontend JavaScript.
- Removed dangerous `innerHTML` usage and replaced with safe DOM APIs.
- Added strict Content Security Policy (CSP).
- Added input validation for `id` and `token`.
- Added safer DOM lifecycle handling.
- Added `Object.freeze` to reduce runtime tampering.
- Added secure browser meta headers.

## Important Architectural Risk
This project is deployed as a static GitHub Pages website.

Because all guest data and tokens are stored client-side in `guests.js`,
any visitor can still inspect all invitation tokens from browser DevTools.

This cannot be fully secured on GitHub Pages alone.

## Professional Recommendation
Move sensitive guest/token validation to a backend:
- Node.js + Express
- Cloudflare Workers
- Firebase Functions
- Vercel Serverless Functions

## Additional Recommendations
- Do not publish `generator.html` publicly.
- Add rate limiting on backend APIs.
- Use signed expiring tokens instead of static tokens.
- Store guest data in database instead of frontend JS.

