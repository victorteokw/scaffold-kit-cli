#!/usr/bin/env node
const { execute } = require('scaffold-kit');
const app = require('./app');

execute(app, { wd: process.cwd(), args: [], options: {}});
