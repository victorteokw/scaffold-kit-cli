const path = require('path');
const { createCommand } = require('scaffold-kit/command');
const {
  useTemplatesFrom,
  iterateTemplateFilesFromDirectory,
  createFile,
  updateJSONFile,
  installDependency
} = require('scaffold-kit/executor');
const cloneDeep = require('lodash/cloneDeep');
const filter = require('lodash/filter');

module.exports = createCommand({
  description: 'TODO: update description here.',
  usage: 'TODO: update usage here.',
  executeInProjectRootDirectory: true,
  options: [
  ],
  execute: ({ options, args, wd }) => {
    const templates = path.join(__dirname, 'templates');
    useTemplatesFrom(templates);
    const dontCreateMap = {
      // File creation test map
      // '.gitignore': options.useGit
    };
    const nameMap = {
      // Remap filenames here
      // 'command.js': `${options.name}.${options.extension}`
    };
    iterateTemplateFilesFromDirectory(
      templates,
      ({ templateName, filename }) => {
        if (!dontCreateMap[filename]) {
          createFile({
            from: templateName,
            at: nameMap[filename] || filename,
            context: options
          });
        }
      }
    );

    updateJSONFile({
      at: '.eslintrc.json',
      updator: (original) => {
        const retval = cloneDeep(original);
        if (!retval.plugins) {
          retval.plugins = [];
        }
        retval.plugins.push('jest');
        if (!retval.env) {
          retval.env = {};
        }
        retval.env.jest = true;
        return retval;
      },
      rollbacker: (original) => {
        const retval = cloneDeep(original);
        if (Array.isArray(retval.plugins)) {
          retval.plugins = filter(retval.plugins, (v) => v !== 'jest');
          if (retval.plugins.length === 0) {
            delete retval.plugins;
          }
        }
        if (retval.env) {
          delete retval.env;
          if (Object.keys(retval.env).length === 0) {
            delete retval.plugins;
          }
        }
        return retval;
      }
    });

    installDependency({
      package: 'jest',
      version: 'latest',
      dev: true
    });

    installDependency({
      package: 'scaffold-kit-quality-testing',
      version: 'latest',
      dev: true
    });
  }
});
