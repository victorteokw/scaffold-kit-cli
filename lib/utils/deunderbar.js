const path = require('path');

module.exports = (filename) => {
  if (path.basename(filename) === filename) {
    return filename.replace(/^_/, '');
  } else {
    return path.join(
      path.dirname(filename),
      path.basename(filename).replace(/^_/, '')
    );
  }
};
