#!/usr/bin/env node

import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const SCRIPT_DIR = decodeURIComponent(new URL(".", import.meta.url).pathname);
const SKILL_DIR = join(SCRIPT_DIR, "..");
const PROMPT_PATH = join(SKILL_DIR, "prompts", "digest.md");

const FEEDS = {
  x: "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-x.json",
  podcasts:
    "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-podcasts.json",
  blogs:
    "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-blogs.json",
};

async function fetchJson(name, url) {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ai-builder-brief personal wrapper",
      },
    });
    if (!res.ok) {
      return { value: null, error: `${name}: HTTP ${res.status}` };
    }
    return { value: await res.json(), error: null };
  } catch (error) {
    return { value: null, error: `${name}: ${error.message}` };
  }
}

async function loadPrompt() {
  if (!existsSync(PROMPT_PATH)) return "";
  return readFile(PROMPT_PATH, "utf8");
}

async function main() {
  const [feedX, feedPodcasts, feedBlogs, prompt] = await Promise.all([
    fetchJson("x", FEEDS.x),
    fetchJson("podcasts", FEEDS.podcasts),
    fetchJson("blogs", FEEDS.blogs),
    loadPrompt(),
  ]);

  const errors = [
    feedX.error,
    feedPodcasts.error,
    feedBlogs.error,
    ...(feedX.value?.errors || []).map((error) => `upstream x: ${error}`),
    ...(feedPodcasts.value?.errors || []).map(
      (error) => `upstream podcasts: ${error}`,
    ),
    ...(feedBlogs.value?.errors || []).map((error) => `upstream blogs: ${error}`),
  ].filter(Boolean);

  const x = feedX.value?.x || [];
  const podcasts = feedPodcasts.value?.podcasts || [];
  const blogs = feedBlogs.value?.blogs || [];

  const output = {
    status: "ok",
    generatedAt: new Date().toISOString(),
    sourceAttribution:
      "Content feed source: Follow Builders public feed by Zara Zhang. This personal wrapper only reformats and summarizes the feed.",
    upstreamFeeds: FEEDS,
    prompt,
    x,
    podcasts,
    blogs,
    stats: {
      feedGeneratedAt:
        feedX.value?.generatedAt ||
        feedPodcasts.value?.generatedAt ||
        feedBlogs.value?.generatedAt ||
        null,
      xBuilders: x.length,
      totalTweets: x.reduce((sum, builder) => {
        return sum + (Array.isArray(builder.tweets) ? builder.tweets.length : 0);
      }, 0),
      podcastEpisodes: podcasts.length,
      blogPosts: blogs.length,
    },
    errors: errors.length > 0 ? errors : undefined,
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(
    JSON.stringify({
      status: "error",
      message: error.message,
    }),
  );
  process.exit(1);
});
