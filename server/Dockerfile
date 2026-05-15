FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --production

# Copy the rest of the server source
COPY . .

# Cloud Run requires port 8080
EXPOSE 8080
ENV PORT=8080

# Start the server
CMD ["node", "index.js"]
