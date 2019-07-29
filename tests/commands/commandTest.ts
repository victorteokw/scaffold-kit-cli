import * as path from 'path';
import { TestHandler } from 'scaffold-kit-quality-testing';
import app from '../../src/app';

describe('command command: ', () => {

  describe('creates an command inside given project', () => {
    const handler = new TestHandler(
      app,
      'command simple-command',
      path.join(__dirname, '../expected/command/simple-command'),
      path.join(__dirname, '../fixtures/command/simple-command')
    );

    beforeAll(handler.execute);

    afterAll(handler.destroy);

    handler.iterateFiles(({ message, expected, generated }) => {
      it(message, () => {
        expect(generated()).toBe(expected);
      });
    });
  });

  describe('update app file when creating a new command', () => {
    const handler = new TestHandler(
      app,
      'command new-command',
      path.join(__dirname, '../expected/command/add-command'),
      path.join(__dirname, '../fixtures/command/add-command')
    );

    beforeAll(handler.execute);

    afterAll(handler.destroy);

    handler.iterateFiles(({ message, expected, generated }) => {
      it(message, () => {
        expect(generated()).toBe(expected);
      });
    });
  });

  describe('update app file when destroying a new command', () => {
    const handler = new TestHandler(
      app,
      'destroy command new-command',
      path.join(__dirname, '../expected/command/remove-command'),
      path.join(__dirname, '../fixtures/command/remove-command')
    );

    beforeAll(handler.execute);

    afterAll(handler.destroy);

    handler.iterateFiles(({ message, expected, generated }) => {
      it(message, () => {
        expect(generated()).toBe(expected);
      });
    });
  });

  describe('update app file when destroying the only left command', () => {
    const handler = new TestHandler(
      app,
      'destroy command simple-command',
      path.join(__dirname, '../expected/command/remove-only-command'),
      path.join(__dirname, '../fixtures/command/remove-only-command')
    );

    beforeAll(handler.execute);

    afterAll(handler.destroy);

    handler.iterateFiles(({ message, expected, generated }) => {
      it(message, () => {
        expect(generated()).toBe(expected);
      });
    });
  });

  describe('update app file when create the first command', () => {
    const handler = new TestHandler(
      app,
      'command first-command',
      path.join(__dirname, '../expected/command/create-first-command'),
      path.join(__dirname, '../fixtures/command/create-first-command')
    );

    beforeAll(handler.execute);

    afterAll(handler.destroy);

    handler.iterateFiles(({ message, expected, generated }) => {
      it(message, () => {
        expect(generated()).toBe(expected);
      });
    });
  });

  describe('copies from template', () => {
    const handler = new TestHandler(
      app,
      'command from-template --copy-templates ./templates',
      path.join(__dirname, '../expected/command/command-from-template'),
      path.join(__dirname, '../fixtures/command/command-from-template')
    );

    beforeAll(handler.execute);

    afterAll(handler.destroy);

    handler.iterateFiles(({ message, expected, generated }) => {
      it(message, () => {
        expect(generated()).toBe(expected);
      });
    });
  });

});
