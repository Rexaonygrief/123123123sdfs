const fs = require('node:fs');
const path = require('node:path');

const assetDir = path.join(__dirname, '..', 'assets');
const source = path.join(assetDir, 'rezonevpn.ico.base64');
const target = path.join(assetDir, 'rezonevpn.ico');
const encoded = fs.readFileSync(source, 'utf8').replace(/\s+/g, '');
const icon = Buffer.from(encoded, 'base64');
if (icon.length < 6 || icon.readUInt16LE(0) !== 0 || icon.readUInt16LE(2) !== 1) {
  throw new Error('Invalid RezoneVPN ICO data');
}
fs.writeFileSync(target, icon);
console.log(`Restored ${path.basename(target)} (${icon.length} bytes)`);
