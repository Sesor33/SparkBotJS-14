FROM node:latest

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

RUN apt-get update
RUN apt-get install ffmpeg -y

COPY . /usr/src/bot

CMD ["node", "."]