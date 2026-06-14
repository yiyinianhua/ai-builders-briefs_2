#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = join(SCRIPT_DIR, "..");
const DIST_DIR = join(SKILL_DIR, "dist");
const OUTPUT_PATH = join(DIST_DIR, "index.html");

const FEEDS = {
  x: "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-x.json",
  podcasts:
    "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-podcasts.json",
  blogs:
    "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-blogs.json",
};

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeUrl(value) {
  const raw = String(value || "");
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return raw;
    }
  } catch {
    // Fall through to inert link.
  }
  return "#";
}

function formatDate(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  });
}

function excerpt(value, maxLength = 420) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function link(url, label, className = "") {
  const cls = className ? ` class="${escapeHtml(className)}"` : "";
  return `<a${cls} href="${escapeHtml(safeUrl(url))}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function renderTweet(tweet) {
  return `
    <article class="tweet">
      <p>${escapeHtml(tweet.text)}</p>
      <div class="meta">
        <span>${escapeHtml(formatDate(tweet.createdAt))}</span>
        <span>${Number(tweet.likes || 0)} likes</span>
        <span>${Number(tweet.replies || 0)} replies</span>
        ${link(tweet.url, "Open post")}
      </div>
    </article>`;
}

function renderBuilder(builder) {
  const tweets = Array.isArray(builder.tweets) ? builder.tweets : [];
  return `
    <section class="card">
      <div class="card-title">
        <div>
          <h3>${escapeHtml(builder.name || builder.handle || "Unknown builder")}</h3>
          <p>@${escapeHtml(builder.handle || "unknown")}</p>
        </div>
        ${builder.handle ? link(`https://x.com/${builder.handle}`, "Profile", "pill") : ""}
      </div>
      ${tweets.map(renderTweet).join("") || `<p class="empty">No recent posts.</p>`}
    </section>`;
}

function renderPodcast(item) {
  return `
    <article class="card">
      <div class="eyebrow">${escapeHtml(item.name || "Podcast")}</div>
      <h3>${escapeHtml(item.title || "Untitled episode")}</h3>
      <p>${escapeHtml(excerpt(item.transcript, 520))}</p>
      <div class="meta">
        <span>${escapeHtml(formatDate(item.publishedAt))}</span>
        ${link(item.url, "Open episode")}
      </div>
    </article>`;
}

function renderBlog(item) {
  return `
    <article class="card">
      <div class="eyebrow">${escapeHtml(item.name || "Blog")}</div>
      <h3>${escapeHtml(item.title || "Untitled post")}</h3>
      <p>${escapeHtml(excerpt(item.content || item.description, 520))}</p>
      <div class="meta">
        <span>${escapeHtml(formatDate(item.publishedAt))}</span>
        ${link(item.url, "Open article")}
      </div>
    </article>`;
}

function renderSection(title, count, body) {
  return `
    <section class="section">
      <div class="section-heading">
        <h2>${escapeHtml(title)}</h2>
        <span>${Number(count || 0)}</span>
      </div>
      ${body || `<p class="empty">No upstream items in this feed.</p>`}
    </section>`;
}

export function buildHtmlDocument(payload) {
  const x = Array.isArray(payload.x) ? payload.x : [];
  const podcasts = Array.isArray(payload.podcasts) ? payload.podcasts : [];
  const blogs = Array.isArray(payload.blogs) ? payload.blogs : [];
  const stats = payload.stats || {};

  const generatedAt = formatDate(payload.generatedAt || new Date().toISOString());
  const feedGeneratedAt = formatDate(stats.feedGeneratedAt);
  const attribution = payload.sourceAttribution || "";

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI Builders Brief</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f7f4;
      --ink: #20242c;
      --muted: #626b78;
      --line: #dadbd5;
      --panel: #ffffff;
      --accent: #0c6b5f;
      --accent-2: #9b3d2e;
      --soft: #eef4ef;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.55;
    }
    a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 3px; }
    .page { max-width: 1120px; margin: 0 auto; padding: 40px 20px 72px; }
    header { border-bottom: 1px solid var(--line); padding-bottom: 28px; margin-bottom: 28px; }
    h1 { font-size: clamp(34px, 7vw, 72px); line-height: 0.95; margin: 0 0 16px; letter-spacing: 0; }
    h2, h3, p { margin-top: 0; }
    .lede { color: var(--muted); max-width: 780px; font-size: 18px; }
    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 28px 0; }
    .stat { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 16px; }
    .stat strong { display: block; font-size: 28px; line-height: 1; color: var(--accent-2); }
    .stat span { display: block; color: var(--muted); margin-top: 6px; font-size: 14px; }
    .source { background: var(--soft); border: 1px solid #cfdcd2; border-radius: 8px; padding: 14px 16px; color: #2b4c43; }
    .section { margin-top: 36px; }
    .section-heading { display: flex; justify-content: space-between; gap: 16px; align-items: center; border-bottom: 1px solid var(--line); margin-bottom: 16px; }
    .section-heading h2 { font-size: 28px; margin-bottom: 10px; }
    .section-heading span { color: var(--muted); font-weight: 700; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .card { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 18px; }
    .card-title { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 14px; }
    .card h3 { margin-bottom: 4px; font-size: 20px; }
    .card-title p, .meta, .empty, .eyebrow { color: var(--muted); }
    .tweet { border-top: 1px solid var(--line); padding-top: 14px; margin-top: 14px; }
    .tweet p { white-space: pre-wrap; }
    .meta { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; font-size: 13px; }
    .pill { border: 1px solid var(--line); border-radius: 999px; padding: 5px 10px; text-decoration: none; font-size: 13px; white-space: nowrap; }
    .eyebrow { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 8px; }
    footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--line); color: var(--muted); font-size: 14px; }
    @media (max-width: 760px) {
      .page { padding: 28px 14px 48px; }
      .stats, .grid { grid-template-columns: 1fr; }
      h1 { font-size: 44px; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header>
      <h1>AI Builders Brief</h1>
      <p class="lede">A static HTML view of recent AI builder posts, podcasts, and official blog updates from the Follow Builders public feed.</p>
      <div class="stats">
        <div class="stat"><strong>${Number(stats.xBuilders || x.length)}</strong><span>X builders</span></div>
        <div class="stat"><strong>${Number(stats.totalTweets || 0)}</strong><span>posts</span></div>
        <div class="stat"><strong>${Number(stats.podcastEpisodes || podcasts.length)}</strong><span>podcasts</span></div>
        <div class="stat"><strong>${Number(stats.blogPosts || blogs.length)}</strong><span>blogs</span></div>
      </div>
      <p class="source">${escapeHtml(attribution)}</p>
      <p class="meta"><span>Feed updated: ${escapeHtml(feedGeneratedAt)}</span><span>HTML generated: ${escapeHtml(generatedAt)}</span></p>
    </header>

    ${renderSection("X Builders", x.length, `<div class="grid">${x.map(renderBuilder).join("")}</div>`)}
    ${renderSection("Podcasts", podcasts.length, podcasts.map(renderPodcast).join(""))}
    ${renderSection("Official Blogs", blogs.length, blogs.map(renderBlog).join(""))}

    <footer>
      Content feed source: ${link("https://github.com/zarazhangrui/follow-builders", "Follow Builders")} public feed by Zara Zhang.
      This page only formats and renders the upstream public feed.
    </footer>
  </main>
</body>
</html>`;
}

async function fetchJson(name, url) {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ai-builders-html-brief",
      },
    });
    if (!res.ok) return { value: null, error: `${name}: HTTP ${res.status}` };
    return { value: await res.json(), error: null };
  } catch (error) {
    return { value: null, error: `${name}: ${error.message}` };
  }
}

export async function loadFeedPayload() {
  const [feedX, feedPodcasts, feedBlogs] = await Promise.all([
    fetchJson("x", FEEDS.x),
    fetchJson("podcasts", FEEDS.podcasts),
    fetchJson("blogs", FEEDS.blogs),
  ]);

  const errors = [feedX.error, feedPodcasts.error, feedBlogs.error].filter(Boolean);
  const x = feedX.value?.x || [];
  const podcasts = feedPodcasts.value?.podcasts || [];
  const blogs = feedBlogs.value?.blogs || [];

  return {
    generatedAt: new Date().toISOString(),
    sourceAttribution:
      "Content feed source: Follow Builders public feed by Zara Zhang. This HTML skill only formats and renders the feed.",
    upstreamFeeds: FEEDS,
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
}

export async function generateHtmlFile(outputPath = OUTPUT_PATH) {
  const payload = await loadFeedPayload();
  const html = buildHtmlDocument(payload);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
  return { outputPath, payload };
}

async function main() {
  const { outputPath, payload } = await generateHtmlFile();
  const relativePath = relative(SKILL_DIR, outputPath);
  const message = {
    status: "ok",
    outputPath,
    relativePath,
    stats: payload.stats,
    errors: payload.errors,
  };
  console.log(JSON.stringify(message, null, 2));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(JSON.stringify({ status: "error", message: error.message }));
    process.exit(1);
  });
}
