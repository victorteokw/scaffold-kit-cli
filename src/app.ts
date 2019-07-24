import { applyMiddleware } from "scaffold-kit";
import {
  acceptMockInstall,
  acceptOverwrite,
  acceptSilent,
  defineOptions,
  displayAppHelp,
  displayVersion,
  forwardCommand,
  parseArgv,
  useConfigFile
} from "scaffold-kit/lib/middlewares";

import * as pkgJson from '../package.json';
import { app, command } from "./commands";

export default applyMiddleware(
  useConfigFile('.scaffold'),
  defineOptions({
    help: {
      type: 'boolean',
      alias: 'h',
      desc: "View Scaffold Kit CLI's help.",
      default: false,
      save: false
    },
    version: {
      type: 'boolean',
      alias: 'v',
      desc: "View Scaffold Kit CLI's version.",
      default: false,
      save: false
    }
  }),
  parseArgv,
  displayVersion(pkgJson.version),
  displayAppHelp({
    displayName: 'Scaffold Kit CLI',
    commandName: 'scaffold-kit',
    version: pkgJson.version,
    description: pkgJson.description
  }),
  acceptMockInstall,
  acceptOverwrite,
  acceptSilent,
  forwardCommand({ app, command })
);
