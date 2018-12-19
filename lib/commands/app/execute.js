const path = require('path');
const glob = require('glob');
const humanize = require('humanize-string');
const camelCase = require('camelcase');
const kebabCase = require('lodash.kebabcase');
const lowerCase = require('lower-case');
const map = require('lodash.map');
const { assign } = Object;
const {
  useTemplatesFrom,
  createFile,
  installDependency,
  runShellCommand
} = require('scaffold-kit/executor');
const todoMessage = require('../../utils/todoMessage');
const getGitConfig = require('../../utils/getGitConfig');
const deunderbar = require('../../utils/deunderbar');

module.exports = async ({ options, wd }) => {

  const renderContext = assign({}, options);

  // Get app name from the current working directory
  if (!renderContext.name) renderContext.name = path.basename(wd);
  renderContext.name = kebabCase(renderContext.name);

  // Setup other options

  renderContext.todoMessage = todoMessage;
  renderContext.camelCase = camelCase;

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

  const templates = path.join(__dirname, 'templates');

  useTemplatesFrom(templates);

  // Copying templates

  const files = glob.sync(
    path.join(templates, '**/*'),
    { dot: true, nodir: true }
  );
  const dontCreate = {
    '.npmrc': !options.lockFile
  };
  const nameMap = {
    'lib/startup.js': `lib/${renderContext.rcFileName}.js`
  };
  map(files, (filename) => {
    const dest = deunderbar(path.relative(templates, filename));
    if (!dontCreate[dest]) {
      createFile({
        from: filename,
        at: nameMap[dest] || dest,
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
