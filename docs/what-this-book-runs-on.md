# What this book runs on

**Audience: the book's maintainer and its technical contact.** This book is one of
several on a shared platform. This page separates what belongs to **this book**,
which you look after, from what belongs to **the platform**, which you use but
don't run. When something breaks, it tells you which side it's on, and who to ask.

**Fill in the blanks when the book is set up** (`SETUP.md`), and keep this page
current. It's the first thing the next person to look after the book will read.
**Never write a secret value here**, only where a secret is kept.

The platform's own inventory (every shared service, account and deploy pipeline)
is
[`textbook-registry/docs/INFRASTRUCTURE.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/INFRASTRUCTURE.md).

---

## Who is who

- **The maintainer** decides what the book says, and sends it live. *Name:*
- **The technical contact** looks after the book's repository, workflows and
  accounts for the maintainer. *Name:*
- **The platform owner** holds the registry, the shared services and the portal
  domain. They're the only person who can change the facts every service knows
  about this book: its address, title, maintainer, licence, and whether it is
  listed at all.

---

## This book's facts, and where they live

The platform knows this book by the `slug` in `textbook.config.json`. Its entry
in
[`textbook-registry/registry.json`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/registry.json)
is the source of truth for its status, address, title, summary, licence,
maintainer, content repository and branches, reading-site project, analytics,
suggest-an-edit (on or off), browser-editor host and department editions. **Changing any of them is a pull request to the registry**,
made or approved by the platform owner. See [`changing-settings.md`](changing-settings.md).

---

## What belongs to this book

| Piece | This book's value | Held by (account) | Breaks if gone |
|---|---|---|---|
| **This repository** | *owner/name*. It must stay public: the builder reads it without credentials | *account* | everything but the live site, which keeps serving its last build |
| **The reading site** | *Pages project* (`site.host.project`): the live branch on the book's address, `drafts` at `drafts.<project>.pages.dev` | the platform's Cloudflare account (`site.host.paid_by`) | the book is offline |
| **The build nudge** | `.github/workflows/nudge.yml`: tells the builder when a branch moves. It holds no secret | this repository | builds wait for the builder's 15-minute check |
| **The browser editor's host** (optional) | *Pages project and hostname* | *Cloudflare account* | trusted contributors can't edit ([`the-browser-editor.md`](the-browser-editor.md)) |
| **Analytics** (optional) | *Plausible site name. It must equal the book's hostname*. It counts only on that hostname, never on previews | *Plausible account* | no readership figures |
| **Annotation backup** (optional) | *Hypothes.is account, and the repo secret `HYPOTHESIS_API_TOKEN`* | *person* | the weekly backup fails loudly |
| **Weekly workflows** | `weekly-snapshot` (a `snapshot-YYYY-MM-DD` tag), `lint`, `link-check`, `apply-config`, plus any the book adds | this repository | generated files go stale |

**The Plausible site's name must equal the registry's `analytics.plausible.site`.**
A domain move is therefore two changes that land together.

---

## What the platform provides

You don't run any of these. When one fails, tell the platform owner and name the
row.

| Service | What this book gets from it | Symptom when it fails |
|---|---|---|
| **The registry** | the facts above, read by every service below | a change "made" in the registry hasn't reached a service yet |
| **The builder**, `quartz-book` | the reading site: builds both branches with the platform's shared Quartz setup and design, and deploys them. Its build marker is at `/.well-known/textbook.json` on the site | changes stop reaching the site; the last build keeps serving |
| **The suggest-edit function**, with the GitHub App `textbook-suggest-edit` installed on this repository | the *Suggest an edit* form, filing issues labelled `suggested-edit` as `textbook-suggest-edit[bot]` | the form shows its generic failure message |
| **The CMS auth relay** | "Sign in with GitHub" on the browser editor | the sign-in popup opens and closes |
| **The portal** | the book's listing, once it is `live`, with its key words, recent changes and authors, read from the catalog the builder writes (`/.well-known/textbook-catalog.json`) | the book is missing from the front page |
| **DNS** (a book on a portal subdomain) | the book's address | the site stops answering |
| **The Authoring Assistant** | the author's app, and its queue | [`the-authoring-app.md`](the-authoring-app.md) |

The GitHub App is installed on this repository by whoever has admin on the
repository's account (`SETUP.md` step 7). If it's uninstalled, every suggestion
fails.

---

## On the author's Mac

| Item | Where |
|---|---|
| The console's sign-in | login Keychain, service `Authoring Assistant`, account `github-token` |
| A DeepSeek key (optional) | the same service, account `deepseek-key` |
| The app's log | `~/Library/Application Support/Authoring Assistant/log.txt` |

**If the author edits a copy of the book in Obsidian, how it reaches GitHub:**
*write it down here.* Nothing in the template sets this up, and the site is built
only from GitHub, so a copy that drifts from the repository finds out at the
worst moment.
