FROM node:16

USER root
RUN apt-get update \
 && apt-get install coreutils -y

USER node
WORKDIR /work
COPY . . 
