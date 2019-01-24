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

  describe('update app file when creating a new command', () => {
    beforeAll(runTest({
      group: 'command',
      template: 'add-command',
      fixture: 'add-command',
      command: 'command new-command'
    }));
    iterateFiles('command', 'add-command', ({ filename, expected, generated }) => {
      it(`creates file '${filename}'`, () => {
        expect(generated(filename)).toBe(expected(filename));
      });
    });
  });

  describe('update app file when destroying a new command', () => {
    beforeAll(runTest({
      group: 'command',
      template: 'remove-command',
      fixture: 'remove-command',
      command: 'destroy command new-command'
    }));
    iterateFiles('command', 'remove-command', ({ filename, expected, generated }) => {
      it(`creates file '${filename}'`, () => {
        expect(generated(filename)).toBe(expected(filename));
      });
    });
  });

});
