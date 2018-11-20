module.exports = function(grunt) {
	grunt.config.set('hashres', {
		hashres: {
			options: {
				fileNameFormat: '${name}.${ext}?${hash}'
			},
			src: [
				'.tmp/public/jst.js'
			],
			dest: './views/layout_base.ejs'
		},
	});
	
	grunt.loadNpmTasks('grunt-hashres');
};
