const fs = require('fs');
const path = require('path');
const tree = require('directory-tree');

const folder = path.join(__dirname, '../static/');
const assets = tree(folder, { extensions: /\.(obj|mtl|png|jpg)/ });
const names = assets.children.map((folder) => folder.name);

fs.writeFile(`${folder}assets.json`, JSON.stringify(names, null, 4), 'utf8', (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(names);
});
