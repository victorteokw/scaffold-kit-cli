const execute = require('./execute');
const relocateProjDir = require('./relocateProjDir');
const { createCommand } = require('scaffold-kit');

module.exports = createCommand({
  description: 'Create an scaffold kit scaffold tool.',
  usage: 'scaffold-kit app path_to_dir [options...]',
  executeInProjectRootDirectory: false,
  options: [
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
      name: 'gitInit',
      type: Boolean,
      description: 'run `git init` after generating the project.',
      defaultValue: false,
      saveToPreference: false
    }
  ],
  relocateProjDir,
  execute
});
