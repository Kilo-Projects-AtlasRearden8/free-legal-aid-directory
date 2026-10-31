// Build script for the Freebies Directory static site.
// Reads resources.json and generates index.html (with embedded data for
// client-side search) and resources.md (mirror markdown directory).
// No external dependencies: runs with plain Node.js.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "resources.json");
const HTML_OUT = path.join(ROOT, "index.html");
const MD_OUT = path.join(ROOT, "resources.md");

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const { site, groups } = data;

function escHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function mdLink(text, url) {
  return `[${text}](${url})`;
}

// ---------- index.html ----------

function buildHtml() {
  const embedded = JSON.stringify(data, null, 2);

  const groupNav = groups
    .map(
      (g) =>
        `<button type="button" class="filter" data-group="${escHtml(g.id)}">${escHtml(
          g.name
        )}</button>`
    )
    .join("\n");

  const groupSections = groups
    .map(
      (g) => `
    <section id="group-${escHtml(g.id)}" class="group-section" aria-labelledby="heading-${escHtml(g.id)}">
      <h2 id="heading-${escHtml(g.id)}">${escHtml(g.name)}</h2>
      <p class="group-desc">${escHtml(g.description)}</p>
      <div class="resource-list" id="list-${escHtml(g.id)}">
        ${g.resources
          .map(
            (r) => `
            <article class="resource-card" data-group="${escHtml(g.id)}" data-id="${escHtml(r.id)}" data-cost="${escHtml(r.cost)}">
            <header class="card-header">
              <h3 class="card-title"><a href="${escHtml(r.url)}" target="_blank" rel="noopener">${escHtml(r.name)}</a></h3>
              <span class="badge official">Official link</span>
            </header>
            <p class="card-desc">${escHtml(r.description)}</p>
            <div class="card-meta">
              <span><strong>Jurisdiction:</strong> ${escHtml(r.jurisdiction)}</span>
              <span><strong>Cost:</strong> ${escHtml(r.cost)}</span>
              <span><strong>Type:</strong> ${escHtml(r.type)}</span>
            </div>
            <a href="${escHtml(r.url)}" class="card-link" target="_blank" rel="noopener">Visit site <span aria-hidden="true">→</span></a>
          </article>
        `
          )
          .join("\n")}
      </div>
    </section>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escHtml(site.title)}</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="site-header">
  <div class="wrapper">
    <h1>${escHtml(site.title)}</h1>
    <p class="subtitle">${escHtml(site.subtitle)}</p>
    <p class="credit">Credit: ${escHtml(site.credit)}</p>
  </div>
</header>

<main class="wrapper">
  <aside class="sidebar">
    <h3>Browse by issue</h3>
    <div class="filters" role="group" aria-label="Issue groups">
      <button type="button" class="filter active" data-group="all">All resources</button>
      ${groupNav}
    </div>
    <div class="sidebar-note">
      <p><strong>Education only.</strong> This directory is general information, not legal advice.</p>
      <p>All links point to official government and legal aid websites.</p>
    </div>
  </aside>

  <section class="results">
    <div class="toolbar">
      <label for="search">Search resources</label>
      <input type="search" id="search" placeholder="Search names, topics, jurisdiction&#8230;" autocomplete="off">
      <label class="toggle" for="free-only"><input type="checkbox" id="free-only"> Free only</label>
      <span class="count" id="count">0 results</span>
      <div id="no-results" class="no-results-msg">No resources match your filters. Try clearing the search or turning off “Free only”.</div>
    </div>

    <p class="disclaimer">${escHtml(site.disclaimer)}</p>

    ${groupSections}
  </section>
</main>

<footer class="site-footer">
  <div class="wrapper">
    <p>Built and published by <strong>${escHtml(site.credit)}</strong> — educational resource directory.</p>
    <p>Source data: <code>resources.json</code> | Markdown: <code>resources.md</code></p>
  </div>
</footer>

<script id="resources-data" type="application/json">${embedded}</script>
<script src="assets/search.js"></script>
</body>
</html>`;
}

// ---------- resources.md ----------

function buildMd() {
  const lines = [];
  lines.push(`# ${site.title}`);
  lines.push("");
  lines.push(`> ${site.subtitle}`);
  lines.push("");
  lines.push(`**Credit:** ${site.credit}`);
  lines.push("");
  lines.push(`> **Education only.** ${site.disclaimer}`);
  lines.push("");
  lines.push(`All links point to official government or legal aid websites. ${site.credit} does not operate the linked sites and is not responsible for their content.`);
  lines.push("");
  lines.push("Last updated: " + data.updated);
  lines.push("");
  lines.push("## Browse by issue");
  lines.push("");
  for (const g of groups) {
    lines.push(`### ${g.name}`);
    lines.push("");
    lines.push(g.description);
    lines.push("");
    for (const r of g.resources) {
      lines.push(`- [${r.name}](${r.url}) — ${r.jurisdiction} · ${r.cost} · ${r.type}`);
    }
    lines.push("");
  }
  lines.push(`---`);
  lines.push("");
  lines.push(`Published by ${site.credit}. For general educational information only; not legal advice.`);
  lines.push("");

  return lines.join("\n");
}

fs.writeFileSync(HTML_OUT, buildHtml(), "utf8");
fs.writeFileSync(MD_OUT, buildMd(), "utf8");

console.log("Wrote " + HTML_OUT);
console.log("Wrote " + MD_OUT);
