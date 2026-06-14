# AI Builders Briefs 2

A small personal wrapper skill for generating concise AI builder digests.

This project does not collect the source content itself. It reads the public
feed from [Follow Builders](https://github.com/zarazhangrui/follow-builders) by
Zara Zhang, then applies a custom prompt and format for personal summaries.

## What This Wrapper Does

- Fetches the public Follow Builders feed.
- Packages recent X posts, podcast transcripts, and blog posts into one JSON
  context.
- Guides an AI agent to produce a compact Chinese builder brief.
- Keeps attribution visible in both the skill instructions and generated digest.

## Usage

```bash
cd scripts
node prepare-brief.js
```

The script prints a JSON payload containing the latest upstream feed content,
summary instructions, feed statistics, and source attribution.

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

Content feed source: [Follow Builders](https://github.com/zarazhangrui/follow-builders)
public feed by Zara Zhang.

This wrapper only reformats and summarizes that public feed. It does not own,
regenerate, or replace the upstream source list or feed generation pipeline.
