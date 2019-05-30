import {resolve} from 'path';
import {execSync} from 'child_process';
import {exists} from 'fs';
import rimraf from 'rimraf';

function createTest(caze, dir) {
  try {
    execSync('webpack --config ../webpack.config.js --output-path dist/', {
      cwd: resolve(__dirname, dir)
    });
  } catch (e) {
    console.error(e);
    expect(e).toBe(undefined);
  }

  function getOutputFilePath(filename) {
    return resolve(__dirname, dir, './dist/', filename);
  }

  test(`${caze}: build axml`, done => {
    exists(getOutputFilePath('index.axml'), exists => {
      expect(exists).toBe(true);
      done();
    });
  });
  test(`${caze}: build js`, done => {
    exists(getOutputFilePath('index.js'), exists => {
      expect(exists).toBe(true);
      done();
    });
  });
  test(`${caze}: build acss`, done => {
    exists(getOutputFilePath('index.acss'), exists => {
      expect(exists).toBe(true);
      done();
    });
  });
  test(`${caze}: build json`, done => {
    exists(getOutputFilePath('index.json'), exists => {
      expect(exists).toBe(true);
      done();
    });
  });
}

const cases = [{
  caze: 'normal case', dir: './normal'
}, {
  caze: 'use sass case', dir: './sass'
}, {
  caze: 'import file case', dir: './importFile'
}];

cases.forEach(c => createTest(c.caze, c.dir));

afterAll(() => {
  cases.forEach(c => rimraf(resolve(__dirname, c.dir, './dist'), e => {
    e && console.error(e)
  }))
});
