# FreeOS.me Website

Official website for the FreeOS.me personal Linux distribution project.

This repository hosts:
- A landing page for the project mission and latest highlights.
- A dedicated releases page with full version registry.
- A dedicated changelog page with detailed release notes.
- Markdown source files for long-form project history.

## Project Goals

FreeOS.me is a personal Linux distribution project built in public.

This website is designed to:
- Present the mission and direction of the distro.
- Publish release history in a clean, structured way.
- Keep a transparent changelog over time.

## Current Structure

```text
.
|-- CNAME
|-- index.html
|-- styles.css
|-- app.js
|-- releases.html
|-- releases.css
|-- releases.js
|-- RELEASES.md
|-- changelog.html
|-- changelog.css
|-- changelog.js
|-- CHANGELOG.md
|-- LICENSE
`-- README.md
```

## Screenshots

Add screenshots to a folder such as `assets/screenshots/` and reference them here.

Example:

```md
![Homepage](assets/screenshots/homepage.png)
![Full Releases](assets/screenshots/releases.png)
![Full Changelog](assets/screenshots/changelog.png)
```

## Content Workflow

### Releases
- Canonical source: RELEASES.md
- Full page: releases.html (rendered from Markdown via releases.js)
- Homepage: short preview cards in index.html rendered by app.js

### Changelog
- Canonical source: CHANGELOG.md
- Full page: changelog.html (rendered from Markdown via changelog.js)
- Homepage: short preview timeline in index.html rendered by app.js

## Local Development

You can open the HTML files directly, but Markdown fetch/render may be blocked by browser security on file:// paths.

For reliable local testing, run a local web server from this folder.

Example with Python:

```bash
python -m http.server 8080
```

Then open:

- http://localhost:8080/index.html
- http://localhost:8080/releases.html
- http://localhost:8080/changelog.html

## Editing Guide

If you want to publish a new version:
1. Add the full release entry to RELEASES.md.
2. Add the detailed change notes to CHANGELOG.md.
3. Update preview items in app.js (homepage cards/timeline).
4. Replace placeholder artifact links when ISO/checksum are available.

## Release Checklist Template

Use this checklist for every new release:

- [ ] Add release entry in RELEASES.md
- [ ] Add detailed notes in CHANGELOG.md
- [ ] Update homepage release cards in app.js
- [ ] Update homepage recent changes timeline in app.js
- [ ] Add ISO download URL (when available)
- [ ] Add checksum/hash details in RELEASES.md
- [ ] Verify links between releases and changelog pages
- [ ] Review all user-facing text for consistency
- [ ] Smoke test locally on:
	- [ ] index.html
	- [ ] releases.html
	- [ ] changelog.html

## Roadmap

Short-term:
- Keep RELEASES.md and CHANGELOG.md updated for each iteration.
- Replace placeholder artifact links with real downloads.
- Add real screenshots to this README.

Mid-term:
- Move homepage preview data to a single source file.
- Auto-generate preview cards/timeline from that source.
- Add lightweight validation for broken internal links.

Long-term:
- Add release signature verification guidance.
- Publish a minimal public roadmap page.
- Add optional RSS/Atom feed for releases.

## Tech Notes

- Plain HTML, CSS, and JavaScript.
- Markdown rendering in browser with marked (CDN).
- No framework or build step required.

## License

See LICENSE.
