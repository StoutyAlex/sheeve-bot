FROM node:12.16.3-alpine

RUN apk add --no-cache ffmpeg
RUN npm i node-gyp

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
