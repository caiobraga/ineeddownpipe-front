/**
 * Rewrites public SEO files with VITE_SITE_URL at build time.
 * Usage: VITE_SITE_URL=https://www.yourdomain.com node scripts/generate-seo-files.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");
const siteUrl = (process.env.VITE_SITE_URL || "https://ineeddownpipe.com").replace(
  /\/$/,
  ""
);

const files = ["robots.txt", "sitemap.xml"];

for (const file of files) {
  const path = join(publicDir, file);
  const content = readFileSync(path, "utf-8").replaceAll(
    "https://ineeddownpipe.com",
    siteUrl
  );
  writeFileSync(path, content);
  console.log(`Updated ${file} → ${siteUrl}`);
}
