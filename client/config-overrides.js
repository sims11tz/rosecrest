const path = require('path');
const { override, addBabelPreset, addWebpackModuleRule, useBabelRc } = require('customize-cra');

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
    //   {
    //     loader: require.resolve('react-refresh-webpack-plugin/loader'),
    //     options: {
    //       skipEnvCheck: true  // This helps avoid issues with environment checks in the loader itself
    //     }
    //   }
    ]
  }),

  // Setup an alias to simplify imports from the shared directory
  (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, 'shared')
    };
    return config;
  },

  // Optional: Use a .babelrc or babel.config.js if you have custom Babel configurations
  // Uncomment the line below if you have a custom Babel config you want to use
  // useBabelRc()
);