#!/usr/bin/env node
// Start a new book from this template.
//
//   node scripts/new-book.mjs [--dry-run] [--registry <path|url>]
//
// Asks for the few things only a person knows, writes what it can, and stops at
// the line it is not allowed to cross: it never edits the registry.
//
// WHAT IT WRITES
//   textbook.config.json      the slug, and nothing else
//   registry-entry.json       the PROPOSED registry entry, for a platform owner
//   REGISTRY-REQUEST.md       the covering note: what is checked, what is a guess
//   the managed files         by running configure.mjs --candidate (optional)
//   and it deletes the files the chosen host does not use
//
// WHAT IT WILL NOT DO
//   Touch registry.json, open a pull request, create a repository, create DNS,
//   install the GitHub App, or create a Pages or Publish site. Every one of those
//   is somebody's decision, and three of them are the platform owner's.
//
// Registry changes are governed: a book is real when a platform owner has reviewed
// the entry and merged it (textbook-registry/.github/CODEOWNERS), and the services
// pick it up on the deploy that follows. A script that wrote the entry itself would
// be pre-empting the one review the design relies on.
//
// Node 22, no dependencies.

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile, writeFile, rm, access } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");
const regAt = argv.indexOf("--registry");
const REGISTRY_ARG = regAt >= 0 ? argv[regAt + 1] : null;

const DEFAULT_REGISTRY = "https://raw.githubusercontent.com/textbookproject2026-alt/textbook-registry/main/registry.json";
const SIBLING = resolve(ROOT, "..", "textbook-registry", "registry.json");

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REPO_RE = /^[A-Za-z0-9](-?[A-Za-z0-9]){0,38}\/[A-Za-z0-9._-]{1,100}$/;
const LOGIN_RE = /^[A-Za-z0-9](-?[A-Za-z0-9]){0,38}$/;
const HOST_RE = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+([a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;
const SHARED_SUFFIXES = ["pages.dev", "workers.dev", "vercel.app", "netlify.app", "github.io", "publish.obsidian.md", "obsidian.md"];
const sharedSuffixOf = (h) => SHARED_SUFFIXES.find((s) => h === s || h.endsWith(`.${s}`));

// Answers are pulled from a line iterator rather than rl.question, so a run can be
// driven from a pipe (a scripted rehearsal, a test) as well as by a person typing.
const rl = createInterface({ input: stdin, output: stdout, terminal: Boolean(stdin.isTTY) });
const lines = rl[Symbol.asyncIterator]();
const say = (s = "") => stdout.write(`${s}\n`);

async function readLine(prompt) {
  stdout.write(prompt);
  const { value, done } = await lines.next();
  if (done) {
    say("\nInput ended before the questions did. Nothing written.");
    process.exit(1);
  }
  return value;
}

async function ask(question, { def = "", validate = () => null, allowEmpty = false } = {}) {
  for (;;) {
    const answer = (await readLine(def ? `${question} [${def}] ` : `${question} `)).trim() || def;
    if (!answer && !allowEmpty) {
      say("  ...an answer is needed.");
      continue;
    }
    const problem = answer ? validate(answer) : null;
    if (problem) {
      say(`  ${problem}`);
      continue;
    }
    return answer;
  }
}

async function choose(question, options) {
  say(`\n${question}`);
  options.forEach((o, i) => say(`  ${i + 1}. ${o.label}${o.note ? `\n     ${o.note}` : ""}`));
  const n = await ask("Choose", {
    def: "1",
    validate: (v) => (/^\d+$/.test(v) && +v >= 1 && +v <= options.length ? null : `1 to ${options.length}.`),
  });
  return options[+n - 1];
}

const yes = async (question, def = "y") =>
  /^y/i.test(await ask(`${question} (y/n)`, { def, validate: (v) => (/^[yn]/i.test(v) ? null : "y or n.") }));

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");

async function readJson(where) {
  if (/^https:\/\//.test(where)) {
    const res = await fetch(where, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return JSON.parse(await res.text());
  }
  return JSON.parse(await readFile(where, "utf8"));
}

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

// --- the registry, read-only ------------------------------------------------

let registrySource = REGISTRY_ARG ?? process.env.TEXTBOOK_REGISTRY ?? ((await exists(SIBLING)) ? SIBLING : DEFAULT_REGISTRY);
let registry = null;
try {
  registry = await readJson(registrySource);
} catch (err) {
  say(`! Could not read the registry at ${registrySource} (${err.message}).`);
  say("  Carrying on without it. Two checks are then impossible: that the slug is free,");
  say("  and that the platform's endpoints in the generated files are current.");
}

const taken = new Set((registry?.books ?? []).map((b) => b.slug));
const takenRepos = new Set((registry?.books ?? []).map((b) => b.content.repo.toLowerCase()));
const takenHosts = new Set(
  (registry?.books ?? []).flatMap((b) => [b.site.domain, ...(b.site.aliases ?? []), ...b.site.legacy_origins.map((o) => new URL(o).hostname)].filter(Boolean)),
);
const bookParent = registry?.platform?.portal?.book_parent ?? null;
const portalDomain = registry?.platform?.portal?.domain ?? null;

// --- the questions ----------------------------------------------------------

say("");
say("A new book on the platform");
say("==========================");
say("");
say("Five answers, then a file a platform owner reviews. Nothing here changes");
say("anything outside this folder.");
if (registry) say(`Registry read from ${registrySource} (${registry.books.length} book(s) already registered).`);

const title = await ask("\nThe book's title, as readers see it:");

say("");
say("The slug is this book's permanent key: its issues, backups, URLs and every");
say("service's record of it hang off the string. It is never changed and never");
say("reused, even after the book is retired. Lower-case words joined by hyphens.");
const slug = await ask("Slug:", {
  def: slugify(title),
  validate: (v) => {
    if (!SLUG_RE.test(v)) return "Lower-case letters, digits and single hyphens only.";
    if (v.length < 3 || v.length > 40) return "3 to 40 characters.";
    if (taken.has(v)) return `"${v}" is already registered, and a slug is never reused. Choose another.`;
    return null;
  },
});

const summary = await ask("\nOne sentence for the portal's listing (max 300 characters):", {
  validate: (v) => (v.length <= 300 ? null : `${v.length} characters; the limit is 300.`),
});

const licence = await ask("\nLicence for the text, as an SPDX identifier:", {
  def: "CC-BY-SA-4.0",
  validate: (v) => (/^[A-Za-z0-9.+-]+$/.test(v) ? null : "An SPDX identifier, e.g. CC-BY-SA-4.0."),
});

const maintainerName = await ask("\nMaintainer's name, as it appears on the book:");
say("");
say("The maintainer's GitHub login. It has to be set if they pay for the site:");
say("a site-health alert has to reach somebody who can act on it.");
const maintainerGithub = await ask("Maintainer's GitHub login:", { validate: (v) => (LOGIN_RE.test(v) ? null : "A GitHub login.") });

say("");
say("The content repository, owner/name. It must be PUBLIC (the author's console");
say("signs in with the public_repo scope, and the registry's CI enforces it), and");
say("both branches below must exist before the registry pull request can pass.");
const repo = await ask("Content repository:", {
  def: `${maintainerGithub}/${slug}`,
  validate: (v) => {
    if (!REPO_RE.test(v)) return "owner/name.";
    if (takenRepos.has(v.toLowerCase())) return "Another book already uses that repository.";
    return null;
  },
});
const liveBranch = await ask("Live branch:", { def: "main" });
const draftsBranch = await ask("Drafts branch (never the same as live):", {
  def: "drafts",
  validate: (v) => (v === liveBranch ? "It must differ from the live branch: that difference is what keeps the browser editor off the live book." : null),
});

const host = await choose("Where will readers' pages be served from?", [
  {
    id: "obsidian-publish",
    label: "Obsidian Publish, on a subdomain of the portal",
    note: "A paid Publish subscription. The maintainer binds the custom domain; the platform owner creates the DNS record.",
  },
  {
    id: "static",
    label: "A static site (Quartz) on Cloudflare Pages or similar",
    note: "No subscription. Needs a site builder in this repo; see SETUP.md.",
  },
]);

let site;
if (host.id === "obsidian-publish") {
  const suggested = bookParent ? `${slug}.${bookParent}` : portalDomain ? `${slug}.${portalDomain}` : "";
  const domain = await ask("\nThe hostname readers visit:", {
    def: suggested,
    validate: (v) => {
      if (!HOST_RE.test(v)) return "A bare hostname: no scheme, port or path.";
      if (takenHosts.has(v)) return "Another book already answers on that hostname.";
      if (sharedSuffixOf(v)) return `${v} is on a shared platform suffix. Only a static preview book may use one, because the platform cannot park or redirect a hostname it does not hold.`;
      if (bookParent && v.endsWith(`.${bookParent}`) && v.slice(0, -bookParent.length - 1).includes(".")) return `More than one label under ${bookParent}; the certificate covers only <label>.${bookParent}.`;
      return null;
    },
  });
  say("");
  say("The Publish site's id: the 32-hex `uid` in .obsidian/publish.json, which");
  say("every published page also carries in window.siteInfo. Leave it empty if the");
  say("site does not exist yet — the entry then carries a placeholder the platform");
  say("owner has to fill before merging.");
  const siteId = await ask("Publish site id:", {
    allowEmpty: true,
    validate: (v) => (/^[0-9a-f]{32}$/.test(v) ? null : "32 lower-case hex characters."),
  });
  const paidBy = (await choose("Whose subscription keeps this site up?", [
    { id: "maintainer", label: "The maintainer's" },
    { id: "platform", label: "The platform's" },
  ])).id;
  site = {
    domain,
    aliases: [],
    host: {
      kind: "obsidian-publish",
      site_id: siteId || "PLACEHOLDER-32-hex-uid-from-siteInfo",
      publish_host: "publish-01.obsidian.md",
      paid_by: paidBy,
    },
    legacy_origins: [],
    dark: null,
  };
} else {
  const provider = (await choose("Which static host?", [
    { id: "cloudflare-pages", label: "Cloudflare Pages" },
    { id: "github-pages", label: "GitHub Pages" },
    { id: "netlify", label: "Netlify" },
    { id: "vercel", label: "Vercel" },
  ])).id;
  const project = await ask("The host's name for the project:", {
    def: provider === "github-pages" ? repo : slug,
    validate: (v) => (/^[A-Za-z0-9][A-Za-z0-9._/-]{0,99}$/.test(v) ? null : "The provider's project name."),
  });
  say("");
  say("The hostname readers visit. A free *.pages.dev (or *.netlify.app) address is");
  say("allowed, but only while the book is a preview: the platform cannot park or");
  say("redirect a hostname it does not hold, so the registry refuses to let such a");
  say("book go live. A book meant for readers wants a hostname under the portal.");
  const suggested = bookParent ? `${slug}.${bookParent}` : provider === "cloudflare-pages" ? `${project}.pages.dev` : "";
  const domain = await ask("Hostname:", {
    def: suggested,
    validate: (v) => {
      if (!HOST_RE.test(v)) return "A bare hostname: no scheme, port or path.";
      if (takenHosts.has(v)) return "Another book already answers on that hostname.";
      if (sharedSuffixOf(v) === v) return "That is the bare platform suffix, not one site.";
      if (bookParent && v.endsWith(`.${bookParent}`) && v.slice(0, -bookParent.length - 1).includes(".")) return `More than one label under ${bookParent}; the certificate covers only <label>.${bookParent}.`;
      return null;
    },
  });
  const paidBy = (await choose("Whose account holds the project?", [
    { id: "maintainer", label: "The maintainer's" },
    { id: "platform", label: "The platform's" },
  ])).id;
  site = {
    domain,
    aliases: [],
    host: { kind: "static", provider, project, paid_by: paidBy },
    legacy_origins: [],
    dark: null,
  };
}

const onShared = Boolean(sharedSuffixOf(site.domain));
if (onShared) say(`\nNote: ${site.domain} is on a shared platform suffix, so this book can only be registered as a preview.`);

const wantsCms = await yes("\nWill trusted contributors use the browser editor (the CMS)?", "n");
say("");
say("The entry is written with cms.enabled " + (wantsCms ? "true" : "false") + ".");
if (wantsCms) {
  say("The CMS also needs a host of its own and a line in the relay's allowlist,");
  say("neither of which exists yet for this book. Until both are done, the entry");
  say("carries cms.host: null and sign-in will not work. SETUP.md, step 9.");
}

// --- the proposed entry -----------------------------------------------------

const entry = {
  slug,
  status: "preview",
  title,
  summary,
  licence,
  maintainer: { name: maintainerName, github: maintainerGithub },
  content: { repo, live_branch: liveBranch, drafts_branch: draftsBranch },
  site,
  analytics: { plausible: null },
  annotations: { hypothesis_groups: [] },
  suggest_edit: { enabled: true, counted_from: null },
  cms: { enabled: wantsCms, host: null },
  editions: null,
};

const guesses = [];
if (site.host.kind === "obsidian-publish" && site.host.site_id.startsWith("PLACEHOLDER")) {
  guesses.push(
    "`site.host.site_id` is a placeholder. The Publish site does not exist yet, so nobody can know it yet. " +
      "It has to be the real 32-hex `uid` before this is merged — every future probe compares the live site against it. " +
      "Left as it is, `validate` fails with seven schema errors rather than one: the host block is a `oneOf`, so a bad " +
      "`site_id` also reports the branch it did not match. Only the first line matters.",
  );
}
guesses.push(`\`site.host.paid_by\` is **${site.host.paid_by}**, as answered here. Nothing checks it; it is a recorded fact about whose money keeps the site up.`);
guesses.push("`status` is `preview`, always. A book becomes `live` in a second pull request, after the site has been seen to answer on its own hostname.");
guesses.push("`analytics.plausible` and `annotations.hypothesis_groups` are empty. Add them when those accounts exist, not before: a Plausible site name recorded ahead of the rename publishes a dead dashboard link.");
if (!registry) guesses.push("**The registry could not be read when this was generated**, so the slug, repository and hostname were not checked for collisions. Check all three.");
if (onShared) guesses.push(`\`site.domain\` is on a shared suffix, so this book cannot be promoted to \`live\` while it keeps that address (validate.mjs enforces it).`);

const request = `# Registry request: ${title}

Generated by \`scripts/new-book.mjs\`${registry ? ` against ${registrySource}` : ""} on ${new Date().toISOString().slice(0, 10)}.
**This is a proposal, not a registry entry.** Nothing has been changed in the
registry, and nothing about this book is real until a platform owner has merged it.

## For the platform owner

1. Read \`registry-entry.json\` next to this file, then paste it as a new element of
   \`books\` in \`textbook-registry/registry.json\` and open a pull request.
2. CI will check the things it can: schema, uniqueness, slug immutability, that
   \`${repo}\` exists, is public and has both \`${liveBranch}\` and \`${draftsBranch}\`,
   and that the hostname answers (a warning only — a new site rarely answers yet).
3. Merging redeploys the suggest-edit function and rebuilds the portal. The book
   resolves only after that deploy is green.

## What no check can tell you, and this file will not pretend to know

${guesses.map((g) => `- ${g}`).join("\n")}

## What is still to do after the merge

- The GitHub App \`textbook-suggest-edit\` must be installed on \`${repo}\`, by
  somebody with admin on \`${repo.split("/")[0]}\`, with **Only select repositories**.
  Until then every suggestion from this book's site gets a 502.
- ${site.host.kind === "obsidian-publish" ? `DNS for \`${site.domain}\` (platform owner) and the custom domain in Publish (maintainer).` : `The Pages project \`${site.host.project}\`, and DNS for \`${site.domain}\` if it is not a \`*.pages.dev\` address.`}
- A second pull request moving \`status\` to \`live\`, once the site answers.

The ordered procedure, and who does each step, is in \`SETUP.md\`.
`;

// --- what to write ----------------------------------------------------------

const config = { slug };
const hostFiles =
  host.id === "obsidian-publish"
    ? ["templates/suggest-edit/suggest-edit.js", "suggest-edit/suggest-edit.css", "scripts/add-suggest-edit.mjs"]
    : [];
const hostDirs = host.id === "obsidian-publish" ? ["templates/suggest-edit", "suggest-edit"] : [];

say("");
say("About to write:");
say(`  textbook.config.json     { "slug": "${slug}" }`);
say("  registry-entry.json      the proposed entry, for review");
say("  REGISTRY-REQUEST.md      the covering note");
if (hostFiles.length) {
  say("And delete, because this book is on Obsidian Publish and does not use them:");
  for (const f of hostFiles) say(`  ${f}`);
}
say("");
say("NOT written, by design: any change to the registry, any pull request, any");
say("repository, DNS record, App installation or site.");

if (DRY) {
  say("\n--dry-run: nothing written.");
  say("\nThe entry would be:\n");
  say(JSON.stringify(entry, null, 2));
  rl.close();
  process.exit(0);
}

for (const f of ["registry-entry.json", "REGISTRY-REQUEST.md"]) {
  if (await exists(join(ROOT, f))) {
    if (!(await yes(`\n${f} already exists. Overwrite it?`, "n"))) {
      say("Stopped. Nothing written.");
      rl.close();
      process.exit(1);
    }
  }
}
if (!(await yes("\nWrite these files?"))) {
  say("Stopped. Nothing written.");
  rl.close();
  process.exit(1);
}

await writeFile(join(ROOT, "textbook.config.json"), `${JSON.stringify(config, null, 2)}\n`);
await writeFile(join(ROOT, "registry-entry.json"), `${JSON.stringify(entry, null, 2)}\n`);
await writeFile(join(ROOT, "REGISTRY-REQUEST.md"), request);
for (const f of hostFiles) await rm(join(ROOT, f), { force: true });
// and the folders they were the only thing in
for (const d of hostDirs) await rm(join(ROOT, d), { recursive: true, force: true });
say("\nWritten.");

// --- optionally render the managed files ------------------------------------

say("");
say("The managed files (README.md, index.md, CONTRIBUTING.md, .lycheeignore,");
say("admin/config.yml) can be rendered now from the PROPOSED entry, so the repo");
say("reads as this book rather than as the template. They will say things no");
say("platform owner has agreed to yet, and must be re-rendered after the merge:");
say("  node configure.mjs");
if (await yes("Render them now from the proposed entry?")) {
  const r = spawnSync(process.execPath, ["configure.mjs", "--candidate", "registry-entry.json"], { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) say("\nconfigure.mjs failed. The entry is still written; fix the problem and run it by hand.");
}

say("");
say("Next:");
say("  1. Replace this README, the chapters and the front page with your own.");
say(`  2. Push to ${repo}, with both ${liveBranch} and ${draftsBranch}.`);
say("  3. Send REGISTRY-REQUEST.md and registry-entry.json to the platform owner.");
say("  4. Follow SETUP.md from step 4. Nothing you do before the entry merges can");
say("     make the book resolve: the services bake the registry in at deploy time.");
say("");
say("scripts/new-book.mjs has done its job and can be deleted from this repository.");
rl.close();
