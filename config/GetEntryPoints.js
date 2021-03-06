const path = require('path');
const fs = require('fs');

// NOTE: THE WEBPACK CONFIG FILE AND THIS MODULE MUST LIVE IN THE SAME DIRECTORY

// Method to generate entry points for webpack for development enviroment (HMR) included

const appSourceDir = path.resolve(process.cwd(), 'src', 'client');
const reactModules = fs.readdirSync(appSourceDir)
  .filter(file => fs.statSync(path.join(appSourceDir, file)).isDirectory());
const webPackHotLibs = ['webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server'];

module.exports = function getEntryPoints(env) {
  const entry = {};
  const enviroment = env || (process.env.NODE_ENV ? process.env.NODE_ENV : 'development');
  const devLib = enviroment === 'production' ? [] : webPackHotLibs;

  const rootIndexPath = path.normalize(path.join(appSourceDir, 'index.jsx'));
  if (fs.existsSync(rootIndexPath)) {
    const entryArray = devLib.concat(rootIndexPath);
    entry.index = entryArray;
  }

  // One or more sub modules present
  reactModules.forEach((module) => {
    let indexPath;
    if (fs.existsSync(path.join(appSourceDir, module, 'index.jsx'))) {
      indexPath = path.normalize(path.join(appSourceDir, module, 'index.jsx'));
    } else {
      indexPath = path.normalize(path.join(appSourceDir, module, 'src', 'index.jsx'));
    }
    const entryArray = devLib.concat(indexPath);
    entry[module] = entryArray;
  });
  return entry;
};
