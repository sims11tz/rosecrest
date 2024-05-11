const path = require('path');

module.exports = {
  resolve: {
	modules: [path.resolve(__dirname, 'src'), 'node_modules', path.resolve(__dirname, '../shared')]
  },
};