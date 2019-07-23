import { applyMiddleware, Executable } from "scaffold-kit/lib/index";
import {
  defineOptions,
  redirectWorkingDirectory,
  displayHelp
} from "scaffold-kit/lib/middlewares";
import * as path from 'path';
import kebabCase from 'lodash.kebabcase';
import humanize from 'humanize-string';
import camelCase from 'camelcase';
import * as lowerCase from 'lower-case';
import todoMessage from '../utils/todoMessage';
import getGitConfig from '../utils/getGitConfig';

const app: Executable = async (ctx, next) => {
  const renderContext = Object.assign({}, ctx.options);
  // Get app name from the current working directory
  if (!renderContext.name) renderContext.name = path.basename(ctx.wd);
  renderContext.name = kebabCase(renderContext.name);
  // Setup other options
  renderContext.description = todoMessage('description');
  renderContext.homepage = todoMessage('homepage');
  renderContext.repository = todoMessage('repository');
  if (!renderContext.license) renderContext.license = todoMessage('license');
  renderContext.authorName = await getGitConfig('user.name') || todoMessage('author name');
  renderContext.authorEmail = await getGitConfig('user.email') || todoMessage('author email');
  renderContext.productName = humanize(renderContext.name as string);
  renderContext.rcFileName = lowerCase(camelCase(renderContext.name as string));
  renderContext.mainFileName = camelCase(renderContext.name as string);

  // Copying templates
  const templatesDir = path.join(__dirname, 'templates');
  ctx.useTemplateFrom(templatesDir, async () => {
    const dontCreate = {
      '.npmrc': !ctx.options.lockFile
    };
    const nameMap = {
      'lib/startup.js': `lib/${renderContext.mainFileName}.js`
    };
    iterateTemplateFilesFromDirectory(templatesDir, ({ templateName, filename }) => {
      if (!dontCreate[filename]) {
        ctx.createFile({
          from: templateName,
          at: nameMap[filename] || filename,
          context: renderContext
        });
      }
    });

    // Installing dependencies
    ctx.installDependency({
      package: 'scaffold-kit',
      version: 'latest'
    });

    ctx.installDependency({
      package: 'eslint',
      version: 'latest',
      dev: true
    });

    ctx.installDependency({
      package: `eslint-config-${ctx.options.eslintConfig}`,
      version: 'latest',
      dev: true
    });

    ctx.installDependency({
      package: 'eslint-plugin-jest',
      version: 'latest',
      dev: true
    });

    // Run user commands
    if (ctx.options.gitInit) {
      ctx.runShellCommand({
        command: 'git init',
        reverseCommand: 'rm -rf .git'
      });
    }
  });

  console.log('\nPlease edit package.json file manually.\n');
};

export default applyMiddleware(
  defineOptions({
    name: {
      type: 'string',
      desc: "the scaffold tool's name.",
      save: false
    },
    ver: {
      type: 'string',
      desc: 'the initial version of the newly created project.',
      default: '1.0.0',
      save: false
    },
    private: {
      type: 'boolean',
      desc: 'whether the newly created project is private.',
      default: false,
      save: false
    },
    license: {
      type: 'string',
      desc: 'the license of the newly created project.',
      default: 'MIT',
      save: false
    },
    eslintConfig: {
      type: 'string',
      desc: 'the eslint configuration to use.',
      default: 'man',
      save: false
    },
    lockFile: {
      type: 'boolean',
      desc: 'whether creating package lock file.',
      default: true,
      save: false
    },
    gitInit: {
      type: 'boolean',
      desc: 'run `git init` after generating the project.',
      default: false,
      save: false
    }
  }),
  redirectWorkingDirectory,
  displayHelp({
    desc: 'Create a new scaffold tool.',
    usage: 'scaffold-kit app path_to_dir [options...]'
  }),
  app
);
