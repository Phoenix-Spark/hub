FROM node:latest
ENV NODE_ENV=production
RUN mkdir -p /server
WORKDIR /server
COPY  . /server
EXPOSE 3001
RUN npm ci
CMD ["npm", "run", "serve"]