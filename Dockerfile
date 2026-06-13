FROM node:20-alpine

WORKDIR /usr/src/app

# Copy backend package manifests and install production dependencies
COPY server/package*.json ./
ENV NODE_ENV=production
RUN npm ci --production

# Copy only the backend source files
COPY server ./

EXPOSE 5000
CMD ["node", "index.js"]
