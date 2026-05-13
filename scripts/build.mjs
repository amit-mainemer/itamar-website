import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const includeEntries = [
  "index.html",
  "en",
  "services",
  "about-itamar.html",
  "case-studies.html",
  "privacy-policy.html",
  "terms-of-use.html",
  "offpage-israel-playbook.md",
  "offpage-outreach-tracker.csv",
  "seo-audit-report.md",
  "seo-kpi-dashboard.md",
  "seo-experiment-log.csv",
  "webmaster-setup-checklist.md",
  "assets",
  "logo",
  "pictures",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "site.webmanifest",
  "_headers",
  "_redirects",
  "CNAME"
];

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const entryName of includeEntries) {
  const source = path.join(rootDir, entryName);
  try {
    await stat(source);
  } catch {
    continue;
  }

  const destination = path.join(distDir, entryName);
  await cp(source, destination, { recursive: true });
}

console.log("Build output generated in dist/");
