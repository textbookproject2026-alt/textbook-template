# Editing the textbook

This is the day-to-day guide for the textbook's author. You need **a web
browser**, and the **Authoring Assistant** if you write in Word. There is no
terminal here, and you don't need Obsidian, though you can use it if you like it.

That is not a simplification. The textbook has a lot of machinery around it —
a build, automated jobs, a repository, a review queue — but none of it is yours
to operate. Where a step is handled for you, this guide says so, so you are never
left wondering what you've forgotten. The last section is entirely about things
that change the book without you touching it.

---

## Where you edit

The book is a set of plain-text files in its repository on GitHub. It has two
copies of every file, on two **branches**: the **live** branch, which is what
readers see, and **`drafts`**, the holding area where changes wait until you
send them live. Every way of editing writes to `drafts` first, apart from a
change made straight on the live branch in GitHub.

There are four ways in. Use whichever suits the change.

| Where | Good for |
|---|---|
| **The Authoring Assistant** (`docs/the-authoring-app.md`) | Bringing in a Word chapter, linking citations and concept pages, the glossary, reader suggestions, and **Going live** |
| **The browser editor**, if the book has one (`docs/for-trusted-contributors.md`) | Small edits in a web page. It is the trusted contributors' door too |
| **GitHub's own editor** | A quick fix to one file: open the file on GitHub, press the pencil, and commit. Use the **Edit on GitHub** link on the drafts preview (below), which opens the file on `drafts` |
| **Obsidian**, if you already use it | Longer writing sessions on your own Mac. Your copy has to reach GitHub somehow, and nothing in the book sets that up: agree it with the technical contact and write it down in `docs/what-this-book-runs-on.md` |

**The drafts preview.** `drafts` is built as a website of its own, at
`https://drafts.<project>.pages.dev` (`<project>` is the book's Pages project,
the registry's `site.host.project`; the technical contact can give you the
address). It looks exactly like the live book, so it is where you check a change
before it goes live. It is public but hidden from search engines, it counts no
analytics, and its **Suggest an edit** form refuses every submission, because
the preview isn't the book's registered address.

---

## How the book is organised

Everything you write lives in one of the first four rows. The rest is machinery
that runs itself.

| Where | What it holds |
|---|---|
| `chapters/` | The book. One file per chapter: `chapter-01.md`, `chapter-02.md`, and so on. |
| `chapters/Definitions/` | The concept pages — one short, standalone page per idea, named for the idea itself (`Opportunity Cost.md`, `Natural Selection.md`). These are what a reader sees pop up when they hover a linked term inside a chapter. |
| `assets/` | Every image in the book, in one subfolder per chapter: `assets/chapter-05/`. |
| `glossary.md` | The list of terms with the chapter each was first used in. **Written by the authoring app**, not by hand: terms you approve there are spliced in alphabetically, and your own wording is never rewritten. See `docs/the-authoring-app.md` before reorganising it. |
| `index.md` | The front page. An ordinary page: edit it like a chapter. Its frontmatter lists the book's authors. |
| `templates/` | The source of the two files GitHub shows to visitors (`README.md`, `CONTRIBUTING.md`) and of the browser editor's settings. |
| `community/` | Only if the book runs the optional weekly jobs: the pages they write (contributors, project health). Don't edit them by hand; they get overwritten. A new book has none. |
| `textbook.config.json` | The book's platform name (`slug`), and nothing else. The title, maintainer, address and licence are in the platform registry — `docs/changing-settings.md` says how to change them. |
| `docs/` | These handover guides, including this one. |
| `scripts/`, `.github/`, `admin/`, `configure.mjs` | Machinery. Ignore entirely. |

**Only `index.md`, `chapters/`, `assets/`, `glossary.md` and `community/` reach
readers.** The platform's builder publishes those and nothing else, so nothing
you keep elsewhere in the repository appears on the site.

**File names are load-bearing.** Chapters are the word `chapter`, a dash, two
digits, `.md` — `chapter-04.md`, `chapter-12.md`; concept pages keep their prose
names, capitals and all. A page's web address is made from its folder and file
name, in lower case with spaces as dashes (`chapters/Definitions/Opportunity
Cost.md` is at `/chapters/definitions/opportunity-cost`), and chapters link to
each other by name. Renaming or moving a file changes its address, breaks links
to it, and strands every reader comment on it (comments are attached to the
address). If a page needs a new name, ask the technical contact rather than
renaming it yourself.

---

## Writing and editing a chapter

Whichever editor you use, nothing you type reaches a reader until it is on the
live branch (*Going live*, below).

**Paragraphs each sit on a single very long line.** That looks odd but it is
deliberate — it is what lets the change history show exactly which words moved
when a sentence is edited. Type your new sentences the same way, and don't press
Return in the middle of a paragraph to "tidy" the line lengths.

**Images.** Put them in the chapter's own folder under `assets/` and give them a
real name — `stratification-diagram.png`, not `Screenshot 2026-08-19 at
14.32.png`.

**Nothing you type is ever the only copy.** Every version of every file is kept
in the book's history. Deleting three paragraphs and wanting them back tomorrow
is a recoverable situation, not a lost one. For last week's text, or last
month's, see [`weekly-snapshots.md`](weekly-snapshots.md).

---

## The markdown you'll actually meet

The chapters are plain text with a handful of marks that mean something — five
kinds, each with one characteristic way of breaking.

**Headings — `#`.** One `#` for the chapter title, at the very top and used
exactly once: it becomes the page's title on the site, in search and in the
graph. Two `##` for sections, three `###` for subsections. The hashes need a
space after them and must be the first thing on the line. *Breaks when:* you
make a heading by bolding a line instead. It looks right and is invisible to the
page's table of contents and to the site's navigation.

**Bold and italic — `**bold**` and `*italic*`.** *Breaks when:* a stray asterisk
is left behind after an edit, which turns a run of the following text bold until
the next asterisk turns up.

**Concept links — `[[double square brackets]]`.** `[[Retroduction]]` links to
the concept page of that name and gives readers a hover preview. The text inside
the brackets must match the page's file name exactly, capitals included:
`[[retroduction]]` and `[[Retroductions]]` are broken links. To make the
sentence read differently from the page name, put the display text after a
vertical bar: `[[Retroduction|the retroductive move]]` — page name first,
what the reader sees second. Chapter-to-chapter links use the file name without
`.md`: `[[chapter-04|the light reactions]]`. *Breaks when:* the name inside the
brackets is retyped from memory rather than copied from the file name.

**Callouts — `> [!abstract]`.** The boxed panels, like the "Key concepts in this
chapter" box at the top of a chapter. The first line is `> [!abstract] Title`,
and **every line after it, blank-looking ones included, must start with `>`**.
The types in use are `abstract`, `tip` and `info`. *Breaks when:* you add a
paragraph inside the box and forget the `>` — the box ends early and the rest
spills out as ordinary text.

**Footnotes and citations.** Two different things live in the chapters:

- Footnotes converted from your Word documents appear as `[^1]` in the text with
  a matching `[^1]: the note text` at the bottom of the file. The number is just
  a label — the two halves have to match, and that is all.
- Linked references work differently. A citation in the text is a link like
  `[Author, 1979](#^ref-author-1979)`, and the matching reference at the bottom
  ends with `^ref-author-1979` — the authoring app writes these for you. The two
  strings must be identical. *Breaks when:* that marker is deleted while tidying
  the bibliography — the citation still looks like a link but lands nowhere.

**Blank lines separate paragraphs.** One is enough; more do nothing extra. A
heading, a list or a callout needs a blank line above it or it gets swallowed
into the paragraph before.

If you meet a mark you don't recognise, leave it alone and mention it to the
technical contact.

### Tags, authors and concept pages

Three optional things the platform reads from the pages themselves. They feed
the platform's front page (its key-word graph, recent changes, and browsing by
author and topic) once the book is listed there. Most are set in a short
**frontmatter** block at the very top of a file, between two `---` lines:

    ---
    tags: [ethics, method]
    authors: [A. Author, B. Author]
    ---

- **Tags:** `tags:` in the frontmatter, or an inline `#tag` in the text.
- **Authors:** `authors:` (or `author:`) in the frontmatter. The book's authors
  are the ones in `index.md`; failing that, the pages'.
- **Concept pages:** every page in `chapters/Definitions/` is one, and so is any
  page with `type: concept` in its frontmatter. `concept: false` makes a page not
  one.
- **Title:** `title:` in the frontmatter overrides the first `#` heading. Chapters
  don't need it.
- **Paragraph numbers:** `paragraphNumbers: false` turns them off for one page.

Leave out anything you don't need. A chapter with no frontmatter at all opens
straight on its `#` title, and that is normal.

---

## Adding a new chapter

1. **Create the file** in `chapters/`, named `chapter-05.md`. If the chapter
   started in Word, convert it instead — `docs/word-to-markdown.md`.
2. **Start it with its title as a heading:** `# Chapter 5: Photosynthesis`, with
   nothing above it but an optional frontmatter block.
3. **Put its images in `assets/chapter-05/`** — a fresh folder per chapter,
   always. Word names images `image1`, `image2` in every document, so chapters
   sharing a folder would overwrite each other's figures.
4. **Link it from the front page.** Open **`index.md`** and add a bullet under
   **Contents**, copying the shape of the one already there:

       - **[[chapter-05|Chapter 5 — Photosynthesis]]**
         One sentence saying what the chapter covers.

5. Check it on the drafts preview, then send it live (next section).

Before going live, check that the new chapter's line is in `index.md` too. If it
isn't there yet, send the chapter live anyway and tell the technical contact the
front page is waiting. That is the one routine step in this guide that isn't
yours to run.

---

## Going live

Getting a change onto the live branch is the only action that changes what
readers see. Everything else — typing, saving, images landing in folders — is
storage.

1. **Look at `drafts` first**, on the drafts preview.
2. In the authoring app, open **Going live** under **Waiting for you**. It shows
   how many changes are waiting, which pages they touch and who wrote them.
3. **Read that before confirming.** The drafts area is shared, so everything in
   it goes, whoever wrote it.
4. Tick the box and press **Publish to the live book**.

The site rebuilds itself from the live branch after every change to it, and
shows the change within a couple of minutes (15 minutes at worst). A change
committed straight to the live branch on GitHub goes live the same way, with no
review, which is why the other routes all go through `drafts`.

How the site looks, and the things each page does — the comment sidebar, the
row of links under the title, the graph — are the platform's, the same for
every book. Nothing in this repository controls them, and nothing needs sending
live for them to work.

---

## Checking the live site

Open the book's address (the registry's `site.domain`) and give it two minutes:

- The front page lists the new chapter, and the link opens it.
- The headings are there, nested the way you meant (the page's table of
  contents shows them).
- The images are all present, the right way up, in the right places.
- A concept link (`[[Opportunity Cost]]`) shows a preview on hover and opens
  the concept page on click.
- Under the chapter title there is a row reading **Edit on GitHub · View
  revision history · Suggest an edit**, a small badge saying either
  *"Annotate this page"* or *"N annotations"*, and a **¶ Numbers** button.
- Paragraph numbers ¶1, ¶2 … are in the margin. Clicking one copies a link to
  that paragraph. The numbers are counted afresh at every build, so adding a
  paragraph renumbers the ones after it.

If the page looks stale, force a fresh copy with **⌘ + Shift + R**.

[SCREENSHOT: a chapter on the live site, with the Edit on GitHub · View revision history · Suggest an edit row under the title]

---

## When something looks wrong

| What you see | Almost always | What to do |
|---|---|---|
| The change isn't on the site | It is still on `drafts`, or the site hasn't rebuilt yet | Check the drafts preview; send it live; give it a few minutes. Then `docs/troubleshooting.md` |
| It's on the drafts preview but not live | It hasn't been sent live | **Going live** in the authoring app |
| A `[[link]]` shows as plain bracketed text | The name inside doesn't match a page exactly | Copy the name from the file itself |
| A callout box ends halfway | A line inside it lost its `>` | Put the `>` back on every line of the box |
| A section is missing from the page's contents | Its heading is bold text, not a `#` heading | Replace the bolding with the right number of hashes |
| A file you didn't touch has changed | One of the automatic jobs, or a contributor's edit | Nothing — see the next section |
| Anything else | Configuration | The technical contact. Say what you were doing and roughly when |

Nothing on this list is damage: the site is always rebuilt from the repository,
and every past version of every file is kept.

---

## What happens around you

The book is not only yours. Files will change that you didn't change. None of
it needs anything from you — this section exists so that a file with yesterday's
date on it never makes you wonder what you missed.

**Contributors' edits arrive as finished text.** Anyone can propose a change to
a chapter, and proposals are reviewed before they reach `drafts`. Deciding
whether a change is *right for the book* is yours; getting it into `drafts` is
not.

**The suggest-edit form files reader corrections.** Every page carries a
**Suggest an edit** button. A reader describes what's wrong — no account, no
login — and the suggestion goes into a review queue, not into the book. It
reaches you as a decision: fix it, or don't. Everything around that decision is
handled for you. `docs/moderating-comments.md` covers what to do with each one.

**Trusted contributors write in a browser editor.** A few people can edit
chapters in a web page. What they write goes into a holding area — no button in
that editor reaches the live site. You read their text and decide whether it
belongs in the book.

**Automated jobs may run every week, unattended.** A new book starts with
three: a Sunday snapshot of the book (see
[`weekly-snapshots.md`](weekly-snapshots.md)), a link check, and a Monday job
that brings the generated files up to date with the platform registry. If the
book later adds the optional jobs — an annotation backup, a contributors page, a
project health page — those write files on their own too. Nobody starts them and
nobody needs to check them weekly — the platform's
[`SCHEDULED-JOBS.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/SCHEDULED-JOBS.md)
is there for whoever does look.

**The front page and the README rewrite themselves** whenever `templates/` is
edited, and on Monday mornings when the book's title, address, maintainer or
licence has changed in the platform registry. That is the mechanism described
under *Adding a new chapter*.

**The site rebuilds itself.** Every change to the live branch or to `drafts`
rebuilds that copy of the site, and so does a change the platform makes to the
book's registry entry or to the shared design. If a build fails, the previous
version of the site stays up.

**The authoring app writes to the book when you tell it to.** The **Authoring
Assistant** — the Mac app that links citations and concept pages, builds the
glossary, and brings chapters in from Word — rewrites the chapter you are working
on and appends to `glossary.md`, always after showing you the whole change and
asking you to tick a box. It is also where reader suggestions and contributors'
draft changes arrive, under **Waiting for you**, so the first three items above
reach you through it rather than through a website.
`docs/the-authoring-app.md` is its guide; `docs/word-to-markdown.md` covers the
Word half.

If a file changed and it wasn't you, it was one of these, and the right
response is to carry on writing.
