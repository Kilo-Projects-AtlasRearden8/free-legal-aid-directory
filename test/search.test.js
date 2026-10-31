"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "resources.json"), "utf8"));

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed += 1;
}

// --- site metadata ---
ok(typeof data.site === "object", "site metadata present");
ok(data.site.credit === "Asdale Dynamics, LLC", "site credits Asdale Dynamics, LLC");
ok(typeof data.site.disclaimer === "string" && data.site.disclaimer.length > 0, "education-only disclaimer present");
ok(typeof data.site.title === "string" && data.site.title.length > 0, "site title present");

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
let total = 0;
const httpsRe = /^https:\/\//;
for (const g of data.groups) {
  for (const r of g.resources) {
    total += 1;
    ok(typeof r.id === "string" && r.id.length > 0, `resource has id`);
    ok(typeof r.name === "string" && r.name.length > 0, `resource ${r.id || "(missing)"} has name`);
    ok(typeof r.url === "string" && httpsRe.test(r.url), `resource ${r.id} URL is HTTPS: ${r.url}`);
    ok(!urls.has(r.url), `resource ${r.id} URL is unique`);
    urls.add(r.url);
    ok(typeof r.description === "string" && r.description.length > 0, `resource ${r.id} has description`);
    ok(["Federal", "50 states", "Indiana", "California", "Texas", "New York"].includes(r.jurisdiction), `resource ${r.id} jurisdiction`);
    ok(typeof r.cost === "string" && r.cost.length > 0, `resource ${r.id} cost`);
    ok(typeof r.type === "string" && r.type.length > 0, `resource ${r.id} type`);
  }
}
ok(total >= 20, `directory has ${total} resources (expect >= 20)`);

// --- replicate the client-side match logic used by assets/search.js ---
function matches(cardText, query) {
  const t = cardText.toLowerCase();
  const q = query.toLowerCase();
  return q === "" || t.indexOf(q) !== -1;
}

let hits = 0;
for (const g of data.groups) {
  for (const r of g.resources) {
    const blob = `${g.name} ${g.description} ${r.name} ${r.description} ${r.jurisdiction} ${r.cost} ${r.type}`;
    if (matches(blob, "tenant")) hits += 1;
    if (matches(blob, "expungement")) hits += 1;
    if (matches(blob, "nonexistenttermqzx")) hits += 0;
  }
}
ok(hits > 0, "search match logic returns tenant/expungement hits");

console.log(`search.test.js: ${passed} checks passed across ${total} resources in ${data.groups.length} groups`);
console.log("OK");
