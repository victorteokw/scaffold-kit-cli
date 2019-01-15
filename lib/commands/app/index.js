const path = require('path');
const { createCommand } = require('scaffold-kit/command');
const execute = require('./execute');

module.exports = createCommand({
  description: 'Create a new scaffold tool.',
  usage: 'scaffold-kit app path_to_dir [options...]',
  executeInProjectRootDirectory: false,
  options: [
    {
      name: 'ver',
      type: String,
      description: 'the version of the project.',
      defaultValue: '1.0.0',
      saveToPreference: false
    },
    {
      name: 'private',
      type: Boolean,
      description: 'whether the project is private.',
      defaultValue: false,
      saveToPreference: false
    },
    {
      name: 'eslintConfig',
      type: String,
      description: 'the eslint configuration to use.',
      defaultValue: 'man',
      saveToPreference: false
    },
    {
      name: 'lockFile',
      type: Boolean,
      description: 'whether create package lock file.',
      defaultValue: true,
      saveToPreference: false
    },
    {
      name: 'name',
      type: String,
      default: undefined,
      description: "the scaffold tool's name.",
      saveToPreference: false
    },
    {
      name: 'license',
      type: String,
      default: 'MIT',
      description: "the project's license.",
      saveToPreference: false
    },
    {
      name: 'gitInit',
      type: Boolean,
      description: 'run `git init` after generating the project.',
      defaultValue: false,
      saveToPreference: false
    }
  ],
  beforeExecution: (params) => {
    if (!params.args[0]) return params;
    return { wd: path.join(params.wd, params.args[0]) };
  },
  execute,
  afterExecution: () => {
    console.log('\nPlease edit package.json file manually.\n');
  }
});
