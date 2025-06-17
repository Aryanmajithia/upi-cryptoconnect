#!/usr/bin/env node

import fs from "fs";
import path from "path";

console.log("🔧 Fixing dependency issues...");

// Fix gOPD module
const gopdPath = path.join(process.cwd(), "node_modules", "gopd");
const gopdFile = path.join(gopdPath, "gOPD.js");

if (fs.existsSync(path.join(gopdPath, "index.js"))) {
  const gopdContent = `'use strict';
var $gOPD = Object.getOwnPropertyDescriptor;
if (typeof $gOPD !== 'function') {
    $gOPD = null;
}
module.exports = $gOPD;`;

  try {
    fs.writeFileSync(gopdFile, gopdContent);
    console.log("✅ gOPD module fixed");
  } catch (error) {
    console.log("❌ gOPD fix failed:", error.message);
  }
}

// Fix nested gOPD in get-intrinsic
const nestedGopdPath = path.join(
  process.cwd(),
  "node_modules",
  "get-intrinsic",
  "node_modules",
  "gopd"
);
const nestedGopdFile = path.join(nestedGopdPath, "gOPD.js");

if (fs.existsSync(path.join(nestedGopdPath, "index.js"))) {
  try {
    fs.writeFileSync(nestedGopdFile, gopdContent);
    console.log("✅ Nested gOPD module fixed");
  } catch (error) {
    console.log("❌ Nested gOPD fix failed:", error.message);
  }
}

console.log("🎉 Dependency fixes completed!");
