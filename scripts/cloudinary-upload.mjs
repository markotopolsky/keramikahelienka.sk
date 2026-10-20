// Uploads every photo in public/images to Cloudinary under keramikahelienka/<same path, no extension>,
// which is the public ID lib/cloudinary-loader.ts builds from a "/images/..." src.
// Existing assets are left as they are, so the script is safe to run again after adding photos.
// Usage: node --env-file=.env.local scripts/cloudinary-upload.mjs
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../public/images");
const PREFIX = "keramikahelienka";

const url = new URL(process.env.CLOUDINARY_URL ?? "");
if (url.protocol !== "cloudinary:") throw new Error("CLOUDINARY_URL is missing; run with --env-file=.env.local");
const apiKey = url.username;
const apiSecret = decodeURIComponent(url.password);
const cloudName = url.hostname;

async function photos(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? photos(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return nested.flat().filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
}

async function upload(file) {
  const publicId = `${PREFIX}/${path.relative(ROOT, file).replace(/\.\w+$/, "")}`;
  const params = { overwrite: "false", public_id: publicId, timestamp: String(Math.floor(Date.now() / 1000)) };
  const toSign = Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", apiKey);
  form.append("signature", createHash("sha1").update(toSign + apiSecret).digest("hex"));
  form.append("file", new Blob([await readFile(file)]), path.basename(file));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  const body = await res.json();
  if (!res.ok) throw new Error(`${publicId}: ${body.error?.message ?? res.status}`);
  return publicId;
}

const files = await photos(ROOT);
const failed = [];
let done = 0;
// Five uploads at a time keeps the run short without hitting the API rate limit
for (let i = 0; i < files.length; i += 5) {
  const results = await Promise.allSettled(files.slice(i, i + 5).map(upload));
  for (const r of results) r.status === "fulfilled" ? done++ : failed.push(r.reason.message);
  process.stdout.write(`\r${done}/${files.length}`);
}
console.log(failed.length ? `\nFailed:\n${failed.join("\n")}` : "\nAll uploaded.");
if (failed.length) process.exit(1);
