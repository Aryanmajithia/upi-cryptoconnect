FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Fix gOPD module issue
RUN node fix-gopd.js

# Expose port
EXPOSE 1000

# Start the application
CMD ["npm", "start"] 