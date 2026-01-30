# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies needed for building native modules (like sharp) and other tools
# Alpine might need python3, make, g++, etc. for some native modules. 
# Sharp usually provides prebuilts, but sometimes it's safer to have these.
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies to save space in the final image
RUN npm prune --production

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy built assets from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Create uploads directory as per application logic (../../uploads relative to dist/src/main)
RUN mkdir -p /usr/src/app/uploads

# Expose port (default 4200)
EXPOSE 4200

# Start command (run migrations then start app)
CMD ["sh", "-c", "npm run migration:prod && npm run start:prod"]
