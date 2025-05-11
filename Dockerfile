FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose ports
EXPOSE 5000

# Start server
CMD ["npm", "start"]
