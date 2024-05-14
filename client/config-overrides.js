const path = require('path');
const { override, addWebpackAlias, addWebpackModuleRule, addBabelPreset } = require('customize-cra');

module.exports = override(
  // Use Babel preset for TypeScript to handle .ts and .tsx files
  addBabelPreset('@babel/preset-typescript'),

  // Add an explicit rule for TypeScript files if needed
  addWebpackModuleRule({
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true  // This option increases build speeds but you will need to run type checks separately
        }
      }
    ]
  }),

  // Setup an alias to simplify imports from the shared directory
  addWebpackAlias({
    '@shared': path.resolve(__dirname, '../shared'),
  })
);