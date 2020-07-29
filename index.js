'use strict';

const axios = require('axios').default;
const { spawnSync } = require( 'child_process' );
const fs = require('fs');

async function setWallpaper() {
  // get top image
  const response = await axios.get('https://www.reddit.com/r/WidescreenWallpaper.json')
  const imageUrl = response.data.data.children.map((child) => {
    return child.data.url_overridden_by_dest;
  })[0];

  // write file
  axios({
    method: 'get',
    url: imageUrl,
    responseType: 'stream'
  })
    .then(function (response) {
      response.data.pipe(fs.createWriteStream('/tmp/wallpaper.jpg'))
    });
  // set wallpaper
  // gsettings set org.gnome.desktop.background picture-uri "file:///tmp/wallpaper.jpg"
  const ls = spawnSync( 'gsettings', [ 'set', 'org.gnome.desktop.background', 'picture-uri', 'file:///tmp/wallpaper.jpg' ] );
}

try {
  setWallpaper();
} catch(err) {
  console.error(err);
}
