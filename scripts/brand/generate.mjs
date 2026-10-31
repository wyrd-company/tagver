// Generates the tagver brand assets in docs/user/assets/ from the DESIGN.md tokens.
// The mark's path shape is drawn here; every colour, size, radius and position
// comes from DESIGN.md.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { parse } from "yaml";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = join(root, "docs/user/assets");
const require = createRequire(import.meta.url);

// --- Tokens -----------------------------------------------------------------

const design = readFileSync(join(root, "DESIGN.md"), "utf8");
const frontMatter = design.match(/^---\n([\s\S]*?)\n---\n/);
if (!frontMatter) throw new Error("DESIGN.md has no YAML front matter");
const tokens = parse(frontMatter[1]);

const lookup = (path) => {
  const value = path.split(".").reduce((node, key) => node?.[key], tokens);
  if (value === undefined) throw new Error(`DESIGN.md has no token ${path}`);
  return typeof value === "string" && /^\{.+\}$/.test(value) ? lookup(value.slice(1, -1)) : value;
};
const num = (path) => {
  const value = lookup(path);
  const n = typeof value === "number" ? value : Number.parseFloat(value);
  if (Number.isNaN(n)) throw new Error(`token ${path} is not a number: ${value}`);
  return n;
};
const color = (path) => lookup(path);
const font = (path) => lookup(path);
// letterSpacing in em becomes user units at the font's size.
const tracking = (path) => {
  const t = font(path);
  const ls = t.letterSpacing ?? "0em";
  return ls.endsWith("em") ? Number.parseFloat(ls) * Number.parseFloat(t.fontSize) : Number.parseFloat(ls);
};

const s = (name) => num(`spacing.${name}`);
const grid = s("grid");

// --- Mark -------------------------------------------------------------------

// The mark on a 1024 grid: a tag planted at the root of a commit line, with the
// calculated version as the last commit.
const mark = (ink, accent) => `<g transform="translate(-4 -24)">
    <g fill="none" stroke="${ink}" stroke-width="${s("stroke")}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M176 816V208H400L496 304L400 400H176"/>
      <path d="M176 816H848"/>
    </g>
    <g fill="${ink}">
      <circle cx="272" cy="304" r="${s("hole")}"/>
      <circle cx="176" cy="816" r="${s("dot-root")}"/>
      <circle cx="400" cy="816" r="${s("dot-commit")}"/>
      <circle cx="624" cy="816" r="${s("dot-commit")}"/>
    </g>
    <circle cx="848" cy="816" r="${s("dot-version")}" fill="${accent}"/>
  </g>`;

// The heavier mark for a tile. `solid` fills the tag and drops its hole, for
// tab-sized favicons.
const tileMark = (solid) => {
  const ink = color("colors.on-tile");
  return `<g transform="translate(-24 -32)">
    <g fill="none" stroke="${ink}" stroke-width="${s("stroke-tile")}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M256 768V256H480L576 368L480 480H256"${solid ? ` fill="${ink}"` : ""}/>
      <path d="M256 768H768"/>
    </g>${solid ? "" : `
    <circle cx="352" cy="368" r="${s("hole-tile")}" fill="${ink}"/>`}
    <circle cx="256" cy="768" r="${s("dot-root-tile")}" fill="${ink}"/>
    <circle cx="768" cy="768" r="${s("dot-version-tile")}" fill="${color("components.favicon-version.backgroundColor")}"/>
  </g>`;
};

// --- Assets -----------------------------------------------------------------

const title = `<title id="title">tagver</title>`;
const svg = (attrs, body) => `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>\n  ${body}\n</svg>\n`;

const logo = (suffix) =>
  svg(
    `viewBox="0 0 ${grid} ${grid}" role="img" aria-labelledby="title"`,
    `${title}\n  ${mark(color(`components.mark${suffix}.textColor`), color(`components.mark-version${suffix}.backgroundColor`))}`,
  );

const tile = (component, { solid, size } = {}) =>
  svg(
    `viewBox="0 0 ${grid} ${grid}"${size ? ` width="${size}" height="${size}"` : ""} role="img" aria-labelledby="title"`,
    `${title}\n  <rect width="${grid}" height="${grid}" rx="${num(`components.${component}.rounded`)}" fill="${color(`components.${component}.backgroundColor`)}"/>\n  ${tileMark(solid)}`,
  );

// The social artboard is the social-image size; larger canvases centre it.
const social = (component, suffix) => {
  const w = num(`components.${component}${suffix}.width`);
  const h = num(`components.${component}${suffix}.height`);
  const aw = num("components.social-image.width");
  const ah = num("components.social-image.height");
  const c = (name) => color(`components.${name}${suffix}.textColor`);
  const t = (name) => font(`typography.${name}`);
  const text = (name, attrs) =>
    `font-family="${t(name).fontFamily}, ${/Mono/.test(t(name).fontFamily) ? "monospace" : "sans-serif"}" font-size="${Number.parseFloat(t(name).fontSize)}" font-weight="${t(name).fontWeight}"${attrs ?? ""}`;
  const accent = c("social-example-version");
  const bar = `components.accent-bar${suffix}`;
  return svg(
    `viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"`,
    `<title>tagver: SemVer from your Git tags</title>
  <rect width="${w}" height="${h}" fill="${color(`components.${component}${suffix}.backgroundColor`)}"/>
  <g transform="translate(${(w - aw) / 2} ${(h - ah) / 2})">
    <svg x="${s("social-mark-x")}" y="${s("social-mark-y")}" width="${s("social-mark")}" height="${s("social-mark")}" viewBox="0 0 ${grid} ${grid}">
  ${mark(c("social-wordmark"), color(`components.mark-version${suffix}.backgroundColor`))}
    </svg>
    <text x="${s("social-text-x")}" y="${s("social-wordmark-baseline")}" ${text("wordmark", ` letter-spacing="${tracking("typography.wordmark")}"`)} fill="${c("social-wordmark")}">tagver</text>
    <rect x="${s("social-text-x") + s("social-accent-bar-inset")}" y="${s("social-accent-bar-y")}" width="${num(`${bar}.width`)}" height="${num(`${bar}.height`)}" rx="${num(`${bar}.height`) / 2}" fill="${color(`${bar}.backgroundColor`)}"/>
    <text x="${s("social-text-x")}" y="${s("social-tagline-baseline")}" ${text("tagline")} fill="${c("social-tagline")}">SemVer from your Git tags.</text>
    <text x="${s("social-text-x")}" y="${s("social-example-baseline")}" ${text("example")} fill="${c("social-example")}">1.0.0 +3 → <tspan font-weight="${t("example-version").fontWeight}" fill="${accent}">1.0.1-alpha.0.3</tspan></text>
  </g>`,
  );
};

const svgs = {
  "logo.svg": logo(""),
  "logo-dark.svg": logo("-dark"),
  "favicon.svg": tile("favicon", { solid: true }),
  "favicon-16.svg": tile("favicon-16", { solid: true, size: num("components.favicon-16.size") }),
  "social-image.svg": social("social-image", ""),
  "social-image-dark.svg": social("social-image", "-dark"),
  "social-preview.svg": social("social-preview", ""),
  "social-preview-dark.svg": social("social-preview", "-dark"),
};
for (const [name, body] of Object.entries(svgs)) writeFileSync(join(out, name), body);

// --- Rasters ----------------------------------------------------------------

const appleSize = num("components.apple-touch-icon.size");
const rasters = [
  ["social-image.png", svgs["social-image.svg"]],
  ["social-image-dark.png", svgs["social-image-dark.svg"]],
  ["social-preview.png", svgs["social-preview.svg"]],
  ["social-preview-dark.png", svgs["social-preview-dark.svg"]],
  ["apple-touch-icon.png", tile("apple-touch-icon", { solid: false }), appleSize],
  ["favicon-32.png", svgs["favicon.svg"], 32],
];
const icoSizes = [16, 32, 48];

const fontFace = (family, pkg, file) =>
  `@font-face{font-family:"${family}";src:url(${pathToFileURL(join(dirname(require.resolve(`${pkg}/package.json`)), "files", file))});font-weight:100 900}`;
const css = [
  fontFace("Geist", "@fontsource-variable/geist", "geist-latin-wght-normal.woff2"),
  fontFace("Geist Mono", "@fontsource-variable/geist-mono", "geist-mono-latin-wght-normal.woff2"),
  "html,body{margin:0;background:transparent}svg{display:block}",
].join("\n");

const sized = (body, w, h) =>
  body.replace(/<svg [^>]*>/, (tag) => tag.replace(/ (width|height)="[^"]*"/g, "").replace("<svg ", `<svg width="${w}" height="${h}" `));
const dimensions = (body) => body.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);

const work = mkdtempSync(join(tmpdir(), "tagver-brand-"));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const render = async (body, w, h) => {
    const file = join(work, "page.html");
    writeFileSync(file, `<!doctype html><style>${css}</style>${sized(body, w, h)}`);
    await page.setViewportSize({ width: w, height: h });
    await page.goto(pathToFileURL(file).href);
    await page.evaluate(() => document.fonts.ready);
    return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  };

  for (const [name, body, size] of rasters) {
    const [vw, vh] = dimensions(body);
    const [w, h] = size ? [size, size] : [vw, vh];
    writeFileSync(join(out, name), await render(body, w, h));
  }

  // favicon.ico: PNG entries (16 from favicon-16.svg, the rest from favicon.svg).
  const icons = [];
  for (const size of icoSizes) {
    icons.push({ size, png: await render(size === 16 ? svgs["favicon-16.svg"] : svgs["favicon.svg"], size, size) });
  }
  writeFileSync(join(out, "favicon.ico"), ico(icons));
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}

console.log(`wrote ${Object.keys(svgs).length + rasters.length + 1} assets to ${out}`);

function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}
