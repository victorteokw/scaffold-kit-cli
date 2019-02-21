const path = require('path');
const {
  setupTestCase,
  tearDownTest,
  runTestCase,
  iterateExpectedFiles
} = require('scaffold-kit-quality-testing');
const app = require('../../lib/app');

describe('command command: ', () => {

  describe('creates an command inside given project', () => {
    const handle = setupTestCase({
      app,
      expects: path.join(__dirname, '../expected/command/simple-command'),
      fixtures: path.join(__dirname, '../fixtures/command/simple-command'),
      command: 'command simple-command'
    });
    beforeAll(runTestCase(handle));
    afterAll(tearDownTest(handle));
    iterateExpectedFiles(handle, ({ message, expected, generated }) => {
      it(message, () => {
        expect(generated).toBe(expected);
      });
    });
  });

  describe('update app file when creating a new command', () => {
    const handle = setupTestCase({
      app,
      expects: path.join(__dirname, '../expected/command/add-command'),
      fixtures: path.join(__dirname, '../fixtures/command/add-command'),
      command: 'command new-command'
    });
    beforeAll(runTestCase(handle));
    afterAll(tearDownTest(handle));
    iterateExpectedFiles(handle, ({ message, expected, generated }) => {
      it(message, () => {
        expect(generated).toBe(expected);
      });
    });
  });

  describe('update app file when destroying a new command', () => {
    const handle = setupTestCase({
      app,
      expects: path.join(__dirname, '../expected/command/remove-command'),
      fixtures: path.join(__dirname, '../fixtures/command/remove-command'),
      command: 'destroy command new-command'
    });
    beforeAll(runTestCase(handle));
    afterAll(tearDownTest(handle));
    iterateExpectedFiles(handle, ({ message, expected, generated }) => {
      it(message, () => {
        expect(generated).toBe(expected);
      });
    });
  });

  describe('update app file when destroying the only left command', () => {
    const handle = setupTestCase({
      app,
      expects: path.join(__dirname, '../expected/command/remove-only-command'),
      fixtures: path.join(__dirname, '../fixtures/command/remove-only-command'),
      command: 'destroy command simple-command'
    });
    beforeAll(runTestCase(handle));
    afterAll(tearDownTest(handle));
    iterateExpectedFiles(handle, ({ message, expected, generated }) => {
      it(message, () => {
        expect(generated).toBe(expected);
      });
    });
  });

  describe('update app file when create the first command', () => {
    const handle = setupTestCase({
      app,
      expects: path.join(__dirname, '../expected/command/create-first-command'),
      fixtures:
        path.join(__dirname, '../fixtures/command/create-first-command'),
      command: 'command first-command'
    });
    beforeAll(runTestCase(handle));
    afterAll(tearDownTest(handle));
    iterateExpectedFiles(handle, ({ message, expected, generated }) => {
      it(message, () => {
        expect(generated).toBe(expected);
      });
    });
  });

  describe('copies from template', () => {
    const handle = setupTestCase({
      app,
      expects:
        path.join(__dirname, '../expected/command/command-from-template'),
      fixtures:
        path.join(__dirname, '../fixtures/command/command-from-template'),
      command: 'command from-template --copy-templates ./templates'
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
