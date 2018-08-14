#!/bin/sh

cd server
npm install
npm run build:heroku
cd ..
