'use strict';

const axios = require('axios').default;
const { spawnSync } = require( 'child_process' );
const fs = require('fs');
const { URL } = require('url');

axios.get('https://www.reddit.com/r/WidescreenWallpaper.json')
.then(response => {
  return response.data.data.children.map((child) => {
    return child.data.url_overridden_by_dest;
  })[0];
})
.then(imageUrl => {
  return axios({
    method: 'get',
    url: imageUrl,
    responseType: 'stream',
  });
})
.then(imageData => {
  const filename = new URL(imageData.config.url).pathname.split('/').slice(-1)[0];
  const wallpaperPath = `/home/${process.env.USER}/Pictures/Wallpapers/${filename}`;
  imageData.data.pipe(fs.createWriteStream(wallpaperPath));
  return wallpaperPath;
})
.then((wallpaperPath) => {
  spawnSync( 'gsettings', [ 'set', 'org.gnome.desktop.background', 'picture-uri', `file:///${wallpaperPath}` ] );
})
.catch(console.error);
