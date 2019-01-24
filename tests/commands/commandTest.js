const path = require('path');
const {
  setupTest,
  cleanUpTest,
  runTest,
  iterateFiles
} = require('scaffold-kit-quality-testing');
const app = require('../../lib/app');

beforeAll(
  setupTest(
    'command',
    app,
    path.join(__dirname, '../expected/command'),
    path.join(__dirname, '../fixtures/command')
  )
);

afterAll(cleanUpTest('command'));

describe('command command: ', () => {
  describe('creates an command inside given project', () => {
    beforeAll(runTest({
      group: 'command',
      template: 'simple-command',
      fixture: 'simple-command',
      command: 'command simple-command'
    }));
    iterateFiles('command', 'simple-command', ({ filename, expected, generated }) => {
      it(`creates file '${filename}'`, () => {
        expect(generated(filename)).toBe(expected(filename));
      });
    });
  });
});
