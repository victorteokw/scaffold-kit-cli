const appPackage = require('../package.json');
const { createApp } = require('scaffold-kit');

const app = createApp({
  appName: 'Brand new app',
  commandName: 'brand-new-app',
  description: appPackage.description,
  version: appPackage.version,
  rcFile: '.brandnewapp.json',
  options: [
  ],
  commands: {
  }
});

module.exports = app;
