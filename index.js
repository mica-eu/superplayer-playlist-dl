#!/usr/bin/env node
"use strict";

const Superplayer = require('superplayer');
const fs = require('fs');
const download = require('./download.js');
const getUrlParams = require('./get-url-params.js');

if (!process.argv[2]) {
  console.log('Você precisa informar a URL da playlist!');
  return;
}

const playlistsUrl = process.argv[2];
const playlistsKey = getUrlParams(playlistsUrl).key || getUrlParams(playlistsUrl).playing;
const songsDir = (process.env.USERPROFILE || process.env.HOME) + '/Music/';
const playlistsDir = `${songsDir}${playlistsKey}/`;

if (!fs.existsSync(songsDir)) fs.mkdirSync(songsDir);

console.info('Inicializando...');
const superplayer = new Superplayer();

superplayer.play(playlistsKey)
  .then(tracks => {
    if (tracks.length >= 0 && !fs.existsSync(playlistsDir)) {
      fs.mkdirSync(playlistsDir);
    }

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
  })
  .catch(() => console.error('Playlist não encontrada!'));
