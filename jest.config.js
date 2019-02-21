module.exports = {
  testRegex: '/tests/.*Test\\.js',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/expected',
    '/tests/fixtures',
    '/lib/commands/test/templates'
  ],
  'testEnvironment': 'node'
};
