FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:18-alpine
WORKDIR /app


RUN npm install -g serve


COPY --from=build /app/dist ./dist

ARG PORT=8080
ENV PORT $PORT


EXPOSE $PORT
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:${PORT}"]
