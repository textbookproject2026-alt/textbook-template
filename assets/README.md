# assets

Every picture in the book, one folder per chapter: a figure in
`chapters/chapter-01.md` lives in `assets/chapter-01/`.

One folder per chapter is not tidiness. Word names the images inside every
document `image1.png`, `image2.png`, so two chapters sharing a folder overwrite
each other's figures. The authoring app's converter writes here on that
assumption, and the browser editor's `media_folder: assets` puts uploads here
too.

`assets` is also the folder a department edition copies, along with `chapters`.
A picture kept anywhere else is missing from every edition, silently.
