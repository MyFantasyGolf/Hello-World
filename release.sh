#!/bin/sh

cd server
npm install
cd ..
npm run build:heroku
