#!/bin/sh

pushd heroku
MFG_MONGO_URI=mongodb://myfantasygolf:myfantasygolf1@ds221242.mlab.com:21242/myfantasygolf node app.js
