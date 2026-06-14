---
name: ai-builders-html-brief
description: Generate a local static HTML page from the Follow Builders public feed. Use when the user asks for an AI builders HTML brief, builder digest webpage, static HTML report, or wants the AI builder feed rendered as an HTML file.
---

# AI Builders HTML Brief

Generate a self-contained HTML brief from the Follow Builders public feed.

## Source Attribution

Content feed source: Follow Builders public feed by Zara Zhang.
This skill renders that public feed into a local HTML page. It does not own or
regenerate the upstream feed.

## Workflow

1. Run the generator from this skill directory:

```bash
node scripts/generate-html.js
```

2. The script writes:

```text
dist/index.html
```

3. Reply with the absolute path to `dist/index.html` and mention that the page
   includes upstream attribution.

## Output Expectations

The generated page should include:

- feed update time and generation time
- upstream source attribution
- stats for X builders, tweets, podcasts, and blogs
- recent X posts grouped by builder
- podcast and blog sections when upstream content is present
- links back to original source URLs

Do not claim this skill collected the source content itself. It only fetches,
formats, and renders the upstream public feed.
