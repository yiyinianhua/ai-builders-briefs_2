---
name: ai-builder-brief
description: Personal AI builder digest wrapper. Use when the user asks for an AI builder brief, builder digest, AI industry pulse, or wants summaries of recent posts, podcasts, and blog updates from the Follow Builders public feed.
---

# AI Builder Brief

Create a concise personal digest of AI builder activity.

## Source Attribution

Content feed source: Follow Builders public feed by Zara Zhang.
This wrapper customizes personal digest formatting only. It does not own or
regenerate the upstream feed.

## Workflow

1. Run the local context script:

```bash
node scripts/prepare-brief.js
```

2. Read the JSON output. It contains:
   - `x`: recent public X posts from curated AI builders
   - `podcasts`: recent podcast transcript content
   - `blogs`: recent AI company blog posts
   - `prompt`: digest instructions for tone and structure
   - `sourceAttribution`: upstream feed attribution
   - `stats` and `errors`

3. Produce the digest directly in chat. Do not expose raw JSON unless the user
   asks for it.

## Digest Style

Default to Chinese unless the user asks for English or bilingual output.

Prioritize:
- original thinking from builders
- product, agent, model, developer-tooling, and company-building signals
- practical implications over generic news
- clear links back to original posts or episodes

Keep it compact:
- Start with a short "今日信号" section.
- Group X posts by theme instead of listing every post.
- Include podcast or blog content only when there is meaningful signal.
- End with 3-5 things worth watching next.

Always include a short attribution line at the end:
