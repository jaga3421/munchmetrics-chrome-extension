// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const config = require('../webpack.config');
const ZipPlugin = require('zip-webpack-plugin');

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

config.output = {
  ...config.output,
  path: path.resolve(__dirname, '../build'), // Ensure Webpack's output path is correctly set
};

config.plugins = (config.plugins || []).concat(
  new ZipPlugin({
    filename: `${packageInfo.name}-${packageInfo.version}.zip`,
  })
);

webpack(config, function (err, stats) {
  if (err || stats.hasErrors()) {
    console.error('Build failed:', err || stats.toString());
    return;
  }

  console.log('Build successful!');
});
