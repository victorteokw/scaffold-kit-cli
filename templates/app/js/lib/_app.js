const { applyMiddleware } = require('scaffold-kit');
<%- mainAppFileMiddlewareImport %>

const pkgJson = require('../package.json');
const hello = require('./commands/hello');

const application = applyMiddleware(
  useConfigFile('.<%- rcFileName %>'),
  defineOptions({
    help: {
      type: 'boolean',
      alias: 'h',
      desc: "View <%= displayName %>'s help.",
      default: false,
      save: false
    },
    version: {
      type: 'boolean',
      alias: 'v',
      desc: "View <%= ver %>'s version.",
      default: false,
      save: false
    }
  }),
  parseArgv,
  displayVersion(pkgJson.version),
  displayAppHelp({
    displayName: '<%= displayName %>',
    commandName: '<%= commandName %>',
    version: pkgJson.version,
    description: pkgJson.description
  }),
  acceptMockInstall,
  acceptOverwrite,
  acceptSilent,
<% if (prefixGenerate) { -%>
  prefixGenerate,
<% } -%>
<% if (useDestroy) { -%>
  prefixDestroy,
<% } -%>
  forwardCommand({ hello })
);

module.exports = application;
