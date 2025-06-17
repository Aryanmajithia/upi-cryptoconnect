#!/usr/bin/env node

import fs from "fs";
import path from "path";

const gopdPath = path.join(process.cwd(), "node_modules", "gopd");
const gopdFile = path.join(gopdPath, "gOPD.js");

// Check if gopd module exists
if (fs.existsSync(path.join(gopdPath, "index.js"))) {
  console.log("Fixing gOPD module...");

  // Create the missing gOPD.js file with a simpler implementation
  const gopdContent = `'use strict';

// Simple implementation that doesn't depend on get-intrinsic
var $gOPD = Object.getOwnPropertyDescriptor;
if (typeof $gOPD !== 'function') {
    $gOPD = null;
}

module.exports = $gOPD;`;

  try {
    fs.writeFileSync(gopdFile, gopdContent);
    console.log("✅ gOPD module fixed successfully!");
  } catch (error) {
    console.error("❌ Failed to fix gOPD module:", error.message);
  }
} else {
  console.log("gOPD module not found, skipping fix.");
}

// Also fix the get-intrinsic issue
const getIntrinsicPath = path.join(
  process.cwd(),
  "node_modules",
  "get-intrinsic"
);
const getIntrinsicFile = path.join(getIntrinsicPath, "index.js");

if (fs.existsSync(getIntrinsicFile)) {
  console.log("Checking get-intrinsic module...");

  try {
    const content = fs.readFileSync(getIntrinsicFile, "utf8");
    if (content.includes("GetIntrinsic is not a function")) {
      console.log("get-intrinsic module appears to be corrupted, skipping...");
    }
  } catch (error) {
    console.log("get-intrinsic module check failed:", error.message);
  }
}
