import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from "url";
import { defineConfig, loadEnv, type UserConfig } from "vite";
import { splitVendorChunkPlugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This function is used for conditional plugin loading
function getPlugins(mode: string) {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    splitVendorChunkPlugin(),
  ];

  // Only add visualizer in production mode
  if (mode === 'production') {
    plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return plugins;
}

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname);
  const env = loadEnv(mode, envDir, '');
  const plugins = getPlugins(mode);
  
  const config: UserConfig = {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
      },
    },
    root: path.resolve(__dirname, "client"),
    base: '/',
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@radix-ui/react-*',
        'date-fns',
        'lodash',
        'zod',
        'pdfjs-dist/build/pdf',
        'pdfjs-dist/build/pdf.worker.entry',
      ],
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-*', '@radix-ui/react-icons'],
            'utils-vendor': ['date-fns', 'lodash', 'zod'],
            'pdf-vendor': ['pdfjs-dist/build/pdf', 'pdfjs-dist/build/pdf.worker.entry'],
          },
          chunkFileNames: (chunkInfo) => {
            const hash = mode === 'production' 
              ? `[hash]`
              : `[name]`;
            return `assets/${hash}.js`;
          },
          entryFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
      sourcemap: mode === 'development',
      chunkSizeWarningLimit: 1000,
    },
    server: {
      port: 3000,
      strictPort: true,
      hmr: {
        overlay: true,
      },
    },
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCase',
      },
    },
  };

  return config;
});
