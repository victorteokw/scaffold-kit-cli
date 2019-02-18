const path = require('path');
const { createCommand } = require('scaffold-kit/command');
const {
  useTemplatesFrom,
  iterateTemplateFilesFromDirectory,
  createFile,
  installDependency
} = require('scaffold-kit/executor');

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
