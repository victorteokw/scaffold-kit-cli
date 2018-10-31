const execute = require('./execute');
const relocateProjDir = require('./relocateProjDir');
const { createCommand } = require('scaffold-kit');

module.exports = createCommand({
  description: 'Create an scaffold kit scaffold tool.',
  usage: 'scaffold-kit app path_to_dir [options...]',
  executeInProjectRootDirectory: false,
  commandLineOptions: {
    'name': {
      type: 'string',
      default: undefined,
      description: "the scaffold tool's name.",
      saveToPreference: false
    },
    'eslintConfig': {
      type: 'string',
      default: 'man',
      description: 'the eslint configuration to use.',
      saveToPreference: false
    },
    'lockFile': {
      type: 'boolean',
      default: false,
      description: 'whether create package lock file.',
      saveToPreference: false
    },
    'gitInit': {
      type: 'boolean',
      default: false,
      description: "whether running 'git init' after creating the project.",
      saveToPreference: false
    }
  },
  relocateProjDir,
  execute
});
