FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependenices
COPY package*.json ./

RUN npm install

# Copy Project files
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]