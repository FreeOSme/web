---
title: "Welcome to the FreeOS.me Blog"
date: 2026-04-23
draft: false
summary: "Why this blog exists, how updates will be published, and what is coming next for FreeOS.me."
author: "Vicente Garcia Diaz"
tags: ["announcement", "devlog", "roadmap"]
---

Welcome to the official FreeOS.me blog.

This space is where we will publish development updates, release notes context, and technical decisions as the distro evolves in public.

## What you can expect here

- Short weekly devlogs with practical progress.
- Architecture and tooling notes when we change important pieces.
- Release preparation checklists before each milestone.

## Current focus

Right now we are working on:

- Keeping website content available without CORS issues.
- Improving blog UX with featured posts, card layouts, and pagination.
- Aligning site navigation so links work from every path.

## Publishing workflow

Posts are written in Markdown under `blog/content/posts/` and rendered by Hugo during CI.
When a post is ready, `draft` is set to `false` so it appears in the generated site.

```bash
# Example local workflow
hugo --source blog --destination public/blog
```

## Next milestones

We will keep this blog practical and transparent. The next posts will include concrete progress snapshots and release-oriented updates.
