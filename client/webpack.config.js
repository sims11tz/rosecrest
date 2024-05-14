const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  resolve: {
	// Define aliases
	alias: {
	  'components': path.resolve(__dirname, 'src/components'),
	  'react-dom/server': require.resolve('react-dom/server.browser.js'),
	  '@shared': path.resolve(__dirname, '../shared'),
	},
	// Add additional plugins like TsconfigPathsPlugin if you are using TypeScript path aliases
	plugins: [
	  new TsconfigPathsPlugin(),
	],
	// Define file extensions that Webpack will resolve
	extensions: ['.mjs', '.jsx', '.js', '.scss', '.json', '.ts', '.tsx'],
	// Optional: Define additional module directories
	modules: [path.resolve(__dirname, 'src'), 'node_modules', path.resolve(__dirname, '../shared')],
  },
  module: {
	rules: [
	  {
		test: /\.m?js$/,
		resolve: {
		  fullySpecified: false,
		},
	  },
	],
  },
};