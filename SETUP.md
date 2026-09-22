# Setting up a new textbook on the platform

From "I want a textbook" to "the platform serves it", in the order the steps
actually depend on each other.

A book is not a copy of another book. It is **five things that have to agree**:

| | Who makes it |
|---|---|
| A content repository, public, with a live branch and a drafts branch | the book's maintainer |
| An entry in the platform registry | the platform owner, by reviewed pull request |
| A site readers can open | the maintainer, on their own Publish subscription or static host |
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
allowlist, and the portal. Four steps need them and cannot be worked around:

1. Merging the registry entry (`textbook-registry/.github/CODEOWNERS`).
2. The DNS record for `<slug>.confused4now.org`.
3. Adding a CMS host to the relay's `ALLOWED_DOMAINS`.
4. Watching the deploy that carries the new registry into production.

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

**Whose subscription.** Obsidian Publish is paid per site. Whoever's card it is
becomes `site.host.paid_by` in the registry, and, if it is the maintainer's, the
alert when a site goes dark is sent to them. This is why `maintainer.github` is
required for a maintainer-paid book.

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

It asks for the title, slug, summary, licence, maintainer, repository, branches
and host kind, and writes:

- `textbook.config.json` — the slug, and nothing else. Every other fact lives in
  the registry, where the services read it.
- `registry-entry.json` — the **proposed** registry entry.
- `REGISTRY-REQUEST.md` — the covering note for the platform owner, listing what
  in the entry is a guess.
- the managed files (`README.md`, `index.md`, `CONTRIBUTING.md`, `.lycheeignore`,
  `admin/config.yml`), if you let it render them from the proposal.

It deliberately does **not** touch the registry, open a pull request, create a
repository, a DNS record or a site. See "What cannot be automated" at the end.

Then write the book: `chapters/`, concept pages in `chapters/Definitions/`,
pictures in `assets/<chapter>/`, the front page in `templates/index.md`.

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

3. Turn on branch protection for the live branch, requiring a pull request. The
   drafts branch stays unprotected: the browser editor and the console write to
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
maintainer meant; whether `site_id` is that Publish site's real `uid`; who is
actually paying; whether the hostname is one the platform can hold. The generated
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

> **The portal check may be red for reasons that have nothing to do with this
> book.** `portal.yml` polls `https://confused4now.org/version.txt`, and the apex
> is not bound to the portal's Pages project yet (`PORTAL-CUTOVER.md`, status
> header: step 6 outstanding). While that is true, set the repository variable
> `PORTAL_VERSION_URL` to the portal's `*.pages.dev` address, or expect the red
> check. A preview book is not listed on the portal in any case.

---

## Step 6 — the site

Two host kinds, and they diverge completely. Do one.

### Path A — Obsidian Publish on a portal subdomain

**A6.1 (platform owner) — the DNS record.** In the Cloudflare zone
`confused4now.org`:

```
CNAME  <slug>  →  publish-main.obsidian.md     proxied (orange cloud)
```

`publish-main.obsidian.md` is Obsidian's documented target for Cloudflare. It is
**not** the `publish-01.obsidian.md` that appears in `.obsidian/publish.json` and
in the registry's `publish_host`, which is the server the site happens to be
served from. Do not substitute one for the other.

Zone SSL mode must be **Full** — Obsidian warns that "Flexible" causes a redirect
loop. It is zone-wide and already set for book one.

The hostname must be exactly one label under the portal domain. Cloudflare's free
Universal SSL covers `<slug>.confused4now.org` and not `a.b.confused4now.org`, and
the registry's validator enforces the depth from `platform.portal.book_parent`.
**That block is recorded** (since 22 September 2026), so this is checked twice
before the record exists: `scripts/new-book.mjs` refuses a deeper hostname at the
prompt, and the registry's `validate` fails the pull request if one gets in anyway.

Do this **shortly before** A6.2, not weeks ahead: between the record existing and
Publish answering on it, the name is a dangling CNAME, which is the subdomain
takeover window `MULTI-BOOK-HOSTING.md` §2e is about.

**A6.2 (maintainer) — bind the custom domain.** Obsidian → Publish → Site options
→ Custom domain → `<slug>.confused4now.org`. A Publish site has exactly **one**
custom URL: entering this replaces whatever was there, and the old hostname
immediately returns Publish's empty 404. There is no window in which both work.

**A6.3 — verify, with the same probe the platform uses:**

```sh
curl -s https://<slug>.confused4now.org/ | grep -o 'window.siteInfo={[^}]*}'
```

`uid` must equal the registry's `site.host.site_id`, `status` must be `active`,
and `customurl` must be the new hostname. Certificate issuance is Obsidian's and
Cloudflare's to do; minutes usually, unbounded on the downside.

**A6.4 (platform owner) — fill in `site_id`** with a second registry pull request
if the entry went in with the placeholder. Nothing else can be checked about a
Publish site, so this value carries the whole binding.

**A6.5 (maintainer) — the reader-side script.** The **template does not ship
`publish.js`**, and this is the one real gap in it. Obsidian Publish has no plugin
system: the suggest-an-edit form, the Hypothes.is embed, the Plausible pageview
and the URL→source-path mapping are all in one 1,582-line file that book one
keeps at `templates/publish.js`. Copy that file (and `publish.css`) from
`textbookproject2026-alt/textbook` at a commit you write down, put it in
`templates/`, and run `node configure.mjs`; it fills the same three tokens this
renderer already knows (`__CONTENT_REPO__`, `__SUGGEST_EDIT_ENDPOINT__`,
`__PLAUSIBLE_SCRIPT_SRC__`). Read it before you publish it: it also hardcodes
`const BRANCH = 'main'`, which is right only if your live branch is `main`.

Then, in the Publish dialog, publish **`index.md`, `chapters/`, `assets/`,
`glossary.md`, `publish.js` and `publish.css`** — and nothing else. In particular
keep `admin/`, `templates/`, `.github/` and `configure.mjs` out of the published
set: `admin/` is the browser editor, and publishing it puts a CMS on the reading
site. Publish serves only what that dialog uploaded; the repository is version
control, not the deploy path.

### Path B — a static Quartz site

**B6.1 (maintainer) — bring Quartz into the repository.** The template does not
vendor it. A Quartz v5 book is a *checkout of Quartz* with the book inside it:
about 1,500 files, `package.json`, `quartz.ts`, `quartz.config.yaml` and the
`quartz/` tree, all of which belong to Quartz and not to this platform. Either
run Quartz's own bootstrap (`npx quartz create`) in this folder, or copy the shape
of `dept-coordinator-test/platform-test-book`, which is the one worked example.

**B6.2 — build from `chapters/`, not `content/`.** Quartz defaults to `content/`.
Pass `-d chapters` instead of moving the book, because the whole platform reads
this layout: the authoring app decides a folder is a textbook by finding
`chapters/`, `assets/` and `glossary.md` together, the CMS collections point at
`chapters/`, and department editions copy `chapters/` and `assets/`.

This is safe for links: Quartz sets `fileData.filePath` to
`<directory>/<file>`, so with `-d chapters` an Edit-on-GitHub link carries
`chapters/chapter-01.md` — repo-relative, exactly what the suggest-edit function
validates and what the console applies a correction to. Page URLs come from
`relativePath` and are unaffected.

**B6.3 — the plugins that matter.** In `quartz.config.yaml`:

```yaml
  - source:
      repo: "https://github.com/textbookproject2026-alt/quartz-edition-extras.git"
      subdir: plugins/edit-on-github
      name: edit-on-github
    enabled: true
    options:
      repo: "<owner>/<name>"   # = content.repo in the registry
      branch: main             # = content.live_branch
```

`edit-on-github` is not optional here: `suggest-edit/suggest-edit.js` reads each
page's source path out of that link, so removing the link removes the form.
`scripts/add-suggest-edit.mjs` fails the build if no page would show it.

Also set `configuration.baseUrl` to **exactly** the registry's `site.domain`, and
leave `enableSPA: false` if you want Hypothes.is to work — Quartz's SPA navigation
destroys the Hypothes.is client irrecoverably, which four rounds of debugging
established on the edition template.

**B6.4 — the build command.**

```json
"build:site": "npx quartz plugin install && npx quartz build -d chapters && node scripts/add-suggest-edit.mjs"
```

**B6.5 — the host.** Cloudflare Pages → Create → Pages → Connect to Git,
authorising **only this repository**:

| Setting | Value |
|---|---|
| Production branch | your live branch |
| Framework preset | None |
| Build command | `git fetch --unshallow \|\| true && npm run build:site` |
| Build output directory | `public` |
| Environment variable | `NODE_VERSION` = `22` |

Check the hostname Cloudflare actually assigned. If the project name was taken,
the address is not the one you assumed, and the function matches
`https://<site.domain>` exactly — a wrong hostname means every suggestion is
refused with 403. Fix `baseUrl`, the registry entry and the README together.

**B6.6 — free subdomain or portal subdomain.** A `*.pages.dev` address is allowed
only while the book is `preview`: the platform cannot park or redirect a hostname
it does not hold, so `validate.mjs` refuses a `live` book on a shared suffix. For
a book meant for readers, add the custom domain:

- platform owner: `CNAME <slug> → <project>.pages.dev`, proxied, in the portal
  zone;
- maintainer: Pages → the project → Custom domains → add `<slug>.confused4now.org`;
- then a registry pull request changing `site.domain` to it.

**B6.7 — expect the drafts preview to fail.** Cloudflare builds the drafts branch
too, at `https://drafts.<project>.pages.dev`. That is a real, unregistered origin:
the form appears there and every submission gets 403, invisibly, because the
browser hides a CORS refusal. This is correct behaviour, and it surprises people.

---

## Step 7 — install the GitHub App (repository admin)

Go to <https://github.com/apps/textbook-suggest-edit> → Install → the account that
owns the content repository → **Only select repositories** → the book's repository.

It should ask for **Issues: read and write** and **Metadata: read**, and nothing
else. **Never choose "All repositories."** The App is public, so an account other
than the App owner's can install it; the function looks the installation up per
repository and refuses a token that was granted anything wider than the one repo.

Until this is done, every suggestion from the book's site returns **502**
`{"error":"github: the app isn't installed on that repository"}`. The reader sees
the form's generic failure copy. That is the designed behaviour, not a bug: the
clear message is in the `error` field and the log line, not in the status code.

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

**Annotation.** Hypothes.is needs no per-book setup; `publish.js` embeds it. Only
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

## Step 10 — go live

When the site answers on its own hostname, the form files a real suggestion, and
(for Publish) `siteInfo` matches: one more registry pull request moving `status`
from `preview` to `live`.

That is what puts the book on the portal, under *The books*. A `preview` book is
listed separately and badged "not for readers"; a `retired` book is never listed
at all.

Set `suggest_edit.counted_from` to the first day whose suggestions should count
as reader activity, so your own testing is not counted.

---

## What still cannot be automated, and why

Honestly, and in order of how much of the setup they account for.

1. **Everything behind a provider's login.** Creating the GitHub repository,
   creating the Cloudflare Pages project, buying or binding a Publish site,
   entering the custom domain, creating the Plausible site, installing the GitHub
   App. Each is a web dashboard belonging to somebody's account, and some are
   behind a paid subscription. No token this platform holds can do them.
2. **The registry entry itself — deliberately.** `new-book.mjs` writes a proposal
   and stops. A registry merge changes what credentials the platform will issue
   and to which origins, and the review is the control (`CODEOWNERS`). Automating
   the write would remove the one gate the design relies on.
3. **DNS.** `MULTI-BOOK-HOSTING.md` §2d plans for registry CI to generate the
   `<slug>` CNAMEs from `registry.json` with a scoped Cloudflare token. It does
   not exist. Until then a book's record is typed by hand by whoever holds the
   zone, and nothing checks that the set of records matches the set of books.
4. **The relay allowlist.** `ALLOWED_DOMAINS` is a Worker variable in no
   repository, edited by hand. `DESIGN.md` step 5a plans for CI to generate it
   from the registry's `cms.host` values. Also not built. It is checked by nothing
   and is printed as "not checkable" on every parity run.
5. **`site_id` for a Publish book.** It does not exist until the site does, and it
   can only be read off the live site or `.obsidian/publish.json`. So the first
   registry entry for a Publish book either waits for the site or carries a
   placeholder and a second pull request.
6. **Verification that a hostname is the book's.** The `siteInfo` probe of
   `MULTI-BOOK-HOSTING.md` §5b — the thing that would catch a subdomain takeover
   or a lapsed subscription daily — is designed and not built. There is no
   `health.json` and no probe. Today it is the curl in step A6.3, run by a person,
   once.
7. **Whether Obsidian verifies domain ownership.** Unknown, and it decides how bad
   a dangling `<slug>.confused4now.org` record is. Testing it needs a second
   Publish account. Until someone does, assume a takeover is possible and keep the
   window between the DNS record and the binding short.
8. **The reader-side front end.** For Publish it is a 1,582-line file copied
   between books; for Quartz it is a second implementation of the same contract.
   Neither is a package, nothing keeps them in step, and a fix to one does not
   reach the other. This is the platform's largest remaining duplication, and the
   template cannot fix it — it needs a shared repository that does not exist yet.
9. **Rendering after a registry-only change.** `configure.mjs` runs when a pull
   request touches the config, a template or the renderer. A registry change alone
   triggers nothing. This template's `apply-config.yml` adds a weekly run that
   opens a pull request when the generated files have fallen behind the registry;
   book one has no such job, so its rendered files can be stale and nothing says
   so.
