# Troubleshooting

Things that have actually gone wrong on the platform's books, what to check when
each one happens, and what fixes it.

Each entry says who fixes it. **You** means you can finish it yourself in a
browser, on the book's site or the author site. **The technical contact** means it is
configuration — report it and stop; there is nothing you can do from your side,
and nothing you can make worse by having looked. Some of these turn out to be in
a service that every book on the platform shares, such as the builder that makes
the site; then the technical contact passes it to the **platform owner**, and you
don't need to know which it was.

Nothing here is damage. The site is always rebuilt from the repository, a failed
build leaves the previous version of the site up, and every version of every file
is kept.

| What you see | Who fixes it |
|---|---|
| [The site doesn't show a change I sent live](#the-site-doesnt-show-a-change-i-sent-live) | You, then the technical contact |
| [The site looks different, or a control is missing](#the-site-looks-different-or-a-control-is-missing) | The technical contact |
| [An annotation vanished or moved to the wrong text](#an-annotation-vanished-or-moved-to-the-wrong-text) | You |
| [Edit on GitHub gives a 404](#edit-on-github-gives-a-404) | The technical contact |
| [The suggest-edit form shows an error](#the-suggest-edit-form-shows-an-error) | The technical contact |
| [Analytics show no data](#analytics-show-no-data) | You, then the technical contact |
| [A weekly job failed](#a-weekly-job-failed) | The technical contact |
| [The browser editor won't sign in](#the-browser-editor-wont-sign-in) | The technical contact |
| [The author site won't sign in, or shows nothing waiting](#the-author-site-wont-sign-in-or-shows-nothing-waiting) | You, then the technical contact |

---

## The site doesn't show a change I sent live

**Check it yourself first; the technical contact takes it from there.**

**Check:**

- **Is the change on the live branch?** A change still on `drafts` shows only on
  the drafts preview. **Going live** on the author site sends it
  (`docs/editing-the-textbook.md`).
- **Has it had time?** The site shows a change within a couple of minutes, and
  15 minutes at worst.
- Hard-refresh the page: **⌘ + Shift + R**. If the change appears, it was your
  browser's cache and nothing is wrong with the site.
- **Which version is the site serving?** Open `/.well-known/textbook.json` on the
  book's address. It names the branch and the book commit the site was built
  from. Compare that commit with the latest one on the live branch on GitHub. If
  the site's commit is older after 15 minutes, the site hasn't been rebuilt.

**Fix:** a change that isn't on the live branch yet is yours: send it live. A
site still on an older commit after 15 minutes is the technical contact's: the
build failed or didn't run, and the previous version stays up until it is fixed.
Say which commit the build marker names.

**For the technical contact:** every book is built and deployed by the
platform's builder, `quartz-book`, not by anything in this repository. A red
`reconcile` run there is a failed build; rebuilding is the platform owner's
(`reconcile` in `quartz-book`, whose README covers it). Check two things that are
this book's first: that the push reached GitHub, and that `nudge.yml` ran in this
repository's Actions tab. Without the nudge the book still rebuilds within 15
minutes.

---

## The site looks different, or a control is missing

**The technical contact fixes this.**

How the site looks and what its pages do — the colours and fonts, the graph,
search, the comment sidebar and badge, the row of links under the title, the
paragraph numbers — are the platform's, shared by every book. Nothing in this
repository controls them, so there is nothing here to edit or send live.

**Check:**

- **Is it every page, or one?** A single page without paragraph numbers may
  have `paragraphNumbers: false` in its frontmatter. The home page never has
  them.
- **Is Suggest an edit missing from every page?** The book's registry entry
  decides whether it is shown at all.
- **Is the badge or the sidebar missing?** That is usually your browser or
  network blocking Hypothes.is; see *If something doesn't work* on the site's
  own `/how-to-comment` page.

**Fix:** report it to the technical contact with a page address. A change to the
platform's design reaches every book at once, so if it looks deliberate, it may
be; the platform owner can say.

---

## An annotation vanished or moved to the wrong text

**You fix this — and usually there is nothing to fix.**

Hypothes.is remembers the exact wording a comment was left on plus a little of
the text either side, then goes looking for it each time the page loads. Editing
that text has three possible outcomes, and all three are normal.

**Check:**

- **Did you edit the passage it was attached to?** If yes, this is expected
  behaviour, not a fault.
- **Is it in the orphans area of the sidebar?** If the passage is substantially
  gone, the comment can't find its place and moves there. The comment survives;
  the link to a specific phrase doesn't.
- **Does the phrase you changed appear more than once on the page?** This is the
  one to watch. The search can settle on the *next* occurrence — no orphan, no
  warning, the highlight is simply now on the wrong text. Seen live: changing
  "the chapter" to "this chapter" moved a highlight to the following "the
  chapter" further down.

**Fix:** nothing to repair. Don't leave a typo in to preserve an anchor. If the
highlight has jumped, say so in your reply — *"fixed, thanks. Heads up, your
highlight has shifted to another spot on the page."* Before a **large** rewrite
of a chapter that carries comments, ask the technical contact to run the
annotation backup by hand first; it takes two minutes and only helps beforehand.

---

## Edit on GitHub gives a 404

**The technical contact fixes this.**

The link is made from the page's source file when the site is built: the
repository, the branch the site was built from (the live branch on the live
site, `drafts` on the drafts preview), and the file's path. A 404 means that file
isn't at that path on that branch any more.

**Check:**

- **Has the file been renamed or moved since the site was last built?** This is
  the usual cause. The site catches up at its next build; if it doesn't, the
  build is failing (*The site doesn't show a change I sent live*). Chapter
  filenames are load-bearing — renaming one breaks every link pointing at it,
  which is why the editing guide says to ask before renaming.
- **Has the repository been renamed, moved or made private?** The link uses the
  repository named in the platform registry, and a private repository shows
  GitHub's 404 to anyone without access.

**Fix:** report it to the technical contact with the address of the page and
what the button did. If you know the file was renamed, say what it was called
before — that turns it into a one-minute fix.

---

## The suggest-edit form shows an error

**The technical contact fixes this. You can say which of the three it is.**

There are three different failures behind that one message, and the form tells
you which if you read the wording.

**Check:**

- **A specific sentence** — something like *"You're sending suggestions too
  quickly, try again in a minute"* — means the backend answered and refused. It's
  working; it rejected this particular submission. Usually a rate limit, sometimes
  a validation rejection.
- **The generic message** — *"Something went wrong sending your suggestion —
  nothing was lost. Try again in a moment, or use Edit on GitHub above."* — means
  nothing answered at all: the backend is down, the network dropped, or the
  ten-second timeout ran out.
- **Did it actually land anyway?** Check **Waiting for you** in the author's
  app. A submission can succeed while the reader still sees a timeout.

**Fix:** the technical contact's, either way. Say which of the two messages
appeared — that alone separates "the backend is down" from "the backend is fine
and rate-limiting someone", which are completely different problems.

**For the technical contact:** the form posts to the platform's shared
suggest-edit function, so this is usually the platform owner's. Before passing it
on, check the two things that are this book's: that the site is on the address
the platform has on record (a form on any other address is refused), and that
the GitHub App `textbook-suggest-edit` is still installed on this repository.
The function's logs, which are the only place the rejection behind the message
is visible, are the platform owner's — see
[`INFRASTRUCTURE.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/INFRASTRUCTURE.md) §2.

---

## Analytics show no data

**Check it yourself first; the technical contact fixes it if it's real.**

**Check:**

- **Your own browser is probably blocking it.** Ad-blockers and Safari's tracking
  protection hide your own visits. Check from a phone on mobile data with the
  blocker off — if numbers appear, nothing is wrong.
- **Are you looking at the right site?** Every book's figures are in the
  platform's one Plausible site, `confused4now.org`, filtered to the book's
  hostname (the dashboard page's link applies the filter). A department edition
  has its own.
- **Is the book live?** Only a `live` book is counted. A `preview` book has no
  analytics script at all.
- **Were the visits on the book's own address?** Analytics count only there.
  Visits to the drafts preview or any other `pages.dev` address are never
  counted.
- **Is it genuinely quiet?** Out of term, on a book that hasn't been announced to
  a cohort, zero is the true number. Compare against a week you know had traffic
  rather than against nothing.

**Fix:** if it is none of those, it's the technical contact's — the Plausible
site recorded in the registry is missing or wrong. Say which site and which
dates you were looking at.

---

## A weekly job failed

**The technical contact fixes this.**

A new book starts with three weekly jobs: the Sunday snapshot, a link check, and
the Monday job that brings the generated files up to date with the platform
registry. A Sunday with no new snapshot is not a failure: none is made in a week
when the book didn't change. A book may add
more later (an annotation backup, a contributors page, a project health page).

**Check:**

- **Is a generated page visibly broken on the live site** — raw text, half
  empty, a stack trace where a table should be? That is worth reporting even
  though the job itself may have finished green.
- **Is a page simply unchanged?** That is not a failure. The jobs change a file
  only when its content differs from last week; a quiet week produces no change
  at all, correctly.
- **Are the contributor or annotation numbers obviously wrong** rather than just
  small? Zero annotations on a book nobody has annotated yet is accurate.

**Fix:** report it to the technical contact and say which page and what looked
wrong. The platform's
[`SCHEDULED-JOBS.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/SCHEDULED-JOBS.md)
(Part 3 covers the template's jobs, which this book started with) is the full diagnostic guide — it is written for
whoever is looking at the Actions tab, which is not you.

---

## The browser editor won't sign in

**The technical contact fixes this.**

The editor at your book's editor address (the registry's `cms.host`) signs people in with their own
GitHub account through a sign-in relay that every book on the platform shares.
Three things break it, and they look different.

**Check:**

- **The GitHub popup opens and closes and you're still signed out.** That's the
  relay — the sign-in never completed. It is configuration, not the contributor.
- **The editor loads but looks old, or a chapter that exists isn't listed.** That
  is the other one: the Cloudflare Pages project has disconnected from Git and
  stopped rebuilding. It has happened before and it will happen again.
- **Can they sign in but not save?** Different thing entirely — they have a
  GitHub account but haven't been granted access to the repository yet. The
  technical contact grants it; the contributor needs to have supplied their
  GitHub username.

**Fix:** all three go to the technical contact. Say which of the three it looks
like, and include the contributor's GitHub username if it's the third. (The
first is the platform owner's in the end — the relay and its list of allowed
editors are shared; the other two are this book's. `docs/the-browser-editor.md`
has the detail.)

---

## The author site won't sign in, or shows nothing waiting

**Work through the checks yourself; the technical contact fixes anything past
them.**

The author site is [author.confused4now.org](https://author.confused4now.org);
`docs/the-author-site.md` is its guide. Signing in is **Sign in with GitHub**: a
small GitHub window opens, you approve, and it closes itself. The site then shows
**Your books** and, in the top corner, your GitHub name.

**Check:**

- **Did the GitHub window never open?** *Your browser blocked the sign-in window.
  Allow pop-ups for this site and try again.* means exactly that: allow pop-ups for
  author.confused4now.org (usually an icon at the end of the address bar), then
  press **Sign in with GitHub** again.
- **Did it close without signing you in?** *Sign-in was cancelled* means Cancel was
  pressed on GitHub's page, or the window was closed. Press the button again.
- **Does it say "that account isn't one of any book's authors"?** The site shows
  the books whose list of authors has your GitHub account on it. Either you're
  signed in with a different account (the name is in the top corner: **Sign out**,
  and sign in with the right one; GitHub signs in whichever account the browser is
  signed in to, so sign out of GitHub too if you need to), or your account hasn't
  been added to the book, which is the technical contact's.
- **Were you sent back to the sign-in screen, or told *Please sign in with GitHub
  again*?** Your pass lasts eight hours, and closing the tab ends it. Sign in
  again; nothing you had sent is lost.
- **Does a list say *None waiting.*?** That is the truth, not a fault: nothing is
  waiting. A list that couldn't be read says so in its place, in words, instead.
- **Does it say *The author site isn't switched on for this book yet*?** The
  platform's GitHub App isn't installed on the book's repository. That is the
  technical contact's.
- **Is the thing you're waiting for even in this queue?** **Waiting for you**
  holds reader suggestions (from the **Suggest an edit** button) and draft changes
  (from **Edit this page**), and the way to going live. Comments left in the
  margins of the book are under **Reader discussion**.

**Fix:** yours are the blocked window, a cancelled or expired sign-in, and the
wrong account. An account that isn't on the book's list, a book that isn't
switched on, and a list that says it couldn't be read are the technical
contact's. Say which message you saw, word for word, and the name shown in the
top corner.

---

## When you report something

Three things turn a guessing game into a two-minute fix:

- **The address of the page** you were looking at.
- **Roughly when** — "this morning", "since Tuesday" — because most of these have
  a scheduled job or a deploy behind them.
- **What you expected instead.** "The change isn't there" and "the change is
  there but the styling is gone" are different problems with the same first
  sentence.

Screenshots help more than descriptions for anything visual. You never need to
apologise for reporting something that turns out to be nothing; the cheap ones
are cheap precisely because they got looked at early.
