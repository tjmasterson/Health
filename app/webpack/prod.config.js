require('babel-polyfill');

// Webpack config for creating the production bundle.
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var projectRootPath = path.resolve(__dirname, '../');
var assetsPath = path.resolve(projectRootPath, './static/dist');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      // 'bootstrap-sass!./src/theme/bootstrap.config.prod.js',
      'font-awesome-webpack!./src/theme/font-awesome.config.prod.js',
      path.resolve(__dirname, '../src/client.js')
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
        ]
      },
      { test: /\.json$/,
        use: [
          { loader: 'json-loader' }
        ]
      },
      { test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader?modules&importLoaders=2&sourceMap' },
            { loader: 'postcss-loader' },
            { loader: 'less-loader?outputStyle=expanded' }
          ]
        })
      },
      { test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader?modules&importLoaders=2&sourceMap' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader?outputStyle=expanded' }
          ]
        })
      },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        ]
      },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        ]
      },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream'
            }
          }
        ]
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'file-loader' }
        ]
      },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
          { loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'mimetype=image/svg+xml'
            }
          }
          ]
      },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        use: [
          { loader: 'url-loader',
            options: { limit: 10240 }
          }
        ]
      }
    ]
  },
  stats: true,
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new CleanPlugin([assetsPath], { root: projectRootPath }),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin('[name]-[chunkhash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },

      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // optimizations
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    }),

    webpackIsomorphicToolsPlugin
  ]
};
