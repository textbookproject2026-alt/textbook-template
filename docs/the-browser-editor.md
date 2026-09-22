# The browser editor: this book's side

**Audience: the book's technical contact.** Trusted contributors can edit
chapters in a web page instead of Obsidian. That page is the browser editor
(Sveltia CMS). It's optional; a book has one when its registry entry says
`cms.enabled: true`. Two halves make it work:

- **This book's half**, which is this page. The editor page is hosted from
  `admin/`, reads a generated config, writes only to the drafts branch, and
  needs contributors to have access to the repository.
- **The platform's half**: the sign-in relay every book shares, its OAuth App,
  and the allowlist of editor hosts. That half belongs to the platform owner, in
  [`textbook-registry/docs/CMS-RELAY.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/CMS-RELAY.md).

The contributor's own guide is [`for-trusted-contributors.md`](for-trusted-contributors.md).
Don't send contributors here.

---

## Setting it up

This is `SETUP.md` step 9, in more detail.

1. **Host `admin/`.** Create a Cloudflare Pages project from this repository:
   production branch = the book's **live** branch, framework preset None,
   **build command empty**, **build output directory `admin`**. That last
   setting is the important one. It means Cloudflare uploads `admin/` and nothing
   else, so the chapters never reach the editor host, and Sveltia finds
   `config.yml` at the root of the site. Note the exact hostname Cloudflare gives
   you.
2. **Ask the platform owner** to add that hostname to the relay's
   `ALLOWED_DOMAINS`, and to record it in the registry as this book's `cms.host`,
   with `cms.enabled: true`. Until the hostname is on the list, the sign-in popup
   opens and closes with no error.
3. **Render the config.** `node configure.mjs` (or the next `apply-config` run)
   writes `admin/config.yml` from `templates/admin/config.yml`, with the repo,
   drafts branch and relay taken from the registry. Never edit
   `admin/config.yml` by hand.
4. **Pin the editor.** `admin/index.html` loads a fixed version of
   `@sveltia/cms`. Sveltia is pre-1.0 and releases often, so bump it
   deliberately, and re-test an edit afterwards.
5. **Give contributors access** (below).

**The drafts branch has to exist on the remote**, or the editor won't start.
`SETUP.md` step 2 creates it.

## The generated config

| In `admin/config.yml` | From the registry |
|---|---|
| `repo` | this book's `content.repo` |
| `branch` | this book's `content.drafts_branch` |
| `base_url` | `platform.cms_auth_relay`, the shared relay |

**`branch:` is the line that keeps contributors off the live book.**
`configure.mjs` refuses to write a config whose drafts branch equals the live
branch, and so does the registry's CI. Protecting the live branch (require a pull
request) makes it hold even if both were bypassed. Leave the drafts branch
unprotected, because the editor merges its own entry pull requests into it.

**If the book is on Obsidian Publish,** keep `admin/` out of the published set.
Otherwise a reader would see the repository layout and the relay URL, and the
page would render as a broken note. Add `admin/` to the `excluded` list in
`.obsidian/publish.json`, and check the Publish dialog once.

---

## Giving a contributor access

Signing in proves who someone is. It grants nothing. A contributor also needs:

**Repo → Settings → Collaborators and teams → Add people → role: Write.**

Write is the right level. It lets the editor cut its `cms/…` branches and open
pull requests, and it doesn't allow changing branch protection or settings.

**Tell them one thing before they sign in.** The shared relay asks GitHub for the
scope `repo,user`, and ignores any narrower request. So the token a contributor
hands the editor can read and write **every repository their GitHub account can
reach**, private ones included. The contributors' guide says so too.

---

## Checking it works

1. Open the editor's address in a private window.
2. **Sign in with GitHub** and authorise *Textbook CMS*.
3. Open a chapter, make a trivial edit, and save.
4. On GitHub, confirm that a `cms/…` branch and a pull request appeared, that the
   pull request targets the **drafts** branch, and that the live branch is
   untouched.

Step 4 is the one that matters. If a pull request ever targets the live branch,
stop, and read the `branch` line in `admin/config.yml` and the registry's
`content.drafts_branch`.

## When it doesn't work

| Symptom | Whose | Cause |
| --- | --- | --- |
| Popup opens and closes, still signed out | **platform owner** | this book's editor host is missing from the relay's `ALLOWED_DOMAINS`, or the relay is down |
| Signs in, but saving fails | yours | the contributor doesn't have **Write** |
| The editor looks old, or a chapter that exists isn't listed | yours | the Pages project has disconnected from Git and stopped rebuilding. Reconnect it |
| The whole chapter is one text box | nobody | correct. `format: raw`: chapters have no frontmatter |
| A save adds a `---` block at the top | yours | `format: raw` was changed. Revert it in `templates/admin/config.yml` |
