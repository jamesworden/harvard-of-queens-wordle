const path = require('path')
const ROOT = path.resolve(__dirname, 'src')
const DESTINATION = path.resolve(__dirname, 'dist')
const rimraf = require('rimraf')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const EventHooksPlugin = require('event-hooks-webpack-plugin')

const htmlComponentNames = [
  'board',
  'game',
  'google-analytics',
  'hint-button',
  'keyboard',
  'request-word-modal',
  'toolbar',
  'toast-message',
]

const htmlComponentPlugins = htmlComponentNames.map(name => {
  // Setting location to 'xyz' will allow us to write '<xyz></xyz>' as an HTML element.
  return new HtmlWebpackPartialsPlugin({
    path: `./src/components/${name}/${name}.html`,
    location: name,
  })
})

module.exports = {
  context: ROOT,
  entry: {
    main: './main.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: DESTINATION,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [ROOT, 'node_modules'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new EventHooksPlugin({
      done: () => {
        // Delete unnecessary webpack files
        rimraf('./dist/utils/', () => {})
        rimraf('./dist/environments/', () => {})
        rimraf('./dist/components/', () => {})
        rimraf('./dist/main.d.ts', () => {})
      },
    }),
    ...htmlComponentPlugins,
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'tslint-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 2) Extract into external file(s)
          'css-loader', // 1) Turn css into commonjs
        ],
      },
      { test: /\.ts$/, use: 'ts-loader' },
    ],
  },
  performance: {
    hints: 'error',
    maxEntrypointSize: 1280000, // 1.25 KB
    maxAssetSize: 1280000,
  },
}
