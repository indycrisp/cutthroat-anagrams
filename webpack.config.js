var path = require('path');
module.exports = {
	entry: path.resolve(__dirname, 'assets/js/app.js'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'assets/js/dist')
	}
};
