const url = require('url');

module.exports = (playlistUrl) => {
  let query = url.parse(playlistUrl).query.split('&');
  let obj = {};

  query.forEach(function (q) {
    obj[q.split('=')[0]] = q.split('=')[1];
  });

  return obj;
};
