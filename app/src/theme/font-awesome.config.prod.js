const buildExtractStylesLoader = require('./buildExtractStylesLoader');
const fontAwesomeConfig = require('./font-awesome.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  styleLoader: buildExtractStylesLoader(ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader' },
      { loader: 'less-loader'}
    ]
  })),
  styles: fontAwesomeConfig.styles
};
