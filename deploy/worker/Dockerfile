ARG NODE_IMAGE

FROM ${NODE_IMAGE}

WORKDIR /opt/worker/src

COPY ./src/package*.json ./

RUN npm install

COPY /src/ .

CMD ["node", "index.js"]
