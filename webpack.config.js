const path = require('path');
const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackPlugins = [
	new MiniCssExtractPlugin({
		filename: '[name].css',
	}),
	new HtmlWebpackPlugin({
		template: 'index.html',
	}),
];

const htmlComponentNames = [
	'board',
	'game',
	'google-analytics',
	'hint-button',
	'keyboard',
	'request-word-modal',
	'toolbar',
	'toast-message',
];

htmlComponentNames.map((name) => {
	webpackPlugins.push(
		new HtmlWebpackPartialsPlugin({
			path: `./src/components/${name}/${name}.html`,
			location: name, // Location property is the name of the created web component
		})
	);
});

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
	plugins: webpackPlugins,
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
};
