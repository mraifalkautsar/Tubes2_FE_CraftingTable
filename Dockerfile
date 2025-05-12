# 1. Build your Vite site
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Serve the build
FROM node:18-alpine
WORKDIR /app
RUN npm install --global serve
COPY --from=build /app/dist ./dist
# Tell `serve` to listen on Railway’s $PORT
ENV PORT  $PORT
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:$PORT"]
