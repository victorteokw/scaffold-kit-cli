const path = require('path');
const {
  setupTestCase,
  tearDownTest,
  runTestCase,
  iterateExpectedFiles
} = require('scaffold-kit-quality-testing');
const app = require('../../lib/app');

describe('<%- commandName %> command: ', () => {

  describe('TODO: update your describing here', () => {
    const handle = setupTestCase({
      app,
      expects: path.join(__dirname, '../expected/<%- commandVarName %>/example'),
      fixtures: path.join(__dirname, '../fixtures/<%- commandVarName %>/example'),
      command: '<%- commandName %>'
    });
    beforeAll(runTestCase(handle));
    afterAll(tearDownTest(handle));
    iterateExpectedFiles(handle, ({ message, expected, generated }) => {
      it(message, () => {
        expect(generated()).toBe(expected);
      });
    });
  });

});
