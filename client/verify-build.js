#!/usr/bin/env node

import fs from "fs";
import path from "path";

console.log("🔍 Verifying build environment...");

// Check for any PostCSS config files
const postcssFiles = [
  "postcss.config.cjs",
  "postcss.config.js",
  "postcss.config.mjs",
];

for (const file of postcssFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.error(`❌ Found PostCSS config: ${file}`);
    fs.unlinkSync(filePath);
    console.log(`✅ Removed: ${file}`);
  }
}

// Check for Tailwind config files
const tailwindFiles = [
  "tailwind.config.cjs",
  "tailwind.config.js",
  "tailwind.config.mjs",
];

for (const file of tailwindFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.error(`❌ Found Tailwind config: ${file}`);
    fs.unlinkSync(filePath);
    console.log(`✅ Removed: ${file}`);
  }
}

// Check package.json for Tailwind dependencies
const packagePath = path.join(process.cwd(), "package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const hasTailwind =
  packageJson.dependencies?.tailwindcss ||
  packageJson.devDependencies?.tailwindcss;

if (hasTailwind) {
  console.error("❌ Tailwind CSS still in package.json!");
  process.exit(1);
} else {
  console.log("✅ Package.json is clean");
}

console.log("🎉 Build environment verified!");
