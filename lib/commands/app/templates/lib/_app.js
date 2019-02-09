const appPackage = require('../package.json');
const { createApp } = require('scaffold-kit');

const app = createApp({
  appName: '<%- productName %>',
  commandName: '<%- name %>',
  description: appPackage.description,
  version: appPackage.version,
  rcFile: '.<%- rcFileName %>.json',
  options: [
  ],
  commands: {
  }
});

module.exports = app;
