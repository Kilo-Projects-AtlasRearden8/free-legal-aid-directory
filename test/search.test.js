"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "resources.json"), "utf8"));

// Official-link allowlist: .gov / .mil plus vetted legal-aid nonprofit domains.
const ALLOWED_SUFFIXES = [".gov", ".mil"];
const ALLOWED_DOMAINS = [
  "lawhelp.org",
  "probono.net",
  "thehotline.org",
  "americanbar.org",
  "ncsc.org",
  "inbar.org",
];

function hostOf(url) {
  try {
    let host = new URL(url).hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    return host;
  } catch (err) {
    return "";
  }
}

function isAllowed(url) {
  const host = hostOf(url);
  if (!host) return false;
  if (ALLOWED_SUFFIXES.some((suf) => host.endsWith(suf))) return true;
  return ALLOWED_DOMAINS.includes(host);
}

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed += 1;
}

// --- site metadata ---
ok(typeof data.site === "object", "site metadata present");
ok(data.site.credit === "Asdale Dynamics, LLC", "site credits Asdale Dynamics, LLC");
ok(
  typeof data.site.disclaimer === "string" && data.site.disclaimer.length > 0,
  "education-only disclaimer present"
);
ok(typeof data.site.title === "string" && data.site.title.length > 0, "site title present");
ok(
  typeof data.site.subtitle === "string" && data.site.subtitle.length > 0,
  "site subtitle present"
);
ok(typeof data.updated === "string", "updated date present");

// --- groups ---
ok(Array.isArray(data.groups) && data.groups.length > 0, "groups array present");
const groupIds = new Set();
for (const g of data.groups) {
  ok(typeof g.id === "string" && g.id.length > 0, `group has id: ${g.id || "(missing)"}`);
  ok(typeof g.name === "string" && g.name.length > 0, `group ${g.id} has name`);
  ok(typeof g.description === "string", `group ${g.id} has description`);
  ok(Array.isArray(g.resources) && g.resources.length > 0, `group ${g.id} has resources`);
  ok(!groupIds.has(g.id), `group id ${g.id} is unique`);
  groupIds.add(g.id);
}

// --- resources ---
const urls = new Set();
const ids = new Set();
let total = 0;
const httpsRe = /^https:\/\//;
const validCosts = ["Free", "Free (eligibility based)", "Free or low cost", "Free (filing fees may apply)", "Referral service (consultation fees may apply)", "Fee applies"];
for (const g of data.groups) {
  for (const r of g.resources) {
    total += 1;
    ok(typeof r.id === "string" && r.id.length > 0, `resource has id`);
    ok(!ids.has(r.id), `resource id ${r.id} is unique across all groups`);
    ids.add(r.id);
    ok(typeof r.name === "string" && r.name.length > 0, `resource ${r.id} has name`);
    ok(typeof r.url === "string" && httpsRe.test(r.url), `resource ${r.id} URL is HTTPS`);
    ok(isAllowed(r.url), `resource ${r.id} official-domain allowlist: ${r.url}`);
    ok(!urls.has(r.url), `resource ${r.id} URL is unique`);
    urls.add(r.url);
    ok(typeof r.description === "string" && r.description.length > 0, `resource ${r.id} has description`);
    ok(typeof r.jurisdiction === "string" && r.jurisdiction.length > 0, `resource ${r.id} jurisdiction`);
    ok(typeof r.cost === "string" && r.cost.length > 0, `resource ${r.id} cost`);
    ok(typeof r.type === "string" && r.type.length > 0, `resource ${r.id} type`);
    ok(validCosts.includes(r.cost), `resource ${r.id} cost uses allowed value: ${r.cost}`);
  }
}
ok(total >= 25, `directory has ${total} resources (expect >= 25)`);

// --- replicate the client-side match logic used by assets/search.js ---
function matches(cardText, query) {
  const t = cardText.toLowerCase();
  const q = query.toLowerCase();
  return q === "" || t.indexOf(q) !== -1;
}

let tenantHits = 0;
let expungementHits = 0;
let debtHits = 0;
let noMatch = 0;
for (const g of data.groups) {
  for (const r of g.resources) {
    const blob = `${g.name} ${g.description} ${r.name} ${r.description} ${r.jurisdiction} ${r.cost} ${r.type}`;
    if (matches(blob, "tenant")) tenantHits += 1;
    if (matches(blob, "expungement")) expungementHits += 1;
    if (matches(blob, "debt")) debtHits += 1;
    if (matches(blob, "nonexistenttermqzx")) noMatch += 1;
  }
}
ok(tenantHits > 0, "search match logic returns tenant hits");
ok(expungementHits > 0, "search match logic returns expungement hits");
ok(debtHits > 0, "search match logic returns debt hits");
ok(noMatch === 0, "search match logic returns zero hits for nonsense term");

// --- free-only logic replication ---
function isFree(cost) {
  const c = cost.toLowerCase();
  return /free/.test(c) && !/fee/.test(c);
}
let freeCount = 0;
let paidCount = 0;
for (const g of data.groups) {
  for (const r of g.resources) {
    if (isFree(r.cost)) freeCount += 1; else paidCount += 1;
  }
}
ok(freeCount > 0, `free-only logic: ${freeCount} free resources`);
ok(paidCount > 0, `free-only logic: ${paidCount} non-free resources`);

console.log(
  `search.test.js: ${passed} checks passed across ${total} resources in ${data.groups.length} groups (${freeCount} free, ${paidCount} non-free)`
);
console.log("OK");
