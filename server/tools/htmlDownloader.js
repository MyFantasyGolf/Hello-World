const path = require('path');
const request = require('request');
const fs = require('fs');

const sitename = process.argv[2];
const site = process.argv[3];

request(site).pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'test', 'files', sitename)));
