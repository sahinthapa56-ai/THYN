const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const DIST = path.resolve(__dirname, "dist");

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// 1. Bundle popup
esbuild.buildSync({
  entryPoints: ["src/popup/popup.tsx"],
  bundle: true,
  format: "iife",
  target: "chrome109",
  outfile: path.join(DIST, "popup.bundle.js"),
  jsx: "automatic",
  loader: { ".tsx": "tsx", ".ts": "ts" },
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.VITE_API_URL": '"https://thyn-api.vercel.app"',
  },
});

// 2. Bundle sidepanel
esbuild.buildSync({
  entryPoints: ["src/sidepanel/sidepanel.tsx"],
  bundle: true,
  format: "iife",
  target: "chrome109",
  outfile: path.join(DIST, "sidepanel.bundle.js"),
  jsx: "automatic",
  loader: { ".tsx": "tsx", ".ts": "ts" },
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.VITE_API_URL": '"https://thyn-api.vercel.app"',
  },
});

// 3. Background & content scripts
esbuild.buildSync({
  entryPoints: ["src/background/background.ts"],
  bundle: true,
  format: "iife",
  target: "chrome109",
  outfile: path.join(DIST, "background.js"),
  loader: { ".ts": "ts" },
  define: { "process.env.NODE_ENV": '"production"' },
});

esbuild.buildSync({
  entryPoints: ["src/content/content.ts"],
  bundle: true,
  format: "iife",
  target: "chrome109",
  outfile: path.join(DIST, "content.js"),
  loader: { ".ts": "ts" },
  define: { "process.env.NODE_ENV": '"production"' },
});

// 4. Generate HTML files
var mkHtml = function(title, bundle) {
  return '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>' + title + '</title>\n    <link rel="stylesheet" href="/extension.css" />\n  </head>\n  <body>\n    <div id="root"></div>\n    <script src="/' + bundle + '"></script>\n  </body>\n</html>';
};

var distPopupHtml = path.join(DIST, "src", "popup");
var distSidepanelHtml = path.join(DIST, "src", "sidepanel");
fs.mkdirSync(distPopupHtml, { recursive: true });
fs.mkdirSync(distSidepanelHtml, { recursive: true });

fs.writeFileSync(path.join(distPopupHtml, "popup.html"), mkHtml("THYN", "popup.bundle.js"));
fs.writeFileSync(path.join(distSidepanelHtml, "sidepanel.html"), mkHtml("THYN", "sidepanel.bundle.js"));

// 5. Copy manifest, icons, CSS
fs.copyFileSync(path.join(__dirname, "manifest.json"), path.join(DIST, "manifest.json"));
fs.cpSync(path.join(__dirname, "public", "icons"), path.join(DIST, "icons"), { recursive: true });
fs.copyFileSync(path.join(__dirname, "src", "extension.css"), path.join(DIST, "extension.css"));

// 6. Verify
var files = fs.readdirSync(DIST, { recursive: true });
console.log("Built files:");
files
  .filter(function(f) { return fs.statSync(path.join(DIST, f)).isFile(); })
  .forEach(function(f) {
    var size = fs.statSync(path.join(DIST, f)).size;
    console.log("  " + f + " (" + (size / 1024).toFixed(1) + " KB)");
  });

console.log("\nBuild complete!");
