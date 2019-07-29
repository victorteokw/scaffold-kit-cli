module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
  testRegex: '/tests/.*Test\\.ts',
  testPathIgnorePatterns: [
    '/node_modules',
    '/tests/expected',
    '/tests/fixtures'
  ],
  'testEnvironment': 'node'
};
