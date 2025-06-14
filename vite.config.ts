// vite.config.ts
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv, type UserConfig } from "vite";
import { splitVendorChunkPlugin } from "vite";

export default defineConfig(({ mode }) => {
  // load .env.* files if you need them
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    splitVendorChunkPlugin(),
    // only in prod:
    ...(mode === "production"
      ? [
          visualizer({
            open: true,
            filename: "dist/stats.html",
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ];

  const config: UserConfig = {
    root: process.cwd(),   // optional—Vite defaults here anyway
    base: "/",
    plugins,
    resolve: {
      alias: {
        // now @ points at /src
        "@": path.resolve(__dirname, "src"),
        // if you have a shared/ folder:
        "shared": path.resolve(__dirname, "shared"),
      },
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "date-fns",
        "lodash",
 
      ],
      // you can also force PDF.js ESM entry here:
      esbuildOptions: {
        // for example, to prevent CJS-only code
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      target: "esnext",
      minify: mode === "production",
      rollupOptions: {
        output: {
          chunkFileNames: mode === "production"
            ? "assets/[hash].js"
            : "assets/[name].js",
          entryFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
        },
      },
      sourcemap: mode === "development",
      chunkSizeWarningLimit: 1000,
    },
    server: {
      port: 3000,
      strictPort: true,
      hmr: { overlay: true },
    },
    css: {
      devSourcemap: true,
      modules: { localsConvention: "camelCase" },
    },
  };

  return config;
});
