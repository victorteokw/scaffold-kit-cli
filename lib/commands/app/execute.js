const path = require('path');
const humanize = require('humanize-string');
const camelCase = require('camelcase');
const kebabCase = require('lodash.kebabcase');
const lowerCase = require('lower-case');
const { assign } = Object;
const {
  useTemplatesFrom,
  createFile,
  installDependency,
  runShellCommand,
  iterateTemplateFilesFromDirectory
} = require('scaffold-kit/executor');
const todoMessage = require('../../utils/todoMessage');
const getGitConfig = require('../../utils/getGitConfig');

module.exports = async ({ options, wd }) => {

  const renderContext = assign({}, options);

  // Get app name from the current working directory
  if (!renderContext.name) renderContext.name = path.basename(wd);
  renderContext.name = kebabCase(renderContext.name);

  // Setup other options

  renderContext.todoMessage = todoMessage;

  renderContext.description = todoMessage('description');
  renderContext.homepage = todoMessage('homepage');
  renderContext.repository = todoMessage('repository');
  if (!renderContext.license) renderContext.license = todoMessage('license');
  renderContext.author = {
    name: await getGitConfig('user.name') || todoMessage('author name'),
    email: await getGitConfig('user.email') || todoMessage('author email')
  };
  renderContext.productName = humanize(renderContext.name);
  renderContext.rcFileName = lowerCase(camelCase(renderContext.name));
  renderContext.mainFileName = camelCase(renderContext.name);

  // Copying templates

  const templates = path.join(__dirname, 'templates');

  useTemplatesFrom(templates);

  const dontCreate = {
    '.npmrc': !options.lockFile
  };
  const nameMap = {
    'lib/startup.js': `lib/${renderContext.mainFileName}.js`
  };
  iterateTemplateFilesFromDirectory(templates, ({ templateName, filename }) => {
    if (!dontCreate[filename]) {
      createFile({
        from: templateName,
        at: nameMap[filename] || filename,
        context: renderContext
      });
    }
  });

  // Installing dependencies

  installDependency({
    package: 'scaffold-kit',
    version: 'latest'
  });

  installDependency({
    package: 'scaffold-kit-quality-testing',
    version: 'latest',
    dev: true
  });

  installDependency({
    package: 'eslint',
    version: 'latest',
    dev: true
  });

  installDependency({
    package: `eslint-config-${options.eslintConfig}`,
    version: 'latest',
    dev: true
  });

  installDependency({
    package: 'jest',
    version: 'latest',
    dev: true
  });

  installDependency({
    package: 'eslint-plugin-jest',
    version: 'latest',
    dev: true
  });

  // Run user commands

  if (options.gitInit) {
    runShellCommand({
      command: 'git init'
    });
  }
};
