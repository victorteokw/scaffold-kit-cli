const path = require('path');
const glob = require('glob');
const esprima = require('esprima');
const esquery = require('esquery');
const escodegen = require('escodegen');
const filter = require('lodash/filter');
const find = require('lodash/find');
const map = require('lodash/map');
const each = require('lodash/each');
const concat = require('lodash/concat');
const camelCase = require('lodash/camelCase');
const snakeCase = require('lodash/snakeCase');
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
    {
      name: 'ignoreDirs',
      type: String,
      description: 'directories to be ignored.',
      multiple: true,
      defaultValue: [],
      saveToPreference: false
    }
  ],
  execute: ({ options, args }) => {
    // Setup templates directory
    const defaultTemplates = path.join(__dirname, 'templates');
    useTemplatesFrom(defaultTemplates);
    let useDefaultTemplate;
    if (options.copyTemplates) {
      options.copyTemplates = path.resolve(options.copyTemplates);
      useDefaultTemplate = false;
      useTemplatesFrom(options.copyTemplates);
    } else {
      options.copyTemplates = defaultTemplates;
      useDefaultTemplate = true;
    }

    // Setup command name
    const commandName = args[0];
    const camelName = camelCase(commandName);
    const dasherizedName = snakeCase(commandName).replace('_', '-');
    // Update app.js
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
          return (p.key.name === dasherizedName)
            || (p.key.value === dasherizedName);
        });
        if (!defined) {
          commandsDef.value.properties.push({
            type: esprima.Syntax.Property,
            key: {
              type: esprima.Syntax.Literal,
              value: dasherizedName,
              raw: `'${dasherizedName}'`
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
                  value: `./commands/${camelName}`,
                  raw: `'./commands/${camelName}'`
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
          return (property.key.name !== dasherizedName) &&
            (property.key.value !== dasherizedName);
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
    // Create command file for destroy command
    if (commandName === 'destroy') {
      createFile({
        from: 'lib/commands/_destroy.js',
        at: `lib/commands/${camelName}/index.js`
      });
    // Create command file and templates for other commands
    } else {
      createFile({
        from: 'lib/commands/_command.js',
        at: `lib/commands/${camelName}/index.js`
      });
      if (useDefaultTemplate) {
        createFile({
          from: 'lib/commands/_sample.txt',
          at: `lib/commands/${camelName}/templates/_${camelName}.txt`
        });
      } else {
        const defaultIgnoredFiles = concat([
          'package-lock.json',
          '.DS_Store'
        ], options.ignoreFiles);
        const defaultIgnoredDirs = concat([
          '.git',
          'node_modules'
        ], options.ignoreDirs);
        const files = glob.sync(path.join(options.copyTemplates, '**/*'), {
          dot: true,
          nodir: true,
          ignore: [
            ...map(defaultIgnoredFiles,
              (f) => path.join(options.copyTemplates, f)),
            ...map(defaultIgnoredDirs,
              (d) => path.join(options.copyTemplates, d, '**/*'))
          ]
        });
        const relFilenames = map(files,
          (f) => path.relative(options.copyTemplates, f));
        const toTemplateName = (f) => {
          if (path.basename(f) === f) {
            return `_${f}`;
          } else {
            return path.join(
              path.dirname(f),
              '_' + path.basename(f)
            );
          }
        };
        each(relFilenames, (f) => {
          createFile({
            from: f,
            at: path.join(
              `lib/commands/${camelName}/templates/`,
              toTemplateName(f)
            )
          });
        });
      }
    }
  }
});
