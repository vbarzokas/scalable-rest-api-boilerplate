#!/bin/bash

cd ./deploy
docker-compose down
docker-compose build
docker-compose up
