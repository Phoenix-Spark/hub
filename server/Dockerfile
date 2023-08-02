FROM node:latest
RUN mkdir -p /server
WORKDIR /server
COPY  . /server
EXPOSE 80
RUN npm install
CMD npm run migrate_seed_start