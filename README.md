# AI Builders Briefs 2

A small collection of personal wrapper skills for generating concise AI builder
digests.


## Skills In This Repo

### `ai-builder-brief`

The root skill packages the public feed into JSON context for an AI agent to
write a compact digest in chat.

Run directly:

```bash
cd scripts
node prepare-brief.js
```

### `ai-builders-html-brief`

This standalone skill fetches the same public feed and automatically renders a
local static HTML page.

Run directly:

```bash
cd ai-builders-html-brief
node scripts/generate-html.js
```

Output:

```text
ai-builders-html-brief/dist/index.html
```

When installed as a skill, ask the agent to generate an AI builders HTML brief.
The skill instructs the agent to run the generator and return the local HTML
path.

## What These Wrappers Do

- Fetches the public Follow Builders feed.
- Packages recent X posts, podcast transcripts, and blog posts into one JSON
  context.
- Guides an AI agent to produce a compact Chinese builder brief or a local HTML
  page.
- Keeps attribution visible in both the skill instructions and generated digest.

## Upstream Feed Sources

The current upstream source list is maintained by Follow Builders. This wrapper
surfaces the list here so readers can quickly see who and what the digest tracks.

### Podcasts (6)

- [Latent Space](https://www.youtube.com/@LatentSpacePod)
- [Training Data](https://www.youtube.com/playlist?list=PLOhHNjZItNnMm5tdW61JpnyxeYH5NDDx8)
- [No Priors](https://www.youtube.com/@NoPriorsPodcast)
- [Unsupervised Learning](https://www.youtube.com/@RedpointAI)
- [The MAD Podcast with Matt Turck](https://www.youtube.com/@DataDrivenNYC/videos)
- [AI & I by Every](https://www.youtube.com/playlist?list=PLuMcoKK9mKgHtW_o9h5sGO2vXrffKHwJL)

### AI Builders on X (26)

[Andrej Karpathy](https://x.com/karpathy),
[Swyx](https://x.com/swyx),
[Josh Woodward](https://x.com/joshwoodward),
[Boris Cherny](https://x.com/bcherny),
[Thibault Sottiaux](https://x.com/thsottiaux),
[Peter Yang](https://x.com/petergyang),
[Nan Yu](https://x.com/thenanyu),
[Madhu Guru](https://x.com/realmadhuguru),
[Amanda Askell](https://x.com/AmandaAskell),
[Cat Wu](https://x.com/_catwu),
[Thariq](https://x.com/trq212),
[Google Labs](https://x.com/GoogleLabs),
[Amjad Masad](https://x.com/amasad),
[Guillermo Rauch](https://x.com/rauchg),
[Alex Albert](https://x.com/alexalbert__),
[Aaron Levie](https://x.com/levie),
[Ryo Lu](https://x.com/ryolu_),
[Garry Tan](https://x.com/garrytan),
[Matt Turck](https://x.com/mattturck),
[Zara Zhang](https://x.com/zarazhangrui),
[Nikunj Kothari](https://x.com/nikunj),
[Peter Steinberger](https://x.com/steipete),
[Dan Shipper](https://x.com/danshipper),
[Aditya Agarwal](https://x.com/adityaag),
[Sam Altman](https://x.com/sama),
[Claude](https://x.com/claudeai)

### Official Blogs (2)

- [Anthropic Engineering](https://www.anthropic.com/engineering) - technical deep-dives from the Anthropic team
- [Claude Blog](https://claude.com/blog) - product announcements and updates from Claude

## Attribution


This wrapper only reformats and summarizes public feed. It does not own,
regenerate, or replace the upstream source list or feed generation pipeline.
