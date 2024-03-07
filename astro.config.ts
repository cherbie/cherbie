import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import dotenv from "dotenv";
import path from "path";

const stageName = process.env.STAGE ?? "prd";

dotenv.config({
  path: path.resolve(`env/.env.${stageName}`),
});

const baseUrl = process.env.BASE_URL;
const serverPort = Number.parseInt(process.env.SERVER_PORT || "3000");

// https://astro.build/config
export default defineConfig({
  site: baseUrl,
  server: {
    port: serverPort,
  },
  // Enable Svelte to support Svelte components.
  integrations: [
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
    svelte(),
  ],
});
