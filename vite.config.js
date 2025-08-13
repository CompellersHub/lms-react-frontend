import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "vite-plugin-sitemap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: "https://titanscareers.com",
      exclude: ["/admin/*", "/portal/*"],
      outDir: "public",
      dynamicRoutes: [
        "/about",
        "/contact",
        "/story",
        "/partner",
        "/refund-policy",
        "/services",
        "/community",
        "/courses",
        "/courses/success",
        "/courses/:courseId",
        "/blog",
        "/blog/:slug",
        "/events",
        "/terms",
        "/privacy",
        "/checkout",
        "/order-confirmation",
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
