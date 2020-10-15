#!/bin/bash

cd ./deploy
docker-compose down
docker-compose build
WORKER_INTERVAL=2000 docker-compose up -d

sleep 30

cd ../test
npm install
npm run test
