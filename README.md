# Portfolio

A professional portfolio site built with Astro, featuring a "California Executive" aesthetic.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Push to `main` branch to trigger GitHub Actions deployment to GitHub Pages.

## Content Structure

### Transformation Stories

Edit files in `src/content/transformations/`:

```yaml
---
title: "Story Title"
description: "Short preview for homepage"
order: 1
---

## The Problem
...

## The Insight
...

## What We Built
...

## How It Propagated
...

## What It Demonstrates
...
```

### CV Data

Edit JSON files in `src/content/cv/`:

- `experience.json` - Work experience entries
- `publications.json` - Published works
- `awards.json` - Awards and recognition

## Architecture

- **Framework**: Astro (static output)
- **Styling**: Global CSS with CSS variables
- **JavaScript**: Vanilla JS for interactions only
- **Content**: Markdown for stories, JSON for structured data

## Design Philosophy

"California Executive" - Premium sophistication meets human warmth. Warm colors, generous spacing, subtle animations.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | #2B2826 | Background |
| `--text-primary` | #F5F1E8 | Primary text |
| `--text-secondary` | #C9C0B3 | Secondary text |
| `--accent` | #D4822B | Links, highlights |

### Typography

- **Headings**: Noto Serif Display
- **Body**: Hind
- **Max width**: 760px
