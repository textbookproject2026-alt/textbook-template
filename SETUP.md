# Setting up a new textbook on the platform

From "I want a textbook" to "the platform serves it", in the order the steps
actually depend on each other.

A book is not a copy of another book. It is **five things that have to agree**:

| | Who makes it |
|---|---|
| A content repository, public, with a live branch and a drafts branch | the book's maintainer |
| An entry in the platform registry | the platform owner, by reviewed pull request |
| A Cloudflare Pages project the platform's builder deploys the book to | the platform owner, in the platform's account |
| The GitHub App installed on the repository | whoever has admin on the repository's account |
| DNS under the portal domain, if the book uses one | the platform owner, who holds the zone |

Nothing about a book is real until its registry entry is merged. Every shared
service bakes the registry in **at deploy time** and never looks it up while
running, so a book that is not in the deployed registry does not exist to them —
its site gets `403 origin not allowed` from the suggest-edit function, and the
console does not list it.

---

## The two roles

**The book's maintainer** owns the manuscript, the repository and the account it
lives under. They write the book, run the setup script, create the reading site,
and install the GitHub App on their own repository. They can do all of that
without anyone's permission.

**The platform owner** (`textbookproject2026-alt` today) holds everything shared:
the registry and the review on it, the portal zone `confused4now.org`, the
suggest-edit GitHub App and its Vercel project, the CMS auth relay and its
allowlist, the portal, and the builder (`quartz-book`) with the Cloudflare account
every book is served from. Five steps need them and cannot be worked around:

1. Creating the book's Pages project.
2. Merging the registry entry (`textbook-registry/.github/CODEOWNERS`).
3. The DNS record and custom domain for `<slug>.confused4now.org`.
4. Adding a CMS host to the relay's `ALLOWED_DOMAINS`.
5. Watching the deploy that carries the new registry into production, and the
   book's first build.

> **One person holds both gates today.** The design assumes the registry review
> and the App installation are two independent approvals (`DESIGN.md` §4e). While
> the platform owner is also the person installing the App on book repositories,
> they are one gate. It is written down in `textbook-registry/README.md` so it is
> not forgotten; it does not change the steps below.

---

## Step 0 — the decisions you cannot take back

Take these before anything is created.

**The slug.** Lower-case words joined by hyphens, 3–40 characters. It is the
book's permanent key: issues, backups, URLs and every service's record of the
book hang off it. It is **never changed and never reused**, even after the book
is retired — CI rejects any pull request that removes a slug that has ever been
on `main`. A retired book keeps its slug so nothing else can take it.

**The address.** Hypothes.is anchors every annotation to the page URL it was made
on, and there is no bulk move. Moving a book's domain later strands every
annotation made before the move, permanently; book one has done this twice and
`MULTI-BOOK-HOSTING.md` §1a counts the cost. Pick the address you intend to keep.
If an institutional address is coming later, wait for it, or accept that the
margin starts again when it arrives.

**No host to choose.** Every book is built by the platform's builder
(`textbookproject2026-alt/quartz-book`) with one shared configuration, and served
from a Cloudflare Pages project in the platform's account (`paid_by: platform`).
The book repository holds only the book: no Quartz, no site configuration, no
reader-side scripts. The design, Hypothes.is, the Edit / History / Suggest row,
paragraph numbers and the graph all come from the builder, so every book gets
every later improvement at its next build.

**The licence.** An SPDX identifier, recorded in the registry and rendered into
the book's own files.

**Which account owns the repository.** It must be public. Putting it under the
maintainer's own account is the point of the design — the App's installation is
looked up per repository, so a book's repo can live under any account.

---

## Step 1 — the repository (maintainer)

Copy this template into a new folder, then:

```sh
node scripts/new-book.mjs
```

It asks for the title, slug, summary, licence, maintainer, repository, branches,
the Pages project name and the hostname, and writes:

- `textbook.config.json` — the slug, and nothing else. Every other fact lives in
  the registry, where the services read it.
- `registry-entry.json` — the **proposed** registry entry.
- `REGISTRY-REQUEST.md` — the covering note for the platform owner, listing what
  in the entry is a guess.
- `index.md`, the front page, filled in once from `scripts/seed-index.md`. From
  then on it is an ordinary page.
- the managed files (`README.md`, `CONTRIBUTING.md`, `.lycheeignore`,
  `admin/config.yml`), if you let it render them from the proposal.

It deliberately does **not** touch the registry, open a pull request, create a
repository, a DNS record or a site. See "What cannot be automated" at the end.

Then write the book: `chapters/`, concept pages in `chapters/Definitions/`,
pictures in `assets/<chapter>/`, the front page in `index.md` (its frontmatter
lists the book's authors, which the platform's portal shows).

## Step 2 — create it on GitHub, with both branches (maintainer)

1. Create the repository **public** and **empty** — no README, licence or
   `.gitignore`. An initialised repository rejects the first push.
2. Push both branches:

```sh
git init && git add -A && git commit -m "Start the book"
git branch -M main && git branch drafts
git remote add origin git@github.com:<owner>/<name>.git
git push -u origin main drafts
```

Both branches must exist **before** the registry pull request: `check-github.mjs`
fails a registry entry whose `live_branch` or `drafts_branch` is missing, and it
fails an entry whose repository is private or does not exist.

Then turn on branch protection for the live branch, requiring a pull request.
The drafts branch stays unprotected: the browser editor and the console write to
it.

## Step 3 — hand the entry over (maintainer → platform owner)

Send `registry-entry.json` and `REGISTRY-REQUEST.md`. That is the whole handover.

## Step 4 — the registry pull request (platform owner)

Paste the entry as a new element of `books` in
`textbookproject2026-alt/textbook-registry/registry.json` and open a pull request.

**What CI checks for you.** `validate` covers the schema, duplicate slugs,
domains, repositories and CMS hosts, aliases that belong to another book, a
drafts branch equal to the live branch, a domain on a shared suffix
(`*.pages.dev` and friends) for anything but a `static` `preview` book, and that
no slug has been removed. `github-facts` checks the repository exists, is public
and has both branches. A domain that does not answer yet is a **warning**, not a
failure — a new site never answers at this point.

**What CI cannot check, and you must.** Whether the slug is the one the
maintainer meant; whether `site.host.project` is the address Cloudflare actually
gave the Pages project (step 6.1 — do that first); whether the hostname is one the
platform can hold. The generated
`REGISTRY-REQUEST.md` lists these per book.

**Review is required and cannot be self-approved.** `CODEOWNERS` requires an
approving review from a platform owner, and GitHub does not let anyone approve
their own pull request. With one owner, that means either a second reviewer or an
admin override — decide which before turning protection on, and record it.

Merge with `status: preview`, always. `live` comes later, when the site has been
seen to work.

## Step 5 — the deploy (platform owner)

Merging is not deploying. On the merge commit, two workflows run:

- `deploy` fires the suggest-edit function's Vercel hook and polls
  `X-Registry-Version` until production serves the merge SHA. Until it is green,
  the new book's origin is not registered anywhere.
- `portal` fires the portal's Pages hook and polls `/version.txt`.

Check it by hand:

```sh
curl -si -X OPTIONS https://suggest-edit-function.vercel.app/api/suggest-edit \
  | grep -i x-registry-version
```

`portal.yml` polls `https://confused4now.org/version.txt`, which the portal has
served since 22 September 2026. A preview book is listed only under the portal's
*Not for readers* section. What a red run of either workflow means is in
`textbook-registry/docs/SCHEDULED-JOBS.md`.

---

## Step 6 — the site

The site is built by `quartz-book`, not by anything in this repository. The book
repo's job is the layout the builder reads, and one small workflow.

**6.1 (platform owner, before the registry merge) — the Pages project.** A
**Direct Upload** project in the platform's Cloudflare account, the one
`quartz-book`'s `CLOUDFLARE_API_TOKEN` belongs to, named as the entry's
`site.host.project`, with the live branch as its production branch:

```sh
npx wrangler pages project create <project> --production-branch main
```

Not "Connect to Git": a Git-integrated project cannot take the builder's uploads,
and cannot be switched to Direct Upload afterwards. `pages.dev` names are global,
so check the address it reports. If it is not exactly `<project>.pages.dev`,
correct the entry before merging: the builder deploys by project name, and the
suggest-edit function accepts the book's pages only from `https://<site.domain>`
and from `https://<project>.pages.dev` (plus its branch previews), so a mismatched
name leaves the site with no working Suggest an edit or editor.

**6.2 (maintainer) — the layout.** The builder publishes **`index.md`,
`chapters/`, `assets/`, `glossary.md` and `community/`**, and nothing else, so
`admin/`, `docs/`, `templates/` and the scripts never reach readers. Two rules:

- The book is at the repository root, in `chapters/`, not in `content/`.
- No file of the book's own at the root called `how-to-comment`: the builder adds
  that reader page to every book, and refuses a build that clashes with it.

**6.3 — the first build.** After the registry merge, run `reconcile` in
`quartz-book` (Actions → reconcile → Run workflow, or
`gh workflow run reconcile.yml --repo textbookproject2026-alt/quartz-book --ref main -f slug=<slug>`).
From then on `.github/workflows/nudge.yml` in this repository tells the builder
whenever a branch moves, and the site follows within a couple of minutes; without
it, within 15. A failed build deploys nothing, and the previous site stays up.

Check what is served: `https://<project>.pages.dev/.well-known/textbook.json`
names the book commit and the builder commit it was built from.

**6.4 — free subdomain or portal subdomain.** A `*.pages.dev` address is allowed
only while the book is `preview`: the platform cannot park or redirect a hostname
it does not hold, so `validate.mjs` refuses a `live` book on a shared suffix. For
a book meant for readers:

- platform owner: `CNAME <slug> → <project>.pages.dev`, proxied, in the portal
  zone, and Pages → the project → Custom domains → `<slug>.confused4now.org`;
- then a registry pull request changing `site.domain` to it, if the entry did not
  already have it.

The hostname must be exactly one label under the portal domain: Cloudflare's free
Universal SSL covers `<slug>.confused4now.org` and not `a.b.confused4now.org`.
`scripts/new-book.mjs` refuses a deeper hostname, and `validate` fails a pull
request that has one.

**6.5 — the drafts preview.** The builder also builds the drafts branch, at
`https://drafts.<project>.pages.dev`, with `noindex`. The suggest-edit function
accepts every `https://<label>.<project>.pages.dev` address of the book's own
Pages project, so Suggest an edit and **Edit this page** work there too, and on
`https://<project>.pages.dev` before the book's domain points at it. Anything sent
from a preview goes to this book's repository like any other: a suggestion is an
issue, and an edit is a pull request into drafts.

---

## Step 7 — install the GitHub App (repository admin)

Go to <https://github.com/apps/textbook-suggest-edit> → Install → the account that
owns the content repository → **Only select repositories** → the book's repository.

It should ask for **Issues: read and write**, **Contents: read and write**,
**Pull requests: read and write** and **Metadata: read**, and nothing else.
Contents and Pull requests are for **Edit this page** (the in-site editor), which
commits a reader's change to a new `proposed-edits/…` branch and opens a pull
request into drafts; suggestions still get issues-only tokens. **Never choose "All repositories."** The App is public, so an account other
than the App owner's can install it; the function looks the installation up per
repository and refuses a token that was granted anything wider than the one repo.

Until this is done, every suggestion from the book's site returns **502**
`{"error":"github: the app isn't installed on that repository"}`, and the editor
tells the reader "Editing isn't switched on for this book yet". The detail is in
the `error` field and the log line.

**An account that installed the App before 24 Sep 2026** (before the editor) has
a pending permissions request, not the new permissions: on that account,
<https://github.com/settings/installations> → **Configure** next to
textbook-suggest-edit → **Review request** → **Accept new permissions**. Until
then suggestions work and the editor answers `502 {"error":"github: credential
unavailable"}`. Each account approves once, for all its books.

**The drafts branch must exist** (Step 2). Without it the editor answers "This book
isn't set up to take edits yet".

## Step 8 — prove it works

With `B=https://<site.domain>` and
`URL=https://suggest-edit-function.vercel.app/api/suggest-edit`:

```sh
# 1. The origin is registered, and CORS echoes this book's own origin.
curl -si -X OPTIONS "$URL" -H "Origin: $B" | grep -iE '^HTTP|access-control-allow-origin|vary'
#    -> 204, access-control-allow-origin: $B, vary: Origin

# 2. Matching is exact. Each of these must be 403 with no CORS header.
for o in "http://<site.domain>" "https://www.<site.domain>" "https://<SITE.DOMAIN>"; do
  curl -s -o /dev/null -w "%{http_code} $o\n" -X OPTIONS "$URL" -H "Origin: $o"
done

# 3. The origin resolves to THIS book's repository. The honeypot files nothing
#    and costs no rate budget.
curl -s -X POST "$URL" -H "Origin: $B" -H 'Content-Type: application/json' \
  -d '{"website":"probe"}'
#    -> 201 {"issueUrl":"https://github.com/<owner>/<name>/issues"}
```

Then, in a browser, open a chapter and send one real suggestion. Expect a
"Thank you" with a link to an issue on **this** book's repository, titled
`Suggested edit: chapters/<file>.md`, filed by `textbook-suggest-edit[bot]`, with
the labels `suggested-edit` and `needs-triage` (created on first use).

Then the editor. The editor has its own endpoint beside the form's:

```sh
curl -s -H "Origin: $B" "https://suggest-edit-function.vercel.app/api/propose-edit?path=index.md" | head -c 120
#    -> {"path":"index.md","branch":"drafts","sha":"…","content":"…
```

`github: credential unavailable` means the permissions request above is still
pending. In a browser, click **Edit this page**, change a word and propose it:
expect "Proposal opened" and a pull request from `proposed-edits/…` into
`drafts`, labelled `proposed-edit` and `needs-triage`. Close it unmerged.

**Four traps, all of them met in practice** (`INTERIM-BOOK.md`):

1. **`BOT_TOKEN` can mask everything.** If that variable is still set on the
   Vercel project, a failed App lookup silently falls back to a personal token
   that can open issues on *any* public repository. The "App not installed" test
   then returns 201, and you learn nothing. Confirm recent submissions log
   `credential=app` before trusting any of this.
2. **The rate limit is per IP, not per book**: 5 an hour per warm instance, and it
   counts every POST that gets past the honeypot, **including ones rejected by
   validation**. Honeypot probes are free.
3. **Never test against another book.** A test suggestion filed on a live book
   counts as reader activity in its dashboard. Every check above either uses this
   book's origin or the honeypot.
4. **A CORS refusal is invisible to the page.** If the form "does nothing", check
   the browser console and then the origin, before anything else.

## Step 9 — the optional pieces

**The browser editor (CMS).** Three things, and two of them are the platform
owner's:

1. (maintainer) A host for `admin/`: its own Cloudflare Pages project, built from
   this same repository — production branch the **live** branch, framework preset
   None, **build command empty**, **build output directory `admin`**. That last
   setting is the important one: Cloudflare then uploads `admin/` and nothing
   else, so the chapters never reach the CMS host, and Sveltia finds
   `config.yml` at the root where it looks for it. The editor reads its config
   from the live branch and writes to the drafts branch; those are different
   things and both are correct.
2. (platform owner) Add that hostname to the relay Worker's `ALLOWED_DOMAINS`. It
   is a Worker variable in no repository, it is enforced, and until it names the
   host the sign-in popup opens and closes with no error. Record the host in the
   registry (`cms.host`) in the same change; the validator refuses a bare
   `pages.dev`-style suffix there for the obvious reason.
3. (maintainer) Give contributors **write** access to the repository. That is all
   the editor's permissions are.

   > The shared relay requests the scope `repo,user`, and this fork ignores any
   > narrower scope the CMS asks for. A contributor who signs in hands the editor
   > a token that can read and write **every repository they can access**,
   > private ones included. Tell them before they sign in.

   The single shared CMS host at `/<slug>/` is designed (`DESIGN.md` step 5b) and
   **not built**. Until it is, every book that wants the editor needs its own
   Pages project and its own allowlist entry.

**Analytics.** Create the Plausible site named **exactly** the book's hostname,
then record `analytics.plausible` in the registry. The public dashboard URL is
derived from that name and never stored, so the two have to change together: a
registry value recorded ahead of the rename publishes a dead link at the next
weekly rebuild.

**Annotation.** Hypothes.is needs no per-book setup; the builder embeds it. Only
private groups are recorded in the registry, and per-cohort groups were decided
against for book one.

**The authoring console.** Nothing to configure. It fetches the registry at
launch, and it shows a book to whoever has push access to that book's repository.
It will write into a checkout only when the checkout's `textbook.config.json`
slug **and** its `origin` remote both match the registry entry — which is why
`new-book.mjs` writes the slug and why the remote must be the registry's
`content.repo`.

**Department editions.** `editions: null` is correct for a new book. A book only
needs an edition template repository when a department asks for one.

## Step 9b — the guides

Fill in `docs/what-this-book-runs-on.md`, and read `docs/README.md`: the book's
guides came with the template, generalised from the platform's first book, and
now belong to this book. The platform owner's side of everything above is in
`textbook-registry/docs/`, starting with `BOOK-LIFECYCLE.md`.

## Step 10 — go live

When the site answers on its own hostname and the form files a real suggestion:
one more registry pull request moving `status` from `preview` to `live`.

That is what puts the book on the portal, under *The books*, and into its key-word
graph, recent changes and browsing by author and topic, which it reads from the
catalog the builder publishes with every build. A `preview` book is
listed separately and badged "not for readers"; a `retired` book is never listed
at all.

Set `suggest_edit.counted_from` to the first day whose suggestions should count
as reader activity, so your own testing is not counted.

---

## What still cannot be automated, and why

Honestly, and in order of how much of the setup they account for.

1. **Everything behind a provider's login.** Creating the GitHub repository,
   creating the Pages project and its custom domain, creating the Plausible site,
   installing the GitHub App. Each is a dashboard or a CLI signed in to somebody's
   account. No token this platform's automation holds can do them.
2. **The registry entry itself — deliberately.** `new-book.mjs` writes a proposal
   and stops. A registry merge changes what credentials the platform will issue
   and to which origins, and what the builder will build and where it deploys, and
   the review is the control (`CODEOWNERS`). Automating the write would remove the
   one gate the design relies on.
3. **DNS.** `MULTI-BOOK-HOSTING.md` §2d plans for registry CI to generate the
   `<slug>` CNAMEs from `registry.json` with a scoped Cloudflare token. It does
   not exist. Until then a book's record is typed by hand by whoever holds the
   zone, and nothing checks that the set of records matches the set of books.
4. **The relay allowlist.** `ALLOWED_DOMAINS` is a Worker variable in no
   repository, edited by hand. `DESIGN.md` step 5a plans for CI to generate it
   from the registry's `cms.host` values. Also not built. It is checked by nothing
   and is printed as "not checkable" on every parity run.
5. **The book's weekly jobs.** Contributors, the project dashboard, derivatives
   and the annotation backup are planned as reusable workflows in `quartz-book`
   with a ten-line caller in each book (`BOOK-ONE-TO-QUARTZ.md` §8 step 14). Until
   they exist, a new book has none of them; see "What this template leaves out" in
   `README.md`.
6. **Rendering after a registry-only change.** `configure.mjs` runs when a pull
   request touches the config, a template or the renderer. A registry change alone
   triggers nothing. This template's `apply-config.yml` adds a weekly run that
   opens a pull request when the generated files have fallen behind the registry.
   The site itself does not need it: the builder reads the registry at every build.
