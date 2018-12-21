const path = require('path');
const esprima = require('esprima');
const esquery = require('esquery');
const escodegen = require('escodegen');
const filter = require('lodash/filter');
const find = require('lodash/find');
const { createCommand } = require('scaffold-kit/command');
const {
  useTemplatesFrom,
  createFile,
  updateFile
} = require('scaffold-kit/executor');

module.exports = createCommand({
  description: 'Create a command inside an existing scaffold tool.',
  usage: 'scaffold-kit command command_name [options...]',
  executeInProjectRootDirectory: true,
  options: [
  ],
  execute: ({ options, args }) => {
    useTemplatesFrom(path.join(__dirname, 'templates'));
    const commandName = args[0];
    updateFile({
      at: 'lib/app.js',
      updator: (content) => {
        let tree = esprima.parse(content, { range: true });
        let createAppCall = esquery(tree, '[init.callee.name=createApp]')[0];
        if (!createAppCall) throw 'File format destroyed.';
        let appDecl = createAppCall.init.arguments[0];
        let commandsDef = esquery(appDecl, '[key.name=commands]')[0];
        if (!commandsDef) {
          appDecl.properties.push({
            type: esprima.Syntax.Property,
            key: {
              type: esprima.Syntax.Identifier,
              name: 'commands'
            },
            value: {
              type: esprima.Syntax.ObjectExpression,
              properties: []
            }
          });
          const newAppDecl = escodegen.generate(
            appDecl,
            { format: { indent: { style: '  ' }}}
          );
          content = content.substring(0, appDecl.range[0])
            + newAppDecl
            + content.substring(appDecl.range[1]);
          tree = esprima.parse(content, { range: true });
          createAppCall = esquery(tree, '[init.callee.name=createApp]')[0];
          if (!createAppCall) throw 'File format destroyed.';
          appDecl = createAppCall.init.arguments[0];
          commandsDef = esquery(appDecl, '[key.name=commands]')[0];
        }
        const defined = find(commandsDef.value.properties, (p) => {
          return p.key.name === commandName;
        });
        if (!defined) {
          commandsDef.value.properties.push({
            type: esprima.Syntax.Property,
            key: {
              type: esprima.Syntax.Identifier,
              name: commandName
            },
            value: {
              type: esprima.Syntax.CallExpression,
              callee: {
                type: esprima.Syntax.MemberExpression,
                computed: false,
                object: { type: esprima.Syntax.Identifier, name: 'path' },
                property: { type: esprima.Syntax.Identifier, name: 'join' }
              },
              arguments: [
                { type: 'Identifier', name: '__dirname' },
                {
                  type: 'Literal',
                  value: `./commands/${commandName}`,
                  raw: `'./commands/${commandName}'`
                }
              ]
            }
          });
          let newCommandsDef = escodegen.generate(
            commandsDef,
            {
              format: {
                indent: { style: '  ' }
              }
            }
          );
          if (newCommandsDef.indexOf('\n') === -1) {
            newCommandsDef = newCommandsDef
              .replace(/{/, '{\n ')
              .replace(/ }/, '\n}');
          }
          newCommandsDef = newCommandsDef.replace(/\n/g, '\n  ');
          content = content.substring(0, commandsDef.range[0])
            + newCommandsDef
            + content.substring(commandsDef.range[1]);
        }
        tree = esprima.parse(content);
        if (!esquery(tree, '[declarations.0.id.name=path]')[0]) {
          content = "const path = require('path');\n" + content;
        }
        return content;
      },
      rollbacker: (content) => {
        let tree = esprima.parse(content, { range: true });
        const createAppCall = esquery(tree, '[init.callee.name=createApp]')[0];
        if (!createAppCall) throw 'File format destroyed.';
        const appDecl = createAppCall.init.arguments[0];
        const commandsDef = esquery(appDecl, '[key.name=commands]')[0];
        if (!commandsDef) return content;
        const { properties } = commandsDef.value;
        commandsDef.value.properties = filter(properties, (property) => {
          return property.key.name !== commandName;
        });
        if (commandsDef.value.properties.length > 0) {
          let newCommandsDef = escodegen.generate(
            commandsDef,
            {
              format: {
                indent: { style: '  ' }
              }
            }
          );
          if (newCommandsDef.indexOf('\n') === -1) {
            newCommandsDef = newCommandsDef
              .replace(/{/, '{\n ')
              .replace(/ }/, '\n}');
          }
          newCommandsDef = newCommandsDef.replace(/\n/g, '\n  ');
          content = content.substring(0, commandsDef.range[0])
            + newCommandsDef
            + content.substring(commandsDef.range[1]);
        } else {
          appDecl.properties = filter(appDecl.properties, (p) => {
            return p.key.name !== 'commands';
          });
          const newAppDecl = escodegen.generate(
            appDecl,
            { format: { indent: { style: '  ' }}}
          );
          content = content.substring(0, appDecl.range[0])
            + newAppDecl
            + content.substring(appDecl.range[1]);
          tree = esprima.parse(content, { range: true });
          if (!esquery(tree, '[callee.object.name=path]').length) {
            const pathDecl = esquery(tree, '[declarations.0.id.name=path]')[0];
            content = content.substring(0, pathDecl.range[0])
              + content.substring(pathDecl.range[1] + 1);
          }
        }

        return content;
      }
    });
    createFile({
      from: 'lib/commands/_command.js',
      at: `lib/commands/${commandName}/index.js`
    });
    createFile({
      from: 'lib/commands/_sample.txt',
      at: `lib/commands/${commandName}/templates/_${commandName}.txt`
    });
  }
});
