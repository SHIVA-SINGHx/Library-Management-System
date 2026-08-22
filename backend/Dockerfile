FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set default production environment
ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "server.js"]