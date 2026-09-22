# Contributing to __TITLE__

GENERATED from `templates/CONTRIBUTING.md` by `configure.mjs`. Edit the template.

Corrections are as welcome as chapters. There are three ways in, lightest first.

## 1. Suggest an edit

Every page of __SITE_URL__ carries a **Suggest an edit** form. No account is
needed. It becomes an issue on this repository, labelled `suggested-edit`, with
your email address masked. Nothing you type can mention or notify anyone.

## 2. Edit on GitHub

Every page also links to its own source file here. With a free GitHub account you
can propose a change as a pull request, and a maintainer reviews it.

## 3. The browser editor

For trusted contributors: a web editor where you edit chapters without Obsidian or
a terminal. Ask __MAINTAINER__ for access. Everything it saves goes to the
`__DRAFTS_BRANCH__` branch as a reviewable pull request; it cannot touch the live
book.

Signing in there gives the editor a GitHub token with the scope the shared relay
requests, which is broader than this repository. Only sign in if you are content
with that.

## House rules for the text

- One page per file in `chapters/`, named to match the existing convention.
- No frontmatter. The pages are body text from the first line, and the browser
  editor is configured to keep them that way.
- Concept pages live in `chapters/Definitions/` and are reached with
  `[[wikilinks]]`. The filename is the link target: renaming one breaks every
  chapter that links to it.
- Pictures go in `assets/<chapter>/`, one folder per chapter.
- The live branch changes through pull requests only.

## Licence

By contributing you agree that your contribution is published under __LICENCE__.
