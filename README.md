# Freebies Directory — Free Legal Aid & Self-Help Resources

Free legal aid and self-help resources: court forms, lawyer referral, tenant and consumer help, plus family law, benefits, records/expungement, and immigration. Grouped by issue. Official links only. Education only.

Credit: **Asdale Dynamics, LLC**

## What's inside

- `resources.json` — single source of data (8 issue groups, 39 official resources)
- `resources.md` — mirror markdown directory
- `index.html` — static site with client-side search (vanilla JS, no build step needed to view)
- `assets/search.js` — client-side search, works opened straight from `file://`
- `assets/style.css` — clean, responsive styles
- `scripts/build.js` — regenerates `index.html` and `resources.md` from `resources.json`

## How to run

Open `index.html` directly in your browser — no server required. Client-side search works from `file://`.

Or serve it locally:

```bash
npm install   # none needed; scripts only
npm run start # python3 http.server on http://localhost:8080
```

To regenerate the site from the data file:

```bash
npm run build
```

## Verification

```bash
npm test      # validates resources.json and search matching logic
npm run build # regenerates index.html and resources.md
```

## Education only

This directory is for general educational information only. It is not legal advice and does not create an attorney-client relationship. For help with a specific legal problem, contact a qualified attorney or legal aid office in your area. All links point to official government and legal aid websites; Asdale Dynamics, LLC does not operate those sites and is not responsible for their content.

## About

Published by **Asdale Dynamics, LLC** (Indiana, formed Oct 2026) — beginner-friendly education, practical tools, and accessible life-admin helpers.

## License

[MIT](LICENSE)

Copyright (c) 2026 Asdale Dynamics, LLC
