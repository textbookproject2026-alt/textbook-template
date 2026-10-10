# The author site

This guide is for you, the book's author. It covers the **author site**,
**[author.confused4now.org](https://author.confused4now.org)**: where you bring
chapters in from Word, link citations, concept pages and glossary terms, answer
readers' suggestions, accept changes, and send the drafts to your readers.

**New to all this?** The platform's [guide for authors](https://guide.confused4now.org)
takes you from a folder of Word files to a published book, A to Z. This
guide is the fuller reference for the author site.

It is a website. It works in any browser on any computer (a Mac, Windows, a
Chromebook, a phone at a pinch), and there is nothing to install. It replaced the
Mac app, the Authoring Assistant, on 28 Sep 2026; everything that app did for a book
happens here now, except working on files on your own computer (see *What it doesn't
do*).

It shows you every change before it makes one, and nothing it does reaches readers
until you publish.

---

## Signing in

Open [author.confused4now.org](https://author.confused4now.org), enter your email
address and press **Email me a sign-in link**. Open the link from that email and press
**Sign in**. The link works once, within 15 minutes. You need no GitHub account.

- **Use the address you were invited at.** The site shows the books you are on. The
  sign-in form gives the same answer for any address, so if no email arrives, check
  the address, or ask someone on your book to invite you from **People**.
- **Staying signed in.** The browser stays signed in for 30 days. **Sign out** (or
  **Sign out everywhere**) is in the account menu in the top corner.
- **What you do is done in your name.** Changes you send to the drafts are recorded
  under the name the book credits you by; replies to readers, decisions on draft
  changes and publishing all say *"by Your Name (member m-…) via the author site"*. The writing
  itself is done by the platform's GitHub App.
- **People.** Everyone on a book can invite someone (by name and email) and remove
  someone from its **People** tab, which also lists what changed. Someone who
  joined before email sign-in shows as *needs an email address* until they sign in
  once more with GitHub and give one.

The moon and sun button in the corner switches between dark and light. The site
follows your computer's setting until you press it.

---

## Your books, and a book's chapters

After signing in you see **Your books**. Choose one; its three tabs are
**Chapters**, **Bring in a Word document** and **Waiting for you**.

**Chapters** lists the book as its **drafts area** holds it: the chapters in
order, each folder of concept pages (such as `Definitions`) on its own, then the
front page and the glossary. Open one to read it as readers will see it, with its
pictures, and with who last changed it.

- **Download a copy** puts every file of the book, as the drafts area holds it,
  into one `.zip` from GitHub.
- **See the drafts preview** opens the book as it will be once published.
- **History** lists every change to the drafts area, newest first: who, when and
  what they wrote about it, marked *Live* or *Waiting in drafts*. A chapter's
  **History** button shows only that chapter's changes. Open one to see what it
  changed, or the page as it was then. **Restore this version** opens that text
  in the editor as a new change; nothing in the history is undone or lost.
- **Reader discussion** opens every comment left in the book's margins.

**To change a chapter's wording**, open it on the book's site (a chapter page has
a link, *On the live site (to edit it)*) and press **Edit this page**, or the
pencil beside a paragraph. What you write arrives on the author site as a **draft
change**, for you to accept (below). The author site itself has no editor.

---

## Citations, concept links and glossary

Open a chapter and press **Citations, concept links and glossary**. Choose what
to look for, then **Look through this chapter**. The first time in a browser it
takes a little while to get ready: it is loading the same checker the Mac app used.

It asks three kinds of question, one at a time, with a counter at the top (*12 of
40*). Each shows the sentence it found with the change highlighted, and the
sentence as it would be:

- **Yes, make this change**
- **No, leave it alone**
- **Yes to every mention** of that term or citation
- **No to every mention** of it

**Go back one** and **Stop here and see what I have chosen** are underneath.

1. **Citations to the reference list.** A citation in your text, `(Smith, 1975)`
   or `Smith (1975)`, with a matching entry in **that chapter's own References
   section**, becomes a link that jumps down to the entry. A citation with no
   matching entry is never guessed at: it is listed at the end as something to
   check. (Under *A few more choices* you can choose how the links are written.)
2. **Terms to concept pages.** A mention of one of your concept pages (the short
   pages in `chapters/Definitions/`) becomes a link to it: what a reader sees pop
   up when they hover a term. Headings, code, the reference list and anything
   already linked are left alone. By default only the first mention in a chapter is
   offered; *yes to every mention* links them all.
3. **Glossary terms.** Terms you introduce with a defining phrase (*"X is defined
   as"*), put in **bold** the first time, or capitalise more than once, are offered
   for the glossary, with the sentence that introduces them as the definition.
   Terms already in the glossary are never offered again.

At the end you see **exactly what will change**: every changed line, before and
after, and every new glossary entry. Tick the box and press **Send to drafts**:
the chapter and the glossary go to the drafts area as one change, made by you.

**Only the lines shown change.** Every other line of the chapter is sent back
character for character: no re-wrapping, no tidied spacing. Running it again on
the same chapter is safe; it skips what is already linked and says so.

**If someone else changed the drafts meanwhile** (a published edit, say), nothing
is sent. If your chapter and the glossary weren't touched, your choices still
stand and you are shown the changes again to send; if they were, the chapter is
read again and you go through it again. Nothing anyone else wrote is ever
overwritten.

### `glossary.md` is written by the site

`glossary.md`, at the top of the book, isn't a hand-kept file: every glossary
term you approve is written into it. Each becomes a `## Term` heading with its
definition underneath and *(First used in chapter-05.md.)*, spliced into
alphabetical position; terms already there are never added twice or rewritten.

**So you can safely reword a definition by hand** (with *Edit this page* on the
site's glossary page), and it won't be undone. What isn't safe is reorganising
the file so it stops being a list of `##` headings in alphabetical order: new
entries would land in the wrong place, and terms would be added twice. Ask the
technical contact if you want it structured differently.

---

## Bringing in a Word document

**Bring in a Word document** converts a `.docx` into a chapter. How to write in
Word so that it converts well, and how to read what comes back, is its own guide:
**[`word-to-markdown.md`](word-to-markdown.md)**. In short: choose the file, press
**Convert it**, read the whole converted chapter and the list of anything worth
checking, tick the box, and press **Send to drafts**. Your Word document is never
changed, and it never goes anywhere public: it is converted privately, and only
the chapter you send reaches the book.

---

## Waiting for you

Everything other people have sent in, and the way to your readers.

### Suggestions from readers

These come from the **Suggest an edit** button on the book's site. Readers need no
account, so most come from ordinary readers. Open one to see who sent it, which page
it is about, and what they said.

- **Accept: I'll make the change.** You're taking it on. The reader is thanked and
  told you'll make the change; the suggestion stays in the list, marked
  **Accepted**, until you have. Make the change (with *Edit this page*, then accept
  it here), open the suggestion again and press **I've made the change**: the site
  shows you the latest change to that page in the drafts area, and when you confirm
  it, the reader is sent a link to it and the suggestion is closed.
- **Decline, politely.** A courteous reply says the text is staying as it is, and
  the suggestion is closed. An answered "no" is far better than silence.
- **Open on GitHub**, for anything unusual.

The replies are public, on the book's repository, and end *"Replied by Your Name
(member m-…) via the author site"*. The site never tells a reader the chapter changed unless a
change is there to link to.

**When the reader wrote an exact replacement** (*"the the domains" should be "the
three domains"*), the suggestion offers **Look for it**. If that wording is in the
chapter exactly once, you see the line as it is and as it will be, and **Make this
change and thank the reader** does both at once: only that line changes, and the
reader gets a link to the change. If the wording is there twice, or not at all, it
says so and leaves it to you.

### Draft changes

Edits made with **Edit this page**, by you or by trusted contributors. **Nothing
here has reached readers.** Open one to see the wording before and after.

- **Accept this change**: it goes into the drafts area, and the drafts are put in
  line for the live book. It still hasn't reached a reader. The proposer keeps the
  credit for it.
- **Decline it**: it is closed, with a note saying you declined it.

### Going live

Everything accepted into the drafts area, waiting to go to readers. The drafts area
is **shared**: everything in it goes, whoever wrote it. **Look at it, and publish**
shows how many changes there are, which pages they touch and who wrote them; tick
the box and press **Publish to the live book**.

- **Nothing is published on its own.** Accepting stops at the drafts area;
  publishing is always this separate press.
- **Sometimes it won't let you.** If the same wording was changed in both the
  drafts and the live book, it says so and won't choose between them; it also
  says when GitHub is still working out whether the change can go. Nothing is lost
  either way.
- **The site takes a few minutes to catch up** after publishing. If a build fails,
  the previous version stays up (`troubleshooting.md`).

Under it, a line says whether **the drafts preview** shows the drafts as they stand,
or is still being rebuilt.

### The automatic jobs, discussion and history

**The automatic jobs** lists the jobs the book runs on its own (the weekly
snapshot, the link check and so on) and whether each last finished properly.
There is nothing to do; if one didn't finish, tell the technical contact.
**Reader discussion** opens in a new tab.

---

## What it doesn't do

- **Work offline, or on files on your computer.** Everything happens in the book's
  drafts area, online. *Download a copy* gives you the whole book as a `.zip`
  whenever you want one.
- **Edit text directly.** Use *Edit this page* on the book's site.
- **Show the whole history of a renamed page.** A chapter's History starts at
  its current name; changes from before it was renamed are in the book's History.
- **Mark very old waiting changes exactly.** If the drafts area gets more than
  250 changes ahead of the live book, the oldest waiting ones show as *Live*.
  Sending the drafts to readers clears it.
- **Ask an AI anything.** The Mac app's optional DeepSeek checks aren't here.

---

## When something goes wrong

| What you see | What to do |
|---|---|
| No sign-in email arrives | Check the address and your spam folder, then ask for a new link. If you still get nothing, you may not be on a book yet: ask someone on it to invite you from **People** |
| *"This link has expired"* | Sign-in links work once, within 15 minutes; invitations within seven days. Ask for a new one |
| You're sent back to the sign-in screen | You signed out, were removed from the book, or 30 days passed: sign in again. Nothing you had sent was lost |
| *"Nothing was sent. Since you started, something else changed the drafts area"* | Someone else's change arrived first. Read what changed, then press the button offered (convert again, look again, or read again) |
| Anything about converting a Word document | [`word-to-markdown.md`](word-to-markdown.md), Part 4 |
| A citation wasn't offered | Its entry is missing from that chapter's References section; they're listed at the end |
| *"The checker couldn't be started in this browser"* | Reload the page. If it keeps happening, try another browser and tell the technical contact |
| A published change isn't on the site | `troubleshooting.md` |

**Nothing the site does is damage.** Every past version of every file is kept in
the book's history.

---

## For the technical contact

The author site is its own repository, `author-site`, on Cloudflare Pages; its
back end is suggest-edit-function's `api/author-*` endpoints; a book's authors are
the registry's `authors` for the book; Word conversion runs in the private
book-requests repository. All of that is the platform owner's:
[`textbook-registry/docs/INFRASTRUCTURE.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/INFRASTRUCTURE.md).
