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
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies to save space in the final image
RUN npm prune --production

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install runtime dependencies for native modules if needed (e.g., sharp might need vips)
# Usually sharp prebuilds work, but if we encounter missing shared libs, we add them here.
# For now, minimal.

# Copy built assets from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Create uploads directory as per application logic (../../uploads relative to dist/src/main)
# If main is at dist/main.js, then ../.. is /usr/src
# In main.ts: join(__dirname, '../..', 'uploads')
# If run from /usr/src/app:
# dist/main.js -> __dirname = /usr/src/app/dist
# ../.. -> /usr/src
# So uploads should be at /usr/src/uploads presumably?
# Let's check main.ts logic again carefully:
# join(__dirname, '../..', 'uploads')
# If compiled to dist/src/main.js (common in NestJS monorepo or standard structure):
#   __dirname = /usr/src/app/dist/src
#   ../.. = /usr/src/app/dist
#   app.useStaticAssets(join(__dirname, '../..', 'uploads')) -> /usr/src/app/uploads would be ../../.. from dist/src
# Use standard NestJS build output:
# Usually dist/main.js.
# If so: dirname is /usr/src/app/dist.
# ../.. is /usr/src.
# So uploads is expected at /usr/src/uploads.
# The WORKDIR is /usr/src/app.
# So valid path: /usr/src/uploads.
# We'll create it just in case, though usually this is a volume mount.
RUN mkdir -p /usr/src/app/uploads

# Expose port (default 4200)
EXPOSE 4200

# Start command (run migrations then start app)
CMD ["sh", "-c", "npm run migration:run:prod && npm run start:prod"]
