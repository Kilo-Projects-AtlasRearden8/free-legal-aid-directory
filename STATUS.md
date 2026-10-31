# STATUS — Freebies Directory

## What was built

A free legal aid and self-help resources directory (Markdown + static HTML site with client-side search). Grouped by issue, official links only, education only. Credit: **Asdale Dynamics, LLC**.

```
free-legal-aid-directory/
├── README.md            # how to run, credit, education-only disclaimer
├── LICENSE              # MIT, "Copyright (c) 2026 Asdale Dynamics, LLC"
├── STATUS.md            # this file
├── resources.json       # single source of truth: 8 groups, 38 resources
├── resources.md         # mirror markdown directory (generated)
├── index.html           # static site with client-side search (generated)
├── package.json         # scripts: build / test / start / verify
├── scripts/build.js     # generates index.html and resources.md from resources.json
├── assets/style.css     # clean, responsive styles
├── assets/search.js     # client-side search (vanilla JS, works from file://)
└── test/search.test.js  # data validation + search matching logic tests
```

Issue groups: Court Forms & Self-Help, Lawyer Referral & Free Legal Aid, Tenant & Housing Help, Consumer Help, Family Law, Benefits & Public Assistance, Criminal Records & Expungement, Immigration. All links are HTTPS and point to official government or legal aid sites (courts, LSC, ABA, HUD, FTC, CFPB, USA.gov, USCIS, EOIR, etc.).

## How to run

Open `index.html` directly in a browser — no server required; client-side search works from `file://`.

```bash
npm run build   # regenerate index.html and resources.md from resources.json
npm test        # run the test suite
npm start       # serve at http://localhost:8080 (python http.server)
```

## Verification results

- `npm test`: **351 checks passed** across 38 resources in 8 groups. Validates site metadata, group/resource structure, HTTPS-only URLs, unique URLs, non-empty fields, and search matching logic.
- `npm run build`: generates `index.html` (38 resource cards) and `resources.md` (38 markdown links) from `resources.json`.
- Live server check (HTTP 200): `index.html`, `assets/search.js`, `assets/style.css`, `resources.md` all served. Embedded JSON parses to 8 groups / 38 resources; search input, search.js and style.css references present; credit line correct; education-only disclaimer present.
- `node --check` on `assets/search.js` and `scripts/build.js`: syntax valid.

## Known gaps

- **No attorney-client relationship / not legal advice**: all content is educational only; this is stated in the disclaimer and README.
- **URLs are hand-maintained**: a few entries are US-state-specific; users outside those states should use the USA.gov / LawHelp locators.
- **Link freshness not automated**: no link-availability checker runs at build time; official sites may move pages.
- **No backend / no API keys**: fully static, local-first, no secrets anywhere in files.
- **No .github/workflows** included by design (per project rules).