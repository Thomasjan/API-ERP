# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application files to the container
COPY . .

# Expose port 4000 to the outside world
EXPOSE 4000

# Run the app when the container launches
CMD ["npm", "run", "start"]