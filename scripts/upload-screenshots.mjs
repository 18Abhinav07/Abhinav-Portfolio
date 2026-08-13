import { v2 as cloudinary } from "cloudinary";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT = path.join(__dirname, "..", "..", "Project Screenshots");

const targets = [
  { localDir: path.join(ROOT, "Pods"), cloudFolder: "portfolio/projects/pods" },
];

const results = {};

for (const { localDir, cloudFolder } of targets) {
  const files = readdirSync(localDir).filter((f) => f.toLowerCase().endsWith(".png"));
  results[cloudFolder] = {};
  for (const file of files) {
    const name = path.basename(file, path.extname(file));
    const filePath = path.join(localDir, file);
    process.stdout.write(`Uploading ${cloudFolder}/${name}... `);
    const res = await cloudinary.uploader.upload(filePath, {
      folder: cloudFolder,
      public_id: name,
      overwrite: true,
    });
    results[cloudFolder][name] = res.secure_url;
    console.log("done");
  }
}

console.log("\n=== RESULTS ===");
console.log(JSON.stringify(results, null, 2));
