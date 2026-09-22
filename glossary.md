# Glossary

The glossary is built by the authoring app from the terms your chapters use, and
then edited by hand. Until you run it, this file is empty apart from this note.

This file has to exist, and it has to be at the top of the repository. The
authoring app decides that a folder is a textbook by finding `chapters/`,
`assets/` and `glossary.md` together (`authoring-assistant/app/convert.py`,
`_is_vault_root`). Without all three it refuses to place a converted chapter's
pictures rather than guess.
