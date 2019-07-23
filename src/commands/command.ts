import { applyMiddleware, Executable } from "scaffold-kit/lib/index";
import {
  defineOptions,
  displayHelp,
  seekingProjectRoot
} from "scaffold-kit/lib/middlewares";

const app: Executable = async (ctx, next) => {

};

export default applyMiddleware(
  defineOptions({
    copyTemplates: {
      type: 'string',
      desc: 'the path at where to copy templates from.',
      save: false
    },
    ignoreFiles: {
      type: 'string[]',
      desc: 'files to be ignored.',
      default: [],
      save: false
    },
    ignoreDirs: {
      type: 'string[]',
      desc: 'directories to be ignored.',
      default: [],
      save: false
    }
  }),
  seekingProjectRoot,
  displayHelp({
    desc: 'Create a new scaffold tool.',
    usage: 'scaffold-kit app path_to_dir [options...]'
  }),
  app
);
