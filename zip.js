// zips the build folder for archive
const zip = require('zip-a-folder');
const fs = require('fs');
var packageJson = require('./package.json');
require('dotenv').config();

/**
 * buildZip
 */
const buildZip = async () => {
  const args = process.argv.slice(2);
  const extensionType = args[0];
  let zipName = args[1];

  if (['chrome', 'firefox'].indexOf(extensionType) < 0) {
    console.log('Please select extension to zip: "chrome" or "firefox"');
    return;
  }

  const buildFolder = `./${process.env.WEBPACK_BUILDER_FOLDER}/${extensionType}`;

  fs.mkdirSync(`./${process.env.ZIP_FOLDER}`, { recursive: true, mode: 0o775 });
  if (zipName == undefined) {
    let now = new Date();
    zipName = `${extensionType}-v${packageJson.version}-${now.getFullYear()}${(
      '0' +
      (now.getMonth() + 1)
    ).slice(-2)}${('0' + now.getDate()).slice(-2)}`
  }
  await zip.zip(
    buildFolder,
    `./${process.env.ZIP_FOLDER}/${zipName}.zip`,
  );
};

module.export = buildZip();
