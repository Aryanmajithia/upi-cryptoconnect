#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${GREEN}Setting up UPI CryptoConnect...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "${YELLOW}Node.js is not installed. Please install Node.js >= 18.0.0${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ $NODE_MAJOR_VERSION -lt 18 ]; then
    echo "${YELLOW}Node.js version must be >= 18.0.0. Current version: $NODE_VERSION${NC}"
    exit 1
fi

# Setup backend
echo "${GREEN}Setting up backend...${NC}"
cd backend

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "${YELLOW}Created .env file. Please update it with your configuration.${NC}"
fi

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Setup frontend
echo "${GREEN}Setting up frontend...${NC}"
cd ../client

# Create frontend .env if it doesn't exist
if [ ! -f .env ]; then
    echo "VITE_BACKEND_URL=http://localhost:6900" > .env
    echo "${YELLOW}Created frontend .env file.${NC}"
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

cd ..

echo "${GREEN}Setup complete!${NC}"
echo ""
echo "${YELLOW}Next steps:${NC}"
echo "1. Update backend/.env with your configuration"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd client && npm run dev"