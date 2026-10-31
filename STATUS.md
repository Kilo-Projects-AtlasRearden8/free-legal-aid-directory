# STATUS — Freebies Directory

## What was built

A free legal aid and self-help resources directory (Markdown + static HTML site with client-side search). Grouped by issue, official links only, education only. Credit: **Asdale Dynamics, LLC**.

```
free-legal-aid-directory/
├── README.md            # how to run, credit, education-only disclaimer, maintain guide
├── LICENSE              # MIT, "Copyright (c) 2026 Asdale Dynamics, LLC"
├── STATUS.md            # this file
├── resources.json       # single source of truth: 10 groups, 43 resources
├── resources.md         # mirror markdown directory (generated)
├── index.html           # static site with client-side search (generated)
├── package.json         # scripts: build / test / start / verify
├── scripts/build.js     # generates index.html and resources.md from resources.json
├── assets/style.css     # clean, responsive styles
├── assets/search.js     # client-side search: free-only filter + match highlighting (file:// safe)
└── test/search.test.js  # data validation + search matching logic tests
```

Issue groups (43 resources total, 39 free / 4 non-free): Court Forms & Self-Help, Lawyer Referral & Free Legal Aid, Tenant & Housing Help, Consumer Help, Debt & Credit Help, Family Law, Benefits & Public Assistance, Criminal Records & Expungement, Veterans & Military, Immigration. All links are HTTPS and point to official government or vetted legal-aid nonprofit sites.

## How to run

Open `index.html` directly in a browser — no server required; client-side search works from `file://`.

```bash
npm run build   # regenerate index.html and resources.md from resources.json
npm test        # run the test suite
npm start       # serve at http://localhost:8080 (python http.server)
npm run verify  # build + test
```

## Verification results

- `npm test`: **537 checks passed** across 43 resources in 10 groups. Validates site metadata, group/resource structure, HTTPS-only URLs, official-domain allowlist (.gov/.mil plus vetted legal-aid nonprofits), unique resource IDs and URLs across all groups, allowed cost values, education-only disclaimer, search matching logic (tenant/expungement/debt hits, zero nonsense hits), and free-only filter logic (39 free, 4 non-free).
- `npm run build`: regenerates `index.html` (43 resource cards) and `resources.md` (43 markdown links) from `resources.json`.
- Live server check (HTTP 200): `index.html`, `assets/search.js`, `assets/style.css`, `resources.md` all served. Embedded JSON parses to 10 groups / 43 resources; free-only toggle and no-results message present; credit line correct.
- `node --check` on `assets/search.js` and `scripts/build.js`: syntax valid.
- `git status`: clean working tree; single commit `7ae820b` as `Dylan Asdale`.

## Known gaps

- **Education only / not legal advice**: stated prominently in the disclaimer, README, and site; not a substitute for an attorney.
- **URLs are hand-maintained**: no automated link-availability checker runs at build time; official sites may move pages. Periodically re-verify links by hand.
- **US-focused**: most resources are federal or US-state-specific; users outside the US will need local equivalents.
- **No attorney referral vetting**: lawyer referral services are official (bar associations, LSC) but inclusion is not an endorsement.
- **No .github/workflows** included by design (per project rules).
- **No remote repo**: committed locally only, never pushed or published.
- **No secrets or personal data**: none present in any file.
