#!/bin/bash

echo "🚀 Simple build process..."

# Clean everything
echo "🧹 Cleaning..."
rm -rf node_modules package-lock.json yarn.lock
rm -f postcss.config.* tailwind.config.*

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build
echo "🔨 Building..."
npm run build

echo "✅ Build completed!" 