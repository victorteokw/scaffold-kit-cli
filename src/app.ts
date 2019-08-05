import { applyMiddleware, chainMiddleware } from "scaffold-kit";
import {
  acceptHelp,
  acceptVersion,
  acceptMockInstall,
  acceptOverwrite,
  acceptSilent,
  appHelp,
  catchError,
  displayHelp,
  displayVersion,
  forwardCommand,
  parseArgv,
  useConfigFile,
  executeInstructions
} from "scaffold-kit/lib/middlewares";

import * as pkgJson from '../package.json';
import { app, command } from "./commands";

const application = applyMiddleware(
  appHelp({
    displayName: 'Scaffold Kit CLI',
    commandName: 'scaffold-kit',
    version: pkgJson.version,
    description: pkgJson.description
  }),
  useConfigFile('.scaffold'),
  chainMiddleware(
    acceptHelp,
    acceptVersion,
    acceptMockInstall,
    acceptOverwrite,
    acceptSilent,
    parseArgv
  ),
  displayVersion(pkgJson.version),
  catchError('CommandNameError', displayHelp()),
  forwardCommand({ app, command }),
  displayHelp(),
  executeInstructions
);

export default application;
