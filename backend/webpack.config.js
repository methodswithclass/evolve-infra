const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUT_DIR = path.resolve(__dirname, 'build');

module.exports = {
  entry: {
    connect: path.resolve(SRC_DIR, 'functions/connect'),
    disconnect: path.resolve(SRC_DIR, 'functions/disconnect'),
    run: path.resolve(SRC_DIR, 'functions/run'),
    stop: path.resolve(SRC_DIR, 'functions/stop'),
  },
  output: {
    path: OUT_DIR,
    filename: '[name]/[name].js',
    library: '[name]',
    libraryTarget: 'umd',
  },
  mode: 'development',
  optimization: {
    minimize: false,
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { node: '18' },
                  modules: false,
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
