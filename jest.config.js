module.exports = {
  testRegex: '/tests/.*Test\\.js',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/expected/',
    '/tests/mocks'
  ],
  'testEnvironment': 'node'
};
