import path from "node:path";
import Image from "@11ty/eleventy-img";
import stages from "./src/_data/stages.js";

const stageSlugs = new Set(stages.map((s) => s.slug));

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addWatchTarget("src/assets/");

  // Documents are copied as-is, never processed as pages; adding one rebuilds the list.
  eleventyConfig.addPassthroughCopy("src/documents", { filter: (p) => !p.endsWith(".gitkeep") && !p.endsWith("meta.json") });
  eleventyConfig.ignores.add("src/documents/**");
  eleventyConfig.addWatchTarget("src/documents/");

  // All build-log entries, oldest first. Fails the build if a post names an unknown stage.
  eleventyConfig.addCollection("posts", (api) => {
    const posts = api.getFilteredByGlob("src/posts/*.md").sort((a, b) => a.date - b.date);
    for (const p of posts) {
      const stage = p.data.stage;
      if (!stageSlugs.has(stage)) {
        throw new Error(
          `${p.inputPath}: stage "${stage}" is not defined in src/_data/stages.js ` +
            `(valid: ${[...stageSlugs].join(", ")})`
        );
      }
    }
    return posts;
  });

  eleventyConfig.addFilter("byStage", (posts = [], slug) => posts.filter((p) => p.data.stage === slug));
  eleventyConfig.addFilter("sumCost", (posts = []) =>
    posts.reduce((t, p) => t + (Number(p.data.cost) || 0), 0)
  );
  eleventyConfig.addFilter("stageBySlug", (slug) => stages.find((s) => s.slug === slug));
  eleventyConfig.addFilter("latest", (arr = [], n = 5) => [...arr].reverse().slice(0, n));
  eleventyConfig.addFilter("readableDate", (d) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d)
  );
  eleventyConfig.addFilter("isoDate", (d) => d.toISOString().slice(0, 10));
  eleventyConfig.addFilter("money", (n) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n)
  );

  async function picture(src, alt, { sizes, eager = false } = {}) {
    if (alt === undefined) throw new Error(`Missing alt text for image ${src}`);
    const metadata = await Image(path.join("src", src), {
      widths: [400, 800, 1600],
      formats: ["webp", "jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
    });
    return Image.generateHTML(metadata, {
      alt,
      sizes,
      loading: eager ? "eager" : "lazy",
      decoding: "async",
      ...(eager ? { fetchpriority: "high" } : {}),
    });
  }

  // {% image "images/foo.jpg", "Alt text", "Optional caption" %} — paths are relative to src/
  eleventyConfig.addShortcode("image", async function (src, alt, caption) {
    const html = await picture(src, alt, { sizes: "(min-width: 760px) 720px, 100vw" });
    return caption ? `<figure>${html}<figcaption>${caption}</figcaption></figure>` : `<figure>${html}</figure>`;
  });

  // Full-width banner image at the top of a page.
  eleventyConfig.addShortcode("hero", async function (src, alt) {
    const html = await picture(src, alt, { sizes: "(min-width: 1000px) 960px, 100vw", eager: true });
    return `<div class="hero-image">${html}</div>`;
  });

  // Thumbnail grid. Each item links to the full-size JPEG.
  eleventyConfig.addPairedShortcode("gallery", (content) => `<div class="gallery">${content}</div>`);
  eleventyConfig.addShortcode("thumb", async function (src, alt, caption) {
    const html = await picture(src, alt, { sizes: "(min-width: 760px) 240px, 50vw" });
    const full = (await Image(path.join("src", src), {
      widths: [1600], formats: ["jpeg"], outputDir: "_site/img/", urlPath: "/img/",
    })).jpeg[0].url;
    return `<figure><a href="${full}">${html}</a>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
