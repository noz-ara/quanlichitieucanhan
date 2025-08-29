const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  devServer: {
  historyApiFallback: true,
  static: {
    directory: path.resolve(__dirname, 'public'),
  },
  compress: true,
  port: 9000,
  open: true,
  hot: true, 
  watchFiles: ['src/**/*'], 
  proxy: [{
    context: ['/api'],
    target: 'http://localhost:8080',
    logLevel: 'debug',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
    secure: false,
  }],
}
};
