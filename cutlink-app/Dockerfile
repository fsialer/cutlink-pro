# Build stage
FROM node:22-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the application
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:stable-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from build stage to nginx html directory
# Adjust 'dist/cutlink-app' to match your actual build output directory
COPY --from=build /app/dist/cutlink-app/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
