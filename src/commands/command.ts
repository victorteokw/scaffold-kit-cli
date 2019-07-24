import { applyMiddleware, Executable } from "scaffold-kit/lib/index";
import {
  defineOptions,
  displayCommandHelp,
  seekingProjectRoot
} from "scaffold-kit/lib/middlewares";
import * as path from 'path';
import camelCase from 'camelcase';
import { snakeCase, find, filter, concat, map, each } from 'lodash';
import * as glob from 'glob';
const esprima = require('esprima');
const esquery = require('esquery');
const escodegen = require('escodegen');

const command: Executable = async (ctx, next) => {
  // Setup templates directory
  const defaultTemplates = path.join(__dirname, '../../templates/command');
  let useDefaultTemplate: boolean;
  if (ctx.options.copyTemplates) {
    ctx.options.copyTemplates = path.resolve(ctx.options.copyTemplates as string);
    useDefaultTemplate = false;
  } else {
    ctx.options.copyTemplates = defaultTemplates;
    useDefaultTemplate = true;
  }
  ctx.useTemplateFrom(ctx.options.copyTemplates, async () => {

    // Setup command name
    const commandName = ctx.args[0];
    const camelName = camelCase(commandName);
    const dasherizedName = snakeCase(commandName).replace('_', '-');

    // Update app.js
    ctx.updateFile({
      at: 'lib/app.js',
      updator: (content) => {
        let tree = esprima.parse(content, { range: true });
        let createAppCall = esquery(tree, '[init.callee.name=createApp]')[0];
        if (!createAppCall) throw new Error('File format destroyed.');
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
            if (!createAppCall) throw new Error('File format destroyed.');
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
            if (!createAppCall) throw new Error('File format destroyed.');
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
              ctx.createFile({
                from: 'lib/commands/_destroy.js',
                at: `lib/commands/${camelName}/index.js`
              });
              // Create command file and templates for other commands
            } else {
              ctx.createFile({
                from: 'lib/commands/_command.js',
                at: `lib/commands/${camelName}/index.js`
              });
              if (useDefaultTemplate) {
                ctx.createFile({
                  from: 'lib/commands/_sample.txt',
                  at: `lib/commands/${camelName}/templates/_${camelName}.txt`
                });
              } else {
                const defaultIgnoredFiles = concat([
                  'package-lock.json',
                  '.DS_Store'
                ], ctx.options.ignoreFiles as string[]);
                const defaultIgnoredDirs = concat([
                  '.git',
                  'node_modules'
                ], ctx.options.ignoreDirs as string[]);
                const files = glob.sync(path.join(ctx.options.copyTemplates as string, '**/*'), {
                  dot: true,
                  nodir: true,
                  ignore: [
                    ...map(defaultIgnoredFiles,
                      (f) => path.join(ctx.options.copyTemplates as string, f)),
                      ...map(defaultIgnoredDirs,
                        (d) => path.join(ctx.options.copyTemplates as string, d, '**/*'))
                      ]
                    });
                    const relFilenames = map(files,
                      (f) => path.relative(ctx.options.copyTemplates as string, f));
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
                          ctx.createFile({
                            from: f,
                            at: path.join(
                              `lib/commands/${camelName}/templates/`,
                              toTemplateName(f)
                              )
                            });
                          });
                        }
                      }
                    });
                  };

                  export default applyMiddleware(
                    defineOptions({
                      copyTemplates: {
                        type: 'string',
                        desc: 'the path at where to copy templates from.',
                        save: false
                      },
                      ignoreFiles: {
                        type: 'string[]',
                        desc: 'files to be ignored.',
                        default: [],
                        save: false
                      },
                      ignoreDirs: {
                        type: 'string[]',
                        desc: 'directories to be ignored.',
                        default: [],
                        save: false
                      }
                    }),
                    seekingProjectRoot('package.json'),
                    displayCommandHelp({
                      displayName: 'Scaffold Kit CLI',
                      commandName: 'scaffold-kit',
                      usage: 'scaffold-kit command command_name [options...]',
                      description: 'Create a command inside an existing scaffold tool.',
                      version: '1'
                    }),
                    command
                    );
