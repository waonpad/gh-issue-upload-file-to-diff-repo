import { resolve } from "node:path";
import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import manifest from "./manifest.config";

export default defineConfig({
  // @see https://github.com/crxjs/chrome-extension-tools/issues/696
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        // see web_accessible_resources in the manifest config
        // welcome: join(__dirname, "src/app/welcome/welcome.html"),
      },
      output: {
        chunkFileNames: "assets/chunk-[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
    },
  },
  plugins: [crx({ manifest })],
});
