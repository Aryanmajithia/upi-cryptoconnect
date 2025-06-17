#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("🧹 Force cleaning build environment...");

// Remove all possible config files
const filesToRemove = [
  "postcss.config.cjs",
  "postcss.config.js",
  "postcss.config.mjs",
  "tailwind.config.cjs",
  "tailwind.config.js",
  "tailwind.config.mjs",
  "package-lock.json",
  "yarn.lock",
];

for (const file of filesToRemove) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${file}`);
    } catch (error) {
      console.log(`⚠️  Could not remove: ${file}`);
    }
  }
}

// Remove node_modules if it exists
const nodeModulesPath = path.join(process.cwd(), "node_modules");
if (fs.existsSync(nodeModulesPath)) {
  try {
    execSync("rm -rf node_modules", { stdio: "inherit" });
    console.log("✅ Removed node_modules");
  } catch (error) {
    console.log("⚠️  Could not remove node_modules");
  }
}

console.log("🎉 Force clean completed!");
