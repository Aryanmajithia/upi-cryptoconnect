#!/usr/bin/env node

import fs from "fs";
import path from "path";

console.log("🔍 Verifying build environment...");

// Check if postcss.config.cjs exists and is empty
const postcssPath = path.join(process.cwd(), "postcss.config.cjs");
if (fs.existsSync(postcssPath)) {
  const content = fs.readFileSync(postcssPath, "utf8");
  if (content.includes("tailwindcss")) {
    console.error("❌ PostCSS config still contains Tailwind CSS!");
    process.exit(1);
  } else {
    console.log("✅ PostCSS config is clean");
  }
} else {
  console.log("✅ No PostCSS config found");
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
