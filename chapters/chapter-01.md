# Chapter 1: Title of the first chapter

Replace this file with your own first chapter. The filename is the address of the
page, so `chapters/chapter-01.md` is served at `/chapters/chapter-01`. Keep the
numbering convention you start with: `chapter-01`, `chapter-02`, and so on.

There is no frontmatter here on purpose. The browser editor's collections are
configured with `format: raw` (`templates/admin/config.yml`), which means the
whole file is the page text and nothing is prepended when a contributor saves.
Adding frontmatter to one chapter is fine; adding it to some and not others is
what makes an editor's saves inconsistent.

A concept page is linked with a wikilink: [[Example concept]]. The link resolves
against the filename, in Obsidian, on Obsidian Publish, and in Quartz. Renaming
a concept page breaks every chapter that links to it.

Pictures for this chapter go in `assets/chapter-01/`, one folder per chapter, and
are written into the text as `![](/assets/chapter-01/figure-1.png)`.
