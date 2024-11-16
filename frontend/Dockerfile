FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependenices
COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Copy Project files
EXPOSE 3000
CMD [ "npm", "start" ]