import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import eslint from 'vite-plugin-eslint'
import { resolve } from 'path'
import eslintConfig from './.eslintrc.json'

// eslint-disable-next-line no-undef
const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [svgr(), react(), eslint({ overrideConfig: eslintConfig })],
  preview: {
    port: 5000,
    strictPort: true,
  },
  server: {
    port: 5000,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:5000",
  },
  resolve: {
    alias: {
      "@": resolve(projectRootDir, "src"),
    }
  }
})
