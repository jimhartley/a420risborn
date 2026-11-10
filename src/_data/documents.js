// Scans src/documents/ at build time and lists every file, grouped by sub-folder.
// To add a document, drop the file into the right folder. That's it.
// Optional: give a file a nicer title or a description in src/documents/meta.json:
//   { "build-manuals/seven-assembly-guide.pdf": { "title": "Seven assembly guide", "description": "Part 1" } }
import fs from "node:fs";
import path from "node:path";

const ROOT = "src/documents";

// Display order and names. A folder not listed here still shows up, after these.
const categories = [
  { slug: "build-manuals", name: "Build manuals", description: "Caterham assembly manuals." },
  { slug: "iva", name: "IVA", description: "IVA test guidance, checklists and paperwork." },
  { slug: "components", name: "Component manuals", description: "Engine, gearbox and other parts." },
  { slug: "post-iva", name: "Post-IVA fit-out", description: "VBOX data logger, cameras and other kit fitted after registration." },
  { slug: "other", name: "Other", description: "Anything else." },
];

const titleFromFile = (f) =>
  path.parse(f).name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());

const humanSize = (b) =>
  b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 ** 2).toFixed(1)} MB`;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith(".") || e.name === "meta.json") return [];
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

export default function () {
  const metaPath = path.join(ROOT, "meta.json");
  const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, "utf8")) : {};

  const files = walk(ROOT).map((full) => {
    const rel = path.relative(ROOT, full).split(path.sep).join("/");
    const folder = rel.includes("/") ? rel.split("/")[0] : "other";
    const m = meta[rel] || {};
    return {
      category: folder,
      title: m.title || titleFromFile(rel),
      description: m.description || "",
      url: "/documents/" + rel.split("/").map(encodeURIComponent).join("/"),
      type: path.extname(rel).slice(1).toUpperCase() || "FILE",
      size: humanSize(fs.statSync(full).size),
    };
  });

  const known = new Set(categories.map((c) => c.slug));
  const extra = [...new Set(files.map((f) => f.category))]
    .filter((s) => !known.has(s))
    .map((slug) => ({ slug, name: titleFromFile(slug), description: "" }));

  return [...categories, ...extra].map((c) => ({
    ...c,
    files: files.filter((f) => f.category === c.slug).sort((a, b) => a.title.localeCompare(b.title)),
  }));
}
