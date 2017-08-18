const fs = require('fs');
const tree = require('directory-tree');

const folder = 'static/';

const assets = tree(folder, {
  extensions: /\.(obj|mtl|png)/
});

const names = assets.children.map((folder) => {
  const name = folder.name;
  const path = folder.path;
  return {
    name,
    obj: `${path}/${name}.obj`,
    mtl: `${path}/${name}.mtl`,
    map: `${path}/${name}.png`,
    settings: JSON.parse(fs.readFileSync(`${path}/settings.json`, 'utf8')),
  };
});

const text = JSON.stringify(names, null, 4);

fs.writeFile(`${folder}assets.json`, text, 'utf8', (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(names);
});
