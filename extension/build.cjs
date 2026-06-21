const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const DIST = path.resolve(__dirname, "dist");

// Clean dist
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// ── 1. Bundle popup (React → single IIFE file, no modules) ──
esbuild.buildSync({
  entryPoints: ["src/popup/popup.tsx"],
  bundle: true,
  format: "iife",
  target: "chrome109",
  outfile: "dist/popup.bundle.js",
  jsx: "automatic",
  loader: { ".tsx": "tsx", ".ts": "ts" },
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.VITE_API_URL": '"https://thyn-api.vercel.app"',
  },
});

// ── 2. Bundle sidepanel (React → single IIFE file, no modules) ──
esbuild.buildSync({
  entryPoints: ["src/sidepanel/sidepanel.tsx"],
  bundle: true,
  format: "iife",
  target: "chrome109",
  outfile: "dist/sidepanel.bundle.js",
  jsx: "automatic",
  loader: { ".tsx": "tsx", ".ts": "ts" },
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.VITE_API_URL": '"https://thyn-api.vercel.app"',
  },
});

// ── 3. Copy background & content scripts (no modification needed) ──
esbuild.buildSync({
  entryPoints: ["src/background/background.ts"],
  bundle: true,
  format: "iife",
  target: "chrome109",
  outfile: "dist/background.js",
  loader: { ".ts": "ts" },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

esbuild.buildSync({
  entryPoints: ["src/content/content.ts"],
  bundle: true,
  format: "iife",
  target: "chrome109",
  outfile: "dist/content.js",
  loader: { ".ts": "ts" },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

// ── 4. Generate HTML files with non-module scripts ──
const html = (title, bundle) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/${bundle}"></script>
  </body>
</html>`;

fs.mkdirSync(path.join(DIST, "src", "popup"), { recursive: true });
fs.mkdirSync(path.join(DIST, "src", "sidepanel"), { recursive: true });

fs.writeFileSync(
  path.join(DIST, "src", "popup", "popup.html"),
  html("THYN", "popup.bundle.js")
);
fs.writeFileSync(
  path.join(DIST, "src", "sidepanel", "sidepanel.html"),
  html("THYN", "sidepanel.bundle.js")
);

// ── 5. Copy manifest and icons ──
fs.copyFileSync(
  path.join(__dirname, "manifest.json"),
  path.join(DIST, "manifest.json")
);
fs.cpSync(
  path.join(__dirname, "public", "icons"),
  path.join(DIST, "icons"),
  { recursive: true }
);

// ── 6. Verify ──
const files = fs.readdirSync(DIST, { recursive: true });
console.log("Built files:");
files
  .filter((f) => fs.statSync(path.join(DIST, f)).isFile())
  .forEach((f) => {
    const size = fs.statSync(path.join(DIST, f)).size;
    console.log(`  ${f} (${(size / 1024).toFixed(1)} KB)`);
  });

console.log("\n✓ Extension build complete!");
