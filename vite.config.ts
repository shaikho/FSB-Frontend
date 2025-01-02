import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    target: "es2022",
  },
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
    },
  },
});
