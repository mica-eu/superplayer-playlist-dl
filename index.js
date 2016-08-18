#!/usr/bin/env node
"use strict";

const fs = require('fs');
const tokenRequest = require('./token-request.js');
const getPlaylist = require('./get-playlist.js');
const download = require('./download.js');
const getUrlParams = require('./get-url-params.js');

if (!process.argv[2]) {
  console.log('Você precisa informar a URL da playlist!');
  return;
}

const playlistsUrl = process.argv[2];
const playlistsKey = getUrlParams(playlistsUrl).info || getUrlParams(playlistsUrl).playing;
const songsDir = (process.env.USERPROFILE || process.env.HOME) + '/Music/';

if (!fs.existsSync(songsDir)) fs.mkdirSync(songsDir);

console.info('Inicializando...');
tokenRequest.then((token) => {
  let playlistsDir = `${songsDir}${playlistsKey}/`;

  getPlaylist(playlistsKey, token).then((tracks) => {
    if (tracks.length >= 0 && !fs.existsSync(playlistsDir)) fs.mkdirSync(playlistsDir);

    (function downloadAllTracks () {
      if (tracks.length == 0) {
        console.info('Fim!');
        return;
      }

      download(tracks[0], playlistsDir).then(function (msg) {
        tracks.shift();

        if (msg) {
          console.info(`${msg} \n`);
        } else {
          console.info(`Concluído, faltam ${tracks.length} faixas \n`);
        }

        downloadAllTracks();
      });
    }());

  });
});
