#!/bin/bash

cd ./deploy
docker-compose down
docker-compose build
docker-compose up -d

sleep 30

cd ../test
npm install
npm run test
