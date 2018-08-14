#!/bin/sh

cd server
npm run install
npm run build:heroku
cd ..
