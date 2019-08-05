import { applyMiddleware, Executable } from "scaffold-kit/lib/index";
import {
  defineOptions,
  redirectWorkingDirectory,
  commandHelp,
  parseArgv,
  removeFirstArg
} from "scaffold-kit/lib/middlewares";
import {
  iterateTemplateFiles
} from "scaffold-kit/lib/utilities";
import * as path from 'path';
import { kebabCase, lowerCase } from 'lodash';
import humanize from 'humanize-string';
import camelCase from 'camelcase';
import todoMessage from '../utils/todoMessage';
import getGitConfig from '../utils/getGitConfig';
import tsImport from '../utils/tsImport';
import jsImport from '../utils/jsImport';

interface RenderContext {
  [key: string]: string | boolean | number
}

const app: Executable = async (ctx, next) => {

  if (ctx.helpMode) {
    await next(ctx);
    return;
  }

  // Configure render context

  const renderContext = Object.assign({}, ctx.options) as RenderContext;
  if (!renderContext.commandName) {
    renderContext.commandName = kebabCase(path.basename(ctx.wd));
  }
  if (!renderContext.displayName) {
    renderContext.displayName = humanize(path.basename(ctx.wd));
  }
  if (!renderContext.authorName) {
    renderContext.authorName = await getGitConfig('user.name') || todoMessage('author name');
  }
  if (!renderContext.authorEmail) {
    renderContext.authorEmail = await getGitConfig('user.email') || todoMessage('author email');
  }
  if (!renderContext.rcFileName) {
    renderContext.rcFileName = lowerCase(camelCase(renderContext.commandName as string));
  }
  if (!renderContext.mainFileName) {
    renderContext.mainFileName = camelCase(renderContext.commandName as string);
  }
  const importFunc = ctx.options.typeScript ? tsImport : jsImport;
  renderContext.mainAppFileMiddlewareImport = importFunc({
    acceptMockInstall: true,
    acceptOverwrite: true,
    acceptSilent: true,
    defineOptions: true,
    displayAppHelp: true,
    displayVersion: true,
    forwardCommand: true,
    parseArgv: true,
    useConfigFile: true,
    prefixGenerate: renderContext.prefixGenerate,
    prefixDestroy: renderContext.useDestroy
  }, 'scaffold-kit/lib/middlewares');

  // Copying templates

  const templatesDir = path.join(__dirname, `../../../templates/app/${ctx.options.typeScript ? 'ts' : 'js'}`);
  ctx.useTemplateFrom(templatesDir, async () => {
    const dontCreate = {
      '.npmrc': !ctx.options.lockFile
    };
    const nameMap = {
      'lib/startup.js': `lib/${renderContext.mainFileName}.js`,
      'src/startup.ts': `src/${renderContext.mainFileName}.ts`
    };

    iterateTemplateFiles(templatesDir, ({ templateName, filename }) => {
      if (!dontCreate[filename]) {
        ctx.createFile({
          from: templateName,
          at: nameMap[filename] || filename,
          context: renderContext
        });
      }
    });
  });

  // Installing dependencies

  ctx.installDependency({
    package: 'scaffold-kit',
    version: 'latest'
  });

  ctx.installDependency({
    package: 'scaffold-kit-quality-testing',
    version: 'latest',
    dev: true
  });

  ctx.installDependency({
    package: 'jest',
    version: 'latest',
    dev: true
  });

  if (ctx.options.typeScript) {
    ctx.installDependency({
      package: '@types/node',
      version: 'latest',
      dev: true
    });

    ctx.installDependency({
      package: '@types/jest',
      version: 'latest',
      dev: true
    });

    ctx.installDependency({
      package: 'typescript',
      version: 'latest',
      dev: true
    });

    ctx.installDependency({
      package: 'ts-jest',
      version: 'latest',
      dev: true
    });

    ctx.installDependency({
      package: 'tslint',
      version: 'latest',
      dev: true
    });

    ctx.installDependency({
      package: 'prettier',
      version: 'latest',
      dev: true
    });

    ctx.installDependency({
      package: 'tslint-config-prettier',
      version: 'latest',
      dev: true
    });
  } else {
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
  }

  // Run user commands

  if (ctx.options.gitInit) {
    ctx.runShellCommand({
      command: 'git init',
      reverseCommand: 'rm -rf .git'
    });
  }

  await next(ctx);

  console.log('\nPlease edit package.json file manually.\n');
};

export default applyMiddleware(
  commandHelp({
    appCommandName: 'scaffold-kit',
    commandName: 'app',
    usage: 'scaffold-kit app path_to_dir [options...]',
    description: 'Create a new scaffold tool.'
  }),
  defineOptions({
    commandName: {
      type: 'string',
      desc: "the scaffold tool's command name.",
      save: false
    },
    displayName: {
      type: 'string',
      desc: "the scaffold tool's product display name.",
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
      desc: 'the eslint configuration to use. Only used in JS mode.',
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
    },
    typeScript: {
      type: 'boolean',
      desc: 'whether initiate TypeScript project.',
      default: false,
      save: false
    },
    prefixGenerate: {
      type: 'boolean',
      desc: 'whether allow commands to be prefixed with generate.',
      default: true,
      save: false
    },
    useDestroy: {
      type: 'boolean',
      desc: 'automatically add destroy command to the scaffold tool.',
      default: true,
      save: false
    },
    rcFileName: {
      type: 'string',
      desc: "the .rc file's name.",
      default: undefined,
      save: false
    }
  }),
  parseArgv,
  removeFirstArg,
  redirectWorkingDirectory,
  app
);
