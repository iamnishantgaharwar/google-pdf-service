# Use the official Playwright image which comes with browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.49.1-noble

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright dependencies
RUN npx playwright install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]