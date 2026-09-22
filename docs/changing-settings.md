# Changing the textbook's title and settings

The book's title, summary, maintainer, web address and licence aren't set in
this repository. They're facts about the book that the whole platform uses: the
portal lists the book by its title, the suggest-an-edit form accepts suggestions
only from the book's address, and the author's app finds the book by them. So
they live in one place every service reads: the book's entry in the platform
registry,
[`textbook-registry/registry.json`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/registry.json).

This repository's `textbook.config.json` holds one thing, the book's `slug`: its
permanent name on the platform. **Never change it.**

## To change the title, summary, maintainer or licence

1. **Ask the platform owner**, saying what you want the new value to be. They
   change the registry by a reviewed pull request.
2. That changes the book's listing on the portal once the registry's deploy
   runs, and what the author's app shows at its next launch.
3. **This book's own pages catch up on their own.** Every Monday an automatic
   job renders the front page, `README.md` and `CONTRIBUTING.md` from the
   registry again. If anything changed, it opens a pull request for the
   technical contact to merge.
4. The next time you publish, the front page on the site changes too.

You never edit those pages themselves.

## To change the web address

**Don't, unless the platform owner has planned it with you.** Every reader
comment is attached to the address it was made on, and nothing can move them, so
a new address starts the margin again. A move is a registry change, plus the
site's custom domain, plus the analytics site's name, all at once. It's planned
by the platform owner, not done from here.

## Important

Don't edit `README.md`, `CONTRIBUTING.md`, `index.md`, `admin/config.yml` or
`.lycheeignore` directly. They're written automatically, and any direct change is
overwritten. To change their wording (rather than a fact the registry holds),
edit the matching file in the `templates` folder instead, through a pull request.
