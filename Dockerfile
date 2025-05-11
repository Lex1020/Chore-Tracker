FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Build client
RUN cd client && npm install && npm run build

# Expose ports
EXPOSE 5000

# Start server
CMD ["npm", "start"]
