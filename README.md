<!-- template-landing-page: configure.mjs replaces this file with the book's own
     README, rendered from templates/README.md. Setup stays in SETUP.md. -->

# Textbook template

The starting point for **a new book** on the platform: its own title, address,
maintainer and history, sharing the platform's services with every other book.

If you want a *department edition* of a book that already exists — the same
chapters on your course's own site — this is the wrong repository. Ask that
book's maintainer for its edition template.

**To start:** copy this folder, then `node scripts/new-book.mjs`, then follow
[SETUP.md](SETUP.md).

---

## What a new book actually is

Five things that have to agree: a public content repository, an entry in the
platform registry, a reading site, the GitHub App installed on the repository,
and — if the book uses a portal subdomain — a DNS record. The registry is the one
that matters: every shared service bakes it in at deploy time, so a book that is
not in the deployed registry does not exist to any of them.

That is why this template is **content plus one renderer**, and not a working
site. The site is host-specific and the services are shared.

## What is in here

| Path | What |
|---|---|
| `chapters/` | The book. One markdown file per page; concept pages in `chapters/Definitions/` |
| `assets/` | Pictures, one folder per chapter |
| `glossary.md` | The glossary. It must exist, at the top: the authoring app identifies a textbook by `chapters/` + `assets/` + `glossary.md` |
| `textbook.config.json` | The slug, and nothing else |
| `admin/index.html` | The browser editor's page. Tooling, never published with the book |
| `templates/admin/config.yml` | **The CMS collections file.** One collection per folder, `format: raw`, writing to the drafts branch |
| `templates/` | Every generated file: `README.md`, `index.md`, `CONTRIBUTING.md`, `.lycheeignore`, `admin/config.yml`, and the Quartz form |
| `configure.mjs` | Renders `templates/` from the slug plus this book's registry entry |
| `scripts/new-book.mjs` | The interactive start: writes the config and a **proposed** registry entry |
| `suggest-edit/`, `scripts/add-suggest-edit.mjs` | The reader's form, for a Quartz-hosted book. Deleted by `new-book.mjs` for a Publish book |
| `.github/workflows/` | `lint`, `link-check`, `apply-config`, `weekly-snapshot` |
| `docs/` | The book's maintainer, author, contributor and student guides, generalised from book one's. Start at `docs/README.md` |

## One config value, and a registry

`textbook.config.json` holds the slug. Everything else — the repository, the
branches, the domain, the licence, the title, the endpoints — is in
`textbookproject2026-alt/textbook-registry`, because that is where the services
read it. Changing any of it is a pull request there, not an edit here.

```sh
node configure.mjs                                  # render from the registry
node configure.mjs --candidate registry-entry.json  # before the entry is merged
node configure.mjs --check                          # CI: is anything stale?
```

`--candidate` is deliberately not automatic. An unreviewed entry is not a
registry entry, and files rendered silently from one would tell contributors
things no platform owner has agreed to.

## What this template leaves out, and why

| Left out | Why |
|---|---|
| `publish.js` / `publish.css` | Obsidian Publish's reader-side script is one 1,582-line file in book one carrying its own history. Vendoring a copy here forks it on day one, and a fix to either copy would never reach the other. SETUP.md A6.5 says where to copy it from and what to check in it |
| Quartz itself | A Quartz book is a checkout of Quartz (~1,500 files) with the book inside it. It belongs to Quartz, it needs upstream syncing, and only one of the two host kinds wants it |
| `contributors.yml`, `dashboard.yml`, `derivatives.yml`, `backup-annotations.yml` | Book-level, but each one needs a script from book one's `scripts/` (2,200 lines), and three of them need something a new book does not have: a Hypothes.is API token, a Plausible site, or an edition template. A workflow that is red from the first commit teaches people to ignore red workflows. Copy them in when the book has the thing they read |
| `stats.yml` | A placeholder that echoes a TODO |
| `OAUTH-SETUP.md`, book one's platform guides | The platform's operator docs now live in `textbook-registry/docs/`, not in any book. This template's `docs/` holds the **maintainer** guides, generalised from book one's |
| `community/`, `LICENSE` | Generated pages the book does not have yet; and the licence is the maintainer's choice, recorded in the registry |
| Anything naming book one | The chapters, front page, glossary, theme colours, Hypothes.is groups and Plausible site are all its own |

## Testing it before you trust it

The proposed entry this template generates has been checked against the real
validator:

```sh
node scripts/new-book.mjs --dry-run      # prints the entry, writes nothing
# then paste it into a copy of registry.json and:
node ../textbook-registry/scripts/validate.mjs <that copy> --base ../textbook-registry/registry.json
```
