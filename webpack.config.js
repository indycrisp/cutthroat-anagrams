var path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'assets/js/app.js'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'assets/js/dist'),
		publicPath: '/js/dist/'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	node: {
		fs: "empty"
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: '!!raw-loader!./views/layout_base.ejs',
			filename: '../../../views/layout.ejs',
			hash: true
		})
	]
};
