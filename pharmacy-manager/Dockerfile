FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache and speed up builds
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Expose the port for development server
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "start"]
