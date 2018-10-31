const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async (key) => {
  try {
    return (await exec(`git config ${key}`)).stdout.trim();
  } catch(e) {
    return undefined;
  }
};
