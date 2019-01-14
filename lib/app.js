const path = require('path');
const appPackage = require('../package.json');
const { createApp } = require('scaffold-kit');

const app = createApp({
  appName: 'Scaffold Kit CLI',
  commandName: 'scaffold-kit',
  description: appPackage.description,
  version: appPackage.version,
  rcFile: '.scaffold.json',
  options: [],
  commands: {
    'app': path.join(__dirname, './commands/app'),
    'command': path.join(__dirname, './commands/command'),
    'destroy': path.join(__dirname, './commands/destroy'),
    'wrap-app': path.join(__dirname, './commands/wrapApp')
  }
});

module.exports = app;
