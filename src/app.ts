import { applyMiddleware } from "scaffold-kit/lib";
import {
  acceptMockInstall,
  acceptOverwrite,
  acceptSilent,
  defineOptions,
  displayHelp,
  displayVersion,
  forwardCommand,
  parseArgv,
  useConfigFile
} from "scaffold-kit/lib/middlewares";
import * as pkgJson from '../package.json';
import {
  app,
  command,
  destroy,
  test
} from "./commands";

export default applyMiddleware(
  useConfigFile('.scaffold'),
  defineOptions({}),
  displayVersion(pkgJson.version),
  displayHelp('Scaffold Kit CLI', 'scaffold-kit', pkgJson.description, pkgJson.version),
  parseArgv,
  acceptMockInstall,
  acceptOverwrite,
  acceptSilent,
  forwardCommand({
    app,
    command,
    destroy,
    test
  })
);
