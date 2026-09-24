// Render everything under templates/ into the repo, filling tokens from this book's
// entry in the platform registry (textbookproject2026-alt/textbook-registry) and from
// textbook.config.json, which holds the slug and nothing else.
//
//   node configure.mjs [--candidate <entry.json>] [--check]
//
// Re-runnable: change the registry (or a template), run again, the managed files
// regenerate. Nothing else in the repo is touched.
//
// Where the registry comes from, in order:
//   1. TEXTBOOK_REGISTRY, a path or an https URL
//   2. ../textbook-registry/registry.json, a sibling checkout
//   3. raw.githubusercontent.com, main
//
// --candidate is for the window before the book's registry entry has been merged:
// it renders from a proposed entry (the file scripts/new-book.mjs writes) instead of
// from the registry. It is deliberately not automatic. An unreviewed entry is not a
// registry entry, and a repo whose generated files quietly came from one would be
// telling contributors things no platform owner has agreed to. Re-run without the
// flag once the entry is merged.
//
// --check writes nothing and exits 1 if any managed file is out of date, which is
// what CI uses to catch a template edited without a re-render.
//
// Node 22, no dependencies.

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, dirname, relative, resolve } from "node:path";

const ROOT = process.cwd();
const TEMPLATES = join(ROOT, "templates");
const DEFAULT_REGISTRY = "https://raw.githubusercontent.com/textbookproject2026-alt/textbook-registry/main/registry.json";
const SIBLING = resolve(ROOT, "..", "textbook-registry", "registry.json");

const argv = process.argv.slice(2);
const CHECK = argv.includes("--check");
const candidateAt = argv.indexOf("--candidate");
const CANDIDATE = candidateAt >= 0 ? argv[candidateAt + 1] : null;
if (candidateAt >= 0 && !CANDIDATE) fail("--candidate needs the path of a proposed registry entry.");

function fail(message) {
  console.error(`configure: ${message}\nNothing was written.`);
  process.exit(1);
}

async function readJson(where) {
  if (/^https:\/\//.test(where)) {
    const res = await fetch(where, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { code: `HTTP ${res.status}` });
    return JSON.parse(await res.text());
  }
  return JSON.parse(await readFile(where, "utf8"));
}

// --- the slug ---------------------------------------------------------------

const config = JSON.parse(await readFile(join(ROOT, "textbook.config.json"), "utf8"));
if (!config.slug) fail('textbook.config.json has no "slug", so this book cannot be found in the registry. Run scripts/new-book.mjs.');
if (Object.keys(config).length > 1) {
  console.warn(
    `configure: textbook.config.json carries ${Object.keys(config).join(", ")}. Only "slug" is read here;\n` +
      "  every other fact about the book belongs in the registry, where the services read it.",
  );
}

// --- the registry -----------------------------------------------------------

let registrySource = process.env.TEXTBOOK_REGISTRY ?? null;
if (!registrySource) {
  try {
    await readFile(SIBLING, "utf8");
    registrySource = SIBLING;
  } catch {
    registrySource = DEFAULT_REGISTRY;
  }
}

let registry;
try {
  registry = await readJson(registrySource);
} catch (err) {
  fail(
    `cannot read the registry at ${registrySource} (${err.code ?? err.message}).\n` +
      "Clone textbookproject2026-alt/textbook-registry next to this repo, or set TEXTBOOK_REGISTRY to a registry.json or an https URL.",
  );
}
if (registry.schema_version !== 1) fail(`the registry at ${registrySource} has schema_version ${registry.schema_version}; this renderer understands 1.`);

// --- this book's entry ------------------------------------------------------

let book = registry.books?.find((b) => b.slug === config.slug);
let provisional = false;

if (!book && CANDIDATE) {
  let candidate;
  try {
    candidate = await readJson(resolve(ROOT, CANDIDATE));
  } catch (err) {
    fail(`cannot read the proposed entry at ${CANDIDATE} (${err.code ?? err.message}).`);
  }
  if (candidate.slug !== config.slug) fail(`${CANDIDATE} is for slug "${candidate.slug}", but this book is "${config.slug}".`);
  book = candidate;
  provisional = true;
} else if (!book) {
  fail(
    `no book with slug "${config.slug}" in ${registrySource}.\n` +
      "  If its registry entry has not been merged yet, render from the proposed entry with\n" +
      "    node configure.mjs --candidate registry-entry.json\n" +
      "  and run this again, without the flag, once the entry is on main.",
  );
} else if (CANDIDATE) {
  console.warn(`configure: "${config.slug}" is in the registry, so ${CANDIDATE} was ignored. Delete it; it has served its purpose.`);
}

if (book.status === "retired") fail(`book "${config.slug}" is retired. A retired book's files are not regenerated.`);
if (book.status === "live" && !book.site?.domain) fail(`book "${config.slug}" is live but has no site domain.`);
// admin/config.yml's `branch:` is the line that keeps the browser editor off the live
// book. The registry's CI enforces this too; checked again here because this is where
// it is written.
if (!book.content?.drafts_branch) fail(`book "${config.slug}" has no content.drafts_branch.`);
if (book.content.drafts_branch === book.content.live_branch)
  fail(`book "${config.slug}" has drafts_branch equal to live_branch ("${book.content.live_branch}").`);

// --- tokens -----------------------------------------------------------------
//
// Unset values (missing, null or "") are left out, so their placeholder stays in the
// output untouched and is reported at the end, rather than silently blanked.

const isSet = (v) => v !== undefined && v !== null && v !== "";

const tokens = {
  __SLUG__: book.slug,
  __TITLE__: book.title,
  __SUMMARY__: book.summary,
  __LICENCE__: book.licence,
  __MAINTAINER__: book.maintainer?.name,
  __MAINTAINER_GITHUB__: book.maintainer?.github,
  __CONTENT_REPO__: book.content?.repo,
  __LIVE_BRANCH__: book.content?.live_branch,
  __DRAFTS_BRANCH__: book.content?.drafts_branch,
  __SITE_DOMAIN__: book.site?.domain,
  // Derived, never stored (DESIGN §0b: store facts, not URLs built from them).
  __SITE_URL__: book.site?.domain ? `https://${book.site.domain}` : null,
  __CMS_AUTH_RELAY__: registry.platform?.cms_auth_relay,
};

const filled = Object.fromEntries(Object.entries(tokens).filter(([, v]) => isSet(v)).map(([k, v]) => [k, String(v)]));

// --- render -----------------------------------------------------------------

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

// A file that must render completely. A placeholder left in it ships something
// broken rather than something incomplete: a CMS pointed at a repo called
// __CONTENT_REPO__.
const STRICT = new Set(["admin/config.yml"]);

let sources;
try {
  sources = await walk(TEMPLATES);
} catch (err) {
  fail(`cannot read templates/ (${err.code ?? err.message}).`);
}

// Render everything first, then write, so a bad registry leaves the repo untouched.
const rendered = [];
const leftovers = new Set();

for (const src of sources) {
  let text = await readFile(src, "utf8");
  for (const [token, value] of Object.entries(filled)) text = text.split(token).join(value);
  const unfilled = text.match(/__[A-Z0-9_]+__/g) ?? [];
  const rel = relative(TEMPLATES, src);
  if (STRICT.has(rel) && unfilled.length) fail(`${rel} has unfilled placeholders: ${[...new Set(unfilled)].join(", ")}.`);
  for (const m of unfilled) leftovers.add(m);
  rendered.push([join(ROOT, rel), text, rel]);
}

if (CHECK) {
  const stale = [];
  for (const [dest, text, rel] of rendered) {
    let current = null;
    try {
      current = await readFile(dest, "utf8");
    } catch {
      /* missing counts as stale */
    }
    if (current !== text) stale.push(rel);
  }
  if (stale.length) {
    console.error(`configure --check: out of date: ${stale.join(", ")}.\nRun: node configure.mjs`);
    process.exit(1);
  }
  console.log(`configure --check: ${rendered.length} managed file(s) are up to date with ${registrySource}.`);
  process.exit(0);
}

for (const [dest, text] of rendered) {
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, text);
  console.log("wrote", relative(ROOT, dest));
}

if (provisional) {
  console.warn(
    `\nRendered from the PROPOSED entry ${CANDIDATE}, not from the registry.\n` +
      "  Nothing here is live until a platform owner has merged that entry. The endpoints,\n" +
      "  branches and domain in the files just written are what you asked for, not what the\n" +
      "  platform serves. Re-run without --candidate after the merge.",
  );
}

if (leftovers.size)
  console.warn(
    `\nUnfilled placeholders, left in place: ${[...leftovers].join(", ")}.\n` +
      "  They are empty in the registry entry. Fill them there (a registry pull request), not here.",
  );
