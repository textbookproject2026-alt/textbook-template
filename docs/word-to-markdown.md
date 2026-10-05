# Turning a Word chapter into a textbook chapter

This guide is for you — no technical background needed. It covers writing a
chapter in Word so that it converts cleanly, bringing it in on the author site,
checking that nothing got lost, and getting it to readers.

There is no terminal here, nothing to install and no commands to type. The
**author site** ([author.confused4now.org](https://author.confused4now.org)) does
the conversion, and shows you the whole converted chapter before anything reaches
your book. `docs/the-author-site.md` covers signing in and everything else the
site does; this guide covers the Word half only.

**New to all this?** The platform's [guide for authors](https://guide.confused4now.org)
takes you from a folder of Word files to a published book, A to Z.

The guide has five parts:

1. **Write it right in Word** — habits that make conversion painless (read this before writing)
2. **Converting a chapter** — what the site asks for, and in what order
3. **Check it worked** — reading the site's report, plus a tick-box list per chapter
4. **When something looks wrong** — the common problems and their fixes
5. **Getting it into the textbook** — from converted chapter to live website

Part 1 is the one that matters most. Everything after it is quick when the Word
document is built the way Part 1 describes, and fiddly when it isn't.

---

## Part 1 — Write it right in Word

Ten minutes of good habits in Word saves an hour of cleanup later. Conversion is
literal-minded: it reads the *structure* Word records behind the scenes, not what
the page looks like. Two headings can look identical on screen but be completely
different underneath — and only one of them converts.

**Use real heading styles.** When you start a new section, don't make the text
big and bold by hand. Instead, click on the line and choose a style from the
**Styles** gallery on Word's Home ribbon:

- **Heading 1** — the chapter title (use exactly once, at the top)
- **Heading 2** — main sections
- **Heading 3** — subsections

A quick way to check yourself: open Word's **View → Navigation Pane** (called the
sidebar or document map). If all your headings appear there, in the right order
and nesting, you're set. If a heading is missing from that pane, the conversion
won't see it either.

**Use Word's footnote tool.** For footnotes, go to **References → Insert
Footnote**. Word numbers it, formats it, and keeps it attached to the right
sentence. Never type a superscript number yourself and add a numbered list at the
end of the document — that *looks* like footnotes but converts to loose text.

**Keep tables simple.** Tables convert well when they're a plain grid: one header
row at the top, then rows of cells, with nothing merged or split. If you're
tempted to merge cells to make a complicated layout, break it into two smaller
tables instead — it will also read better on phones.

**Insert pictures the plain way.** Use **Insert → Picture** and place the image on
its own line, "In Line with Text" (Word's default). Avoid text boxes, SmartArt,
WordArt, and shapes drawn in Word — none of these come through as usable content.
The site flags each of them in its report (Part 3), and they have to be redone.

**Before converting, tidy up:**

- If you had Track Changes on, accept all changes (**Review → Accept → Accept All
  Changes**) and turn tracking off. Otherwise both the old and the new text come
  through.
- Delete any leftover comments (**Review → Delete All Comments**).
- Avoid multi-column layouts, headers/footers with content in them, and manual
  page numbers — the website handles layout and navigation itself.

---

## Part 2 — Converting a chapter

### Where things live

- **Your Word files** stay wherever you like, on your own computer. The Word
  document is uploaded for converting and never changed. It is converted
  **privately**: it never goes anywhere public, and only the chapter you send
  reaches the book.
- **The chapter** goes into the book's `chapters` folder, or a folder inside it
  (such as `chapters/Definitions` for a concept page).
- **The chapter's pictures** go into the book's own `assets/`, in a folder named
  after the chapter. A chapter `chapters/chapter-05.md` gets
  `assets/chapter-05/`, and the picture links inside the chapter point there.
  This is the same convention `docs/editing-the-textbook.md` describes, so every
  chapter keeps its pictures in the same place. You are not asked where the
  pictures should go.

### The steps

1. **Open the book on the author site and choose Bring in a Word document.**

2. **Choose the Word document.** It has to be a `.docx`, the kind Word has saved
   since 2007, and under 20 MB. If yours is an older `.doc`, the site says so and
   asks you to open it in Word and use **File → Save As** to save it as a `.docx`
   first.

3. **Choose where it goes** (only if the book has folders inside `chapters`, such
   as `Definitions`). Leave it as **chapters** for a chapter. For a folder inside
   it you can type the name the page should have; it starts as the Word file's own
   name.

4. **Press Convert it.** The file uploads (a bar shows how far), and the
   conversion takes about a minute. **Nothing reaches your book at this point.**

   **What it is called.** Every book on the platform names its chapters
   `chapter-01.md`, `chapter-02.md` and so on (decided 27 Sep 2026), and the site
   names it for you:

   - a Word file the book hasn't seen becomes **the next free number**;
   - **the same Word file again** becomes the chapter it became last time, so
     bringing it in again replaces that chapter. The book remembers which Word
     file became which chapter in `chapter-sources.json`, at its top; the site
     updates it in the same change. Don't edit it by hand;
   - a chapter named before the rule, in a book that went live with other names,
     keeps its name: its web address is live.

   The screen says which of the three it is. Concept pages, in a folder inside
   `chapters`, keep the name you gave them.

   **Why the rule matters:**

   - the website builds its page addresses out of the file names, so one rule
     means one style of address in every book;
   - links between chapters are written from the name — `[[chapter-04]]` only
     works if the file really is `chapter-04.md`;
   - the picture folder is named after the chapter, so a distinctive chapter name
     is what keeps chapters' pictures apart. Word calls its images `image1`,
     `image2` in *every* document, so two chapters sharing one picture folder
     would overwrite each other's figures. (The site won't let that happen: if
     the book already has a pictures folder of that name with no chapter beside
     it, it stops and says so.)

5. **Read what comes back.** The screen shows:

   - **what it becomes**: the chapter's name, and whether it is new or replaces
     one already there;
   - **Worth checking**: the notes on this document. Part 3 explains them;
   - a new chapter's **line on the front page**, under "Contents": it is added in
     the same change, and you see it first. (No "Contents" heading, or the chapter
     already listed: nothing is added, and you're told);
   - **The chapter, as it will be**, with its pictures.

   This is the moment when a problem is cheapest to fix. If something is wrong,
   fix the Word document (Part 4) and press **Start again**: nothing has been
   sent, so there is nothing to undo.

6. **Tick the box and press Send to drafts.** The chapter, its pictures,
   `chapter-sources.json` and the front page's line go to the book's drafts area
   as one change, made by you. **Send to drafts** stays greyed out until you tick
   *I've read the converted chapter*.

   **Bringing a chapter in again** replaces it. The screen says who last changed
   the chapter in the drafts area and how many lines would change, lists any
   pictures the Word file no longer has (they are taken out), and needs a second
   tick, *Replace the chapter that is there now*. Keep in mind that it replaces
   the whole chapter, including any edits made since on the site.

   **If someone else changed the drafts meanwhile**, nothing is sent: the screen
   shows what changed, and **Convert it again** checks your Word document against
   the drafts as they are now. You read it and send it again.

7. **Link it up.** A chapter fresh out of Word has no links in it at all. Open it
   under **Chapters** and press **Citations, concept links and glossary**
   (`docs/the-author-site.md`): the same three questions as for any chapter.

### Cross-references to other chapters

A reference such as "see Chapter 4" converts as ordinary prose and can stay
exactly as it is. If you'd rather it were a clickable link, write it as
`[[chapter-04|the light reactions]]` — the part before the `|` is the target
chapter's file name without `.md`, and the part after is the text readers see.

### One thing that looks odd but is deliberate

Each paragraph in the converted chapter sits on a single very long line. That is
on purpose: it is what lets the change history show exactly which words changed
when someone edits a sentence. Without it, changing one word marks the whole
paragraph as changed and edits become impossible to review. Leave it as it is,
and type new sentences the same way.

---

## Part 3 — Check it worked

### The report

The report is not a table of counts to tick off. It is **a list of notes written
about your document**, under the heading *What to check*, and the converter writes only
the ones that apply — a plain chapter with no tables and no maths produces a
short report, and that is the report working correctly.

Each note has a headline, a paragraph explaining what happened and why, and a
**What to check** line telling you what to do about it. Notes come at three
levels, and the level is the thing to read first:

| Level | What it means |
|---|---|
| **ok** | This went as it should. Nothing to do. |
| **look** | It converted, and nothing is lost — but go and look at it, because markdown holds it differently from Word. |
| **warn** | Something is probably wrong. These are the ones to act on before sending. |

Above the notes sits a single summary line — *`Chapter 5.docx` became a chapter of
4,312 words, 18 headings, 2 tables, 9 footnotes, 6 pictures* — which is where the
counts live. Anything that came out as zero is left out of that line, so a
missing count is itself the signal: no "headings" in the summary means no
headings were found.

**What the notes cover.** Roughly in the order they appear:

- **Pictures** — how many came out and the folder they went into; pictures in
  formats nothing can display; pictures the chapter refers to that never
  arrived; pictures written as `<img>` tags rather than markdown (normal, and
  fine in reading view).
- **Tables** — how many converted cleanly into markdown tables, and how many had
  to be written as blocks of web markup instead.
- **Footnotes** — how many came across, and whether any number in the text has no
  note at the bottom, or any note at the bottom has no number pointing to it.
- **Headings** — how many, and at which levels; whether there are several
  top-level headings; whether a level was skipped; and whether any lines look
  like headings that were made by hand rather than styled.
- **Everything else worth a look** — Word bookmarks left as `[]{#something}`;
  underlining and other formatting markdown cannot hold, left as
  `[text]{.underline}`; mathematics; forced line breaks; text boxes and sidebars
  that came out as blocks of web markup; and whether the chapter has a
  **References** section (without one, the citation check has nothing to match
  against).
- **What the converter itself said** — usually nothing. When it does say
  something, the note quotes it verbatim and treats it as a warning, because it
  normally means part of the document was skipped rather than converted.
- **The shape of the chapter** — a confirmation that each paragraph is on a
  single line, which is what keeps the book's history readable (see Part 2).

There is **no "leftovers" summary**: things that could not be converted are not
gathered into one field. Each surfaces as its own note, and Part 4 lists the ones
that matter.

### The checklist

Then read the chapter: on the author site before sending, and on the drafts
preview (`docs/editing-the-textbook.md`, *Where you edit*) once it is in
`drafts`. Tick these off:

- [ ] **No warnings left unread** — every `warn`-level note in the report has
      either been dealt with or consciously accepted.
- [ ] **Headings** — the chapter title and all section headings are there, at the
      right levels. Compare the page's table of contents on the preview with
      Word's Navigation Pane: same headings, same order, same nesting.
- [ ] **Footnotes** — the count in the summary line matches the last footnote
      number in Word, the notes are listed at the bottom of the file, and the
      numbers in the text are clickable.
- [ ] **Tables** — each one displays as a proper grid with its header row, not as
      a run-together block of text.
- [ ] **Pictures** — every figure from the Word document shows in the chapter,
      and the files are in this chapter's own folder under `assets/`. Same count
      as Word. None shows as a broken image.
- [ ] **Skim the full chapter once** for anything that looks off — stray symbols,
      a gap where something used to be, a formula that turned to gibberish.

If everything ticks, go to Part 5. If not, Part 4 below.

---

## Part 4 — When something looks wrong

Almost every conversion problem traces back to how the Word document was built,
and the fix is always the same shape: **fix it in Word, then convert again.**
Converting again is cheap and safe — until you tick the box and press *Save this
chapter*, nothing has been written — so never patch problems in the converted
chapter while the Word document still has the flaw. Your patches would be lost
the next time you convert, and the flaw would come back.

Each heading below is the converter's own wording, so you can match a note on screen to
the fix for it.

**"N tables could not be made into proper tables"** — a `warn` note. Cause: cells
in the table have been merged, or a single cell holds more than one paragraph.
Markdown tables can do neither, so the table is written out as a block of web
markup instead. None of your text is lost, and the site still shows it as a
table — but it is unpleasant to edit, and the author site's citation and
concept-page questions skip over it entirely, so nothing inside it will ever be
linked. Fix: in Word, unmerge the cells (**Layout → Split Cells**) or rebuild the
table as two or three simple grids, and convert again. If the table is genuinely
complicated, the converter's own advice is to leave it and accept that its contents
won't be linked.

**"No headings came across at all"** — a `warn` note, and it also tells you how
many lines in the chapter *look* like headings written by hand. Cause: the
headings in Word were made by making text bigger and bold rather than with Word's
Heading styles, so Word records them as ordinary paragraphs. Fix: in Word, apply
**Heading 1 / 2 / 3** from the Styles gallery (Part 1), save, and convert again.
The other way is typing `#` in front of each heading afterwards, with **Edit
this page** on the drafts preview; going back to Word is quicker if there are
many.

**"N lines may be headings that did not convert"** — a `look` note, which appears
when *some* headings converted. These are lines standing alone and entirely in
bold, which is what a hand-made heading looks like after conversion — though they
may equally be genuine emphasis. Fix: find them in the preview, and where one
really is a heading, either put the right number of `#` marks in front of it in
the converted chapter or restyle it in Word and convert again.

**Footnotes are missing from the report entirely.** There is no note claiming
zero footnotes — if the document plainly has footnotes and no footnote note
appears at all, they were typed by hand rather than inserted with Word's footnote
tool, and have converted to loose text. Fix: in Word, delete the hand-made
version and re-create each note with **References → Insert Footnote**, pasting
the note's text into the footnote area Word creates. Tedious, but only ever
needed once per chapter. Convert again.

**"Some footnotes do not match up"** — a `warn` note, listing footnote numbers in
the text with no note at the bottom, and notes at the bottom nothing points to.
Cause: usually a footnote deleted in Word without its number being removed, or
the other way round. Fix: the converter's advice is to find them in the preview and
tidy them up after sending, with **Edit this page**.

**"N pictures came out in a format nothing can display"** — a `warn` note naming
the file types, which will be `.emf`, `.wmf`, `.bin` or `.vml`. This is what
charts, SmartArt diagrams, WordArt and pasted spreadsheet ranges become: Word
draws them itself, so nothing outside Word can show them, and they appear as
broken pictures on the site. Fix: in Word, right-click each chart or diagram,
choose **Copy**, then **Paste Special** as a Picture (PNG), and save. Converting
again then produces a picture that works everywhere.

**"Pictures were mentioned but none came out"** — a `warn` note. The chapter
refers to pictures but no picture files were produced, which happens when the
pictures are linked to files elsewhere on the Mac rather than stored inside the
Word document. Fix: open the Word document and check the pictures show up there;
if they do, copy each one and paste it back in, save, and convert again.

**"Some blocks of the document have no markdown equivalent"** — a `look` note.
Text boxes, sidebars and content controls come across as blocks of web markup
rather than plain paragraphs. Nothing is lost, but they read awkwardly. Fix:
decide whether the text inside should simply become ordinary paragraphs — and if
so, make it ordinary paragraphs in Word and convert again.

**"The converter reported a problem"** — a `warn` note that quotes the
converter's own words verbatim, because they are not written for you. The
converter is usually silent, so when it speaks it nearly always means a part of
the document was skipped rather than converted. Fix: compare the chapter in the
preview against the Word document, looking for anything missing. If the wording
means nothing to you, send it to the technical contact — the note says so itself.

**"The paragraphs may have been broken up"** — a `warn` note, and the one problem
on this list that is not yours to fix. It means the one-paragraph-per-line rule
the whole tool depends on (Part 2) did not hold. Tell the technical contact; the
conversion needs looking at.

If you hit something not on this list, don't sink time into it — keep the Word
file and the converted chapter side by side and note what looks wrong. The
difference between the two usually makes the cause obvious to whoever looks next.

---

## Part 5 — Getting it into the textbook

Once the checklist passes and you've pressed **Send to drafts** (Part 2):

1. **Check the top of the chapter.** It should begin with its title as a Heading 1
   (`# Chapter 5: Photosynthesis`) and nothing above it; that heading becomes the
   page's title on the site. Chapters in this textbook carry no front-matter
   block. If a stray line or a duplicate title is at the very top, fix it with
   **Edit this page** on the drafts preview's page, or in Word and bring it in
   again.

2. **Check the front page.** A new chapter's line under **Contents** was added
   when you sent it. If you want the one-sentence description under it that other
   chapters have, add it with **Edit this page** on the front page:

       - **[[chapter-05|Chapter 5: Photosynthesis]]**
         One sentence saying what the chapter covers.

3. **Read it on the drafts preview.** It appears there within a few minutes of
   sending (**Waiting for you** says when the preview has caught up). Look at the
   pictures and tables especially.

4. **Go live.** On the author site, **Waiting for you → Going live**, tick the box
   and press **Publish to the live book**. That routine lives in one place:
   *Going live* in `docs/editing-the-textbook.md`.

   **Sending to drafts and going live are separate, and only going live reaches
   readers.** A chapter in the drafts area is safely stored and visible only on
   the preview.

5. **Check the live site.** A few minutes after going live, open the website, find
   the new chapter from the front page, and give it one last skim.

That's the whole cycle: write in Word with Part 1's habits, bring it in with Part
2's steps, tick Part 3's list, send it live with Part 5. For a chapter written the
way Part 1 describes, the whole thing takes a few minutes end to end.
