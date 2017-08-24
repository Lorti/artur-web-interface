const path = require('path');

module.exports = function (source) {
  let value = JSON.parse(source);

  const name = path.basename(this.context);
  const folder = this.context.split('/static/').pop();

  value.name = name;
  value.obj = `static/${folder}/${name}.obj`;
  value.mtl = `static/${folder}/${name}.mtl`;
  value.map = `static/${folder}/${name}.png`;

  value = JSON.stringify(value)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `module.exports = ${value}`;
};
