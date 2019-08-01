#!/usr/bin/env node
const { Context } = require('scaffold-kit');
const nullExecutable = require('scaffold-kit/lib/nullExecutable').default;
const app = require('./app');

app(new Context({ wd: process.cwd(), args: [], options: {}}), nullExecutable);
