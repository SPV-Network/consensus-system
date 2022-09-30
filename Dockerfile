FROM node:16
ENV DEBIAN_FRONTEND noninteractive
ARG MONGO_URI
COPY . /app
WORKDIR /app
RUN apt-get update
RUN npm install
RUN echo "MONGO_URI=${MONGO_URI}" > .env
ENTRYPOINT [ "node" , "index.js"]
