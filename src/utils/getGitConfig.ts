import * as util from 'util';
import * as childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

export default async (key: string) => {
  // for jest test only
  if (process.env.JEST_WORKER_ID !== undefined) {
    return 'Git Config ' + key;
  }
  // for real environment
  try {
    return (await exec(`git config ${key}`)).stdout.trim();
  } catch(e) {
    return undefined;
  }
};
