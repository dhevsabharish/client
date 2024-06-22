# Use an official Node runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Serve the app on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]