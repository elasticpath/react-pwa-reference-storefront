/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


const jest = require('jest');
const { execSync } = require('child_process');
const yargs = require('yargs');
const fs = require('fs');

const argv = process.argv.slice(2);

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Watch unless on CI or explicitly running all tests
if (
  !process.env.CI
  && argv.indexOf('--watchAll') === -1
) {
  // https://github.com/facebook/create-react-app/issues/5210
  const hasSourceControl = isInGitRepository() || isInMercurialRepository();
  argv.push(hasSourceControl ? '--watch' : '--watchAll');
}

const scopeKey = 'scope';
const scopePropIndex = argv.indexOf(`--${scopeKey}`);
let args = argv;
const defaultScopeFile = 'vestri.json';
const parsedProps = yargs.parse(process.argv);
const testDirPath = `${process.cwd()}/src/tests/e2e/scopes`;
if (scopePropIndex !== -1) {
  args = argv.filter(arg => !(arg === `--${scopeKey}` || arg === parsedProps[scopeKey]));
}
fs.readdir(testDirPath, (err, files) => {
  if (err) {
    throw Error('Scopes directory not found');
  }
  const scopePropFile = files.find(file => file === `${parsedProps[scopeKey]}.json`);
  const scopeFile = scopePropFile || defaultScopeFile;
  process.env.SCOPE_DIR = `./scopes/${scopeFile}`;
  jest.run(args);
});
