"use strict";

const request = require('request');

module.exports = (key, token) => {
  console.info('Procurando playlist...');

  return new Promise((resolve, reject) => {
    let options = {
      'method': 'POST',
      'url': 'https://api.superplayer.fm/v1/play',
      'headers': {
        'cache-control': 'no-cache',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.63 Safari/537.36',
        'referer': 'https://www.superplayer.fm/player?source=messenger&playing=trap&language=pt-BR',
        'origin': 'https://www.superplayer.fm',
        'host': 'api.superplayer.fm',
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': '40',
        'connection': 'keep-alive',
        'authorization': `SUPER ${encodeURIComponent(token)}`,
        'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4',
        'accept-encoding': 'gzip, deflate, br',
        'accept': 'application/json, text/javascript, */*; q=0.01'
      },
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
