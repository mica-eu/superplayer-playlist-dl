"use strict";

const request = require('request');

module.exports = (key, token) => {
  console.info('Procurando playlist...');

  return new Promise((resolve, reject) => {
    let options = {
      'method': 'POST',
      'url': 'https://api.superplayer.fm/v1/play',
      'headers': {'authorization': `SUPER ${encodeURIComponent(token)}`},
      form: {'playlistskey[]': encodeURIComponent(key), source: 'messenger'}
    };

    request(options, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error('Error in token request.'));
        return;
      }

      let tracks = JSON.parse(body).tracks;

      if (!tracks) {
        reject("Nehuma faixa encontrada!")
        return;
      }

      // removendo propagandas da playlist
      tracks = tracks.filter((track) => {
        return track.type != 'spot';
      }).map((track) => {
        // url da media em alta qualidade - 192kbps
        track.media = track.media.replace('_64kbps', '');
        return track;
      });

      console.log(`${tracks.length} Faixas encontradas. \n`);
      resolve(tracks);
    });
  });
};
