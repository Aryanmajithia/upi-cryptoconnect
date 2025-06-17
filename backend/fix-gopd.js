#!/usr/bin/env node

import fs from "fs";
import path from "path";

const gopdPath = path.join(process.cwd(), "node_modules", "gopd");
const gopdFile = path.join(gopdPath, "gOPD.js");

// Check if gopd module exists
if (fs.existsSync(path.join(gopdPath, "index.js"))) {
  console.log("Fixing gOPD module...");

  // Create the missing gOPD.js file
  const gopdContent = `'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
    try {
        $gOPD([], 'length');
    } catch (e) {
        // IE 8 has a broken gOPD
        $gOPD = null;
    }
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
