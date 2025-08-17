FROM node:21-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Use entrypoint
ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]
