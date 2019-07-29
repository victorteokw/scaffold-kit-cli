import * as path from 'path';
import { TestHandler } from 'scaffold-kit-quality-testing';
import app from '../../src/app';

describe('app command: ', () => {

  describe('creates a javaScript app in given directory', () => {

    const handler = new TestHandler(
      app,
      'app brand-new-app',
      path.join(__dirname, '../expected/app/brand-new-app-js')
    );

    beforeAll(handler.execute);

    afterAll(handler.destroy);

    handler.iterateFiles(({ message, expected, generated }) => {
      it(message, () => {
        expect(generated()).toBe(expected);
      });
    });

  });

  describe('creates a TypeScript app in given directory', () => {

    const handler = new TestHandler(
      app,
      'app brand-new-app --type-script',
      path.join(__dirname, '../expected/app/brand-new-app-ts')
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
