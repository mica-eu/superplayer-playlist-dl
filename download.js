"use strict";

const request = require('request');
const fs = require('fs');
const sanitize = require("sanitize-filename");

module.exports = (track, songsdir) => {
  let songName = `${track.artist} - ${track.name}`;
  let filePath = `${songsdir}${sanitize(songName)}.mp3`;

  console.info(`Baixando: ${songName}`);

  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      resolve('O arquivo já existe!');
      return;
    }

    let file = fs.createWriteStream(filePath);

    request(track.media).pipe(file);

    file.on('error', reject);
    file.on('finish', resolve);
  });
};
