#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Tailwind CSS is installed
if ! npm list tailwindcss > /dev/null 2>&1; then
    echo "⚠️  Tailwind CSS not found, installing..."
    npm install tailwindcss@^3.3.6 autoprefixer@^10.4.16 postcss@^8.4.32
fi

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build completed!" 