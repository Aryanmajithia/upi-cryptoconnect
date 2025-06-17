FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Fix dependency issues
RUN node fix-dependencies.js

# Expose port
EXPOSE 1000

# Start the application
CMD ["npm", "start"] 