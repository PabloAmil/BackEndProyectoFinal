# Build stage
FROM node:21.6.2 AS build

# Set the working directory
WORKDIR /usr/src/app

# Install build essentials and dependencies
RUN apt-get update && apt-get install -y build-essential

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

# Production stage
FROM node:21.6.2

# Set the working directory
WORKDIR /usr/src/app

# Copy dependencies from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "app.js"]