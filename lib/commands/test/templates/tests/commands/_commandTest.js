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
    '<%- commandVarName %>',
    app,
    path.join(__dirname, '../expected/<%- commandVarName %>'),
    path.join(__dirname, '../fixtures/<%- commandVarName %>')
  )
);

afterAll(cleanUpTest('<%- commandVarName %>'));

describe('<%- commandName %> command: ', () => {

  describe('TODO: update your describing here', () => {
    beforeAll(runTest({
      group: '<%- commandVarName %>',
      template: 'example',
      fixture: 'example',
      command: '<%- commandName %>'
    }));
    iterateFiles('<%- commandVarName %>', 'example', 
      ({ filename, expected, generated }) => {
        it(`creates file '${filename}'`, () => {
          expect(generated(filename)).toBe(expected(filename));
        });
      });
  });

});
