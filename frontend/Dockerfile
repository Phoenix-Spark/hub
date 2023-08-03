FROM node:latest
RUN mkdir -p /app
WORKDIR /app
COPY  . /app
EXPOSE 3000
RUN npm install
CMD ['npm', 'run', 'start']