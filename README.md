# Freebies Directory — Free Legal Aid & Self-Help Resources

A plain-English directory of free legal aid and self-help resources: court forms, lawyer referral, tenant and consumer help, plus debt/credit, veterans benefits, family law, expungement, and immigration. Grouped by issue. Official links only. Education only.

Published by **Asdale Dynamics, LLC**.

## Who this is for

Anyone looking for free, official help with a legal or life-admin problem without paying a lawyer up front. The directory keeps to resources you can use yourself — court forms, self-help centers, lawyer referral services, tenant and housing help, consumer protection, benefits, and record-clearing guides. Every link goes to an official government or legal aid website.

## What's inside

- `resources.json` — single source of data: **10 issue groups, 43 official resources**
- `resources.md` — mirror markdown directory (generated from `resources.json`)
- `index.html` — static site with client-side search (works opened straight from `file://`, no server needed)
- `assets/search.js` — vanilla-JS client-side search with "Free only" filtering and match highlighting
- `assets/style.css` — clean, responsive styles
- `scripts/build.js` — regenerates `index.html` and `resources.md` from `resources.json`
- `test/search.test.js` — validates the data and search matching logic

Issue groups:

1. Court Forms & Self-Help
2. Lawyer Referral & Free Legal Aid
3. Tenant & Housing Help
4. Consumer Help
5. Debt & Credit Help
6. Family Law
7. Benefits & Public Assistance
8. Criminal Records & Expungement
9. Veterans & Military
10. Immigration

## How to run

Open `index.html` directly in your browser — no server, no install, no API keys required. Client-side search works from `file://`.

Or serve it locally:

```bash
npm start   # python3 http.server at http://localhost:8080
```

To regenerate the site from the data file:

```bash
npm run build   # regenerates index.html and resources.md
npm test        # runs the validation suite
```

## How to maintain the data

1. Edit `resources.json` — add or update resources under the appropriate issue group.
2. Every URL must be HTTPS and point to an official government or legal aid site.
3. Run `npm run build` to regenerate `index.html` and `resources.md`.
4. Run `npm test` to validate structure, unique IDs/URLs, official-domain allowlist, and search logic.

## Education only — not legal advice

This directory is for general educational information only. It is not legal advice, and it does not create an attorney-client relationship. For help with a specific legal problem, contact a qualified attorney or a legal aid office in your area.

All links point to official government and legal aid websites. Asdale Dynamics, LLC does not operate those sites and is not responsible for their content.

## About

Published by **Asdale Dynamics, LLC** (Indiana, formed Oct 2026) — beginner-friendly education, practical tools, and accessible life-admin helpers. Built in the same plain-English, step-by-step, never-condescending style as The Massive AI Manual and dylanasdale.github.io.

## License

[MIT](LICENSE)

Copyright (c) 2026 Asdale Dynamics, LLC
