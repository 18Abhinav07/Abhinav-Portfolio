#!/usr/bin/env node
/**
 * Upload one or more images to Cloudinary and print markdown ready to paste.
 *
 *   node scripts/upload-image.mjs <folder> <file...>
 *
 * Example:
 *   node scripts/upload-image.mjs dispatches/broken-chart ~/shots/a.png ~/shots/b.png
 *
 * Why this exists: dispatch images must be absolute URLs, because dev.to renders
 * the same markdown on its own domain and cannot resolve a relative path. Hosting
 * them on Cloudinary means one URL works on the portfolio, on dev.to, and in the
 * OpenGraph card, and f_auto/q_auto handles format and compression per browser.
 *
 * Requires CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET in .env.
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const [, , folder, ...files] = process.argv;

if (!folder || files.length === 0) {
  console.error("usage: node scripts/upload-image.mjs <folder> <file...>");
  console.error("   eg: node scripts/upload-image.mjs dispatches/broken-chart shot.png");
  process.exit(1);
}

for (const key of ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]) {
  if (!process.env[key]) {
    console.error(`${key} is not set in .env`);
    process.exit(1);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error(`No such file(s):\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

const uploaded = [];

for (const file of files) {
  const name = path.basename(file, path.extname(file));
  process.stdout.write(`Uploading ${folder}/${name} ... `);
  const res = await cloudinary.uploader.upload(file, {
    folder: `portfolio/${folder}`,
    public_id: name,
    overwrite: true,
  });
  // f_auto/q_auto is applied at read time, so the stored original stays untouched.
  const url = res.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
  uploaded.push({ name, url, width: res.width, height: res.height });
  console.log(`done (${res.width}x${res.height})`);
}

console.log("\nMarkdown (replace the alt text, it is not optional):\n");
for (const { name, url } of uploaded) {
  console.log(`![TODO describe this image](${url})`);
  console.log(`*Caption for ${name}.*\n`);
}
