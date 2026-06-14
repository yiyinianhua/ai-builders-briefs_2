import test from "node:test";
import assert from "node:assert/strict";

import { buildHtmlDocument } from "./generate-html.js";

test("buildHtmlDocument renders feed sections and attribution", () => {
  const html = buildHtmlDocument({
    generatedAt: "2026-06-14T12:00:00.000Z",
    sourceAttribution:
      "Content feed source: Follow Builders public feed by Zara Zhang.",
    x: [
      {
        name: "Example Builder",
        handle: "example",
        tweets: [
          {
            text: "Agents are becoming product surfaces.",
            url: "https://x.com/example/status/1",
            likes: 10,
            replies: 2,
            createdAt: "2026-06-14T08:00:00.000Z",
          },
        ],
      },
    ],
    podcasts: [
      {
        name: "Example Podcast",
        title: "Building with agents",
        url: "https://example.com/podcast",
        transcript: "A long discussion about agent workflows.",
        publishedAt: "2026-06-13T08:00:00.000Z",
      },
    ],
    blogs: [
      {
        name: "Example Blog",
        title: "Agent UI patterns",
        url: "https://example.com/blog",
        content: "Useful observations about interface design.",
        publishedAt: "2026-06-12T08:00:00.000Z",
      },
    ],
    stats: {
      xBuilders: 1,
      totalTweets: 1,
      podcastEpisodes: 1,
      blogPosts: 1,
    },
  });

  assert.match(html, /<!doctype html>/i);
  assert.match(html, /Example Builder/);
  assert.match(html, /Example Podcast/);
  assert.match(html, /Example Blog/);
  assert.match(html, /Follow Builders public feed by Zara Zhang/);
});

test("buildHtmlDocument escapes untrusted feed text", () => {
  const html = buildHtmlDocument({
    generatedAt: "2026-06-14T12:00:00.000Z",
    sourceAttribution: "source",
    x: [
      {
        name: "<script>alert(1)</script>",
        handle: "evil",
        tweets: [
          {
            text: "Use <b>agents</b> & review outputs",
            url: "https://x.com/evil/status/1",
            likes: 0,
            replies: 0,
          },
        ],
      },
    ],
    podcasts: [],
    blogs: [],
    stats: {},
  });

  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /Use &lt;b&gt;agents&lt;\/b&gt; &amp; review outputs/);
});
