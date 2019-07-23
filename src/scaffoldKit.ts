import { execute } from 'scaffold-kit/lib/index';
import app from './app';

execute(
  app,
  {
    wd: process.cwd(),
    args: [],
    options: {}
  }
);
