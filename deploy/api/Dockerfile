ARG NODE_IMAGE
ARG API_INTERNAL_PORT

FROM ${NODE_IMAGE}

WORKDIR /opt/api/src

COPY ./src/package*.json ./

RUN npm install

COPY /src/ .

# Our Nginx container will forward HTTP traffic to containers of
# this image via the port defined here.
EXPOSE ${API_INTERNAL_PORT}

CMD ["node", "index.js"]
