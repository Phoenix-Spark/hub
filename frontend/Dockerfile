FROM node:latest as build
ENV REACT_APP_SERVER_ADDRESS=https://api.capstone.apps.jmidd.dev
RUN mkdir -p /app
WORKDIR /app
COPY . /app
EXPOSE 3000
RUN npm ci
RUN npm run build

FROM docker.io/nginx:1.25.1-alpine
EXPOSE 80
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html