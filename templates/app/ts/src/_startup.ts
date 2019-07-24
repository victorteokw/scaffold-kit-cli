#!/usr/bin/env node
import { execute } from 'scaffold-kit';
import app from './app';

execute(app, { wd: process.cwd(), args: [], options: {}});
