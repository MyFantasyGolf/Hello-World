//eslint-disable-next-line no-undef
const path = require('path');
//eslint-disable-next-line no-undef
const HtmlWebpackPlugin = require('html-webpack-plugin');

//eslint-disable-next-line no-undef
module.exports = {
  entry: ['./index.js'],
  output: {
    filename: 'myfantasygolf.js',
    publicPath: '/',
    //eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  devServer: {
    port: 3001,
    publicPath: '/',
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000/'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html.template'
    })
  ]
};
