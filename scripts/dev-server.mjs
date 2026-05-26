import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const basePath = "/itamar-website";
const port = Number(process.env.PORT || 5173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function getRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === basePath) {
    pathname = "/";
  } else if (pathname.startsWith(`${basePath}/`)) {
    pathname = pathname.slice(basePath.length);
  }

  return pathname;
}

async function resolveFilePath(pathname) {
  const safePath = path
    .normalize(pathname)
    .replace(/^(\.\.[/\\])+/, "")
    .replace(/^[/\\]+/, "");
  let filePath = path.join(rootDir, safePath);

  const fileStat = await stat(filePath).catch(() => null);
  if (fileStat?.isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  return filePath;
}

const server = createServer(async (req, res) => {
  try {
    const pathname = getRequestPath(req.url || "/");
    const filePath = await resolveFilePath(pathname);
    const fileStat = await stat(filePath).catch(() => null);

    if (!fileStat?.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 - File not found");
      return;
    }

    res.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(res);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(error instanceof Error ? error.message : "Internal server error");
  }
});

server.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}${basePath}/`);
});
