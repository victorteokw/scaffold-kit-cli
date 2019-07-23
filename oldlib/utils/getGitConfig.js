const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async (key) => {
  if (process.env.JEST_WORKER_ID !== undefined) {
    return 'Git Config ' + key;
  }
  try {
    return (await exec(`git config ${key}`)).stdout.trim();
  } catch(e) {
    return undefined;
  }
};
