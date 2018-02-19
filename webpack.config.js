var path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'assets/js/app.js'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'assets/js/dist')
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
	}
};
