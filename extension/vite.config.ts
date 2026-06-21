import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "fix-extension-html",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          return html
            .replace(/ crossorigin/g, "")
            .replace(/<link rel="modulepreload"[^>]*>/g, "");
        },
      },
    },
  ],
  build: {
    outDir: "dist",
    cssCodeSplit: false,
    target: "chrome109",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/popup.html"),
        sidepanel: resolve(__dirname, "src/sidepanel/sidepanel.html"),
        background: resolve(__dirname, "src/background/background.ts"),
        content: resolve(__dirname, "src/content/content.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        manualChunks: undefined,
      },
    },
    minify: "esbuild",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
