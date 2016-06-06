"use strict";

const request = require('request');

module.exports = new Promise((resolve, reject) => {
  let options = {
    'method': 'GET',
    'url': 'https://www.superplayer.fm/player',
    'qs': {'source': 'messenger'},
    'headers': {'cache-control': 'no-cache'}
  };

  request(options, (err, res) => {
    if (err)
      reject(err);

    if (res.statusCode != 200)
      reject(new Error(`Error: HTTP Status = ${res.statusCode}`));

    // (ㆆ_ㆆ
    resolve(res.headers['set-cookie'][1].split(';')[0].split('=')[1]);
  });
});
