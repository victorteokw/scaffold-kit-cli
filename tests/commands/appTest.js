const path = require('path');
const {
  setupTestCase,
  tearDownTest,
  runTestCase,
  iterateExpectedFiles
} = require('scaffold-kit-quality-testing');
const app = require('../../lib/app');

describe('app command: ', () => {
  describe('creates an app in given directory', () => {
    const handle = setupTestCase({
      app,
      expects: path.join(__dirname, '../expected/app/brand-new-app'),
      command: 'app brand-new-app'
    });
    beforeAll(runTestCase(handle));
    afterAll(tearDownTest(handle));
    iterateExpectedFiles(handle, ({ message, expected, generated }) => {
      it(message, () => {
        expect(generated).toBe(expected);
      });
    });
  });
});
