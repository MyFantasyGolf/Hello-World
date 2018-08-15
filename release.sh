#!/bin/sh

cd server
npm install
cd ..
npm run build:heroku
cp -r server/node_modules heroku/
