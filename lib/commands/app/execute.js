const path = require('path');
const humanize = require('humanize-string');
const camelCase = require('camelcase');
const kebabCase = require('lodash.kebabcase');
const lowerCase = require('lower-case');
const merge = require('lodash.merge');
const { assign } = Object;
const {
  useTemplatesFrom,
  createFile,
  updateJSONFile,
  installDependency,
  runShellCommand
} = require('scaffold-kit/execute');
const todoMessage = require('../../utils/todoMessage');
const getGitConfig = require('../../utils/getGitConfig');

module.exports = async ({ options, cwd }) => {

  // Get app name from the current working directory
  if (!options.name) options.name = path.basename(cwd);
  options.name = kebabCase(options.name);

  // At last, output some message to user:
  // Please edit package.json file manually.

  useTemplatesFrom(path.join(__dirname, 'templates'));

  // Create package.json file

  const packageContent = {};

  packageContent.name = options.name;
  if (options.private) packageContent.private = options.private;
  packageContent.version = options.version;
  packageContent.description = todoMessage('description');
  packageContent.homepage = todoMessage('homepage');
  packageContent.author = {
    name: await getGitConfig('user.name') || todoMessage('author name'),
    email: await getGitConfig('user.email') || todoMessage('author email')
  };
  packageContent.repository = todoMessage('repository');
  packageContent.license = todoMessage('license');
  packageContent.keywords = [];
  packageContent.bin = {
    [options.name]: `lib/${camelCase(options.name)}`
  };
  packageContent.files = ['lib'];
  packageContent.scripts = {
    'test': 'jest'
  };
  packageContent.dependencies = {};
  packageContent.devDependencies = {};

  updateJSONFile({
    at: 'package.json',
    updator: (original) => merge(packageContent, original)
  });

  // Copying templates

  createFile({
    at: 'README.md',
    context: options
  });

  createFile({
    at: '.eslintrc.json',
    context: options
  });

  createFile({
    from: '.git_ignore',
    at: '.gitignore'
  });

  if (!options.lockFile) {
    createFile({
      at: '.npmrc'
    });
  }

  createFile({
    at: 'lib/app.js',
    context: assign({}, options, {
      productName: humanize(options.name),
      rcFileName: lowerCase(camelCase(options.name))
    })
  });

  // Installing dependencies

  installDependency({
    package: 'scaffold-kit',
    version: 'latest'
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
