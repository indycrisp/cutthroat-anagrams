/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},


	register: function(req, res) {
		return res.register({
			email: req.param('email'),
			password: req.param('password'),
			successRedirect: '/game',
			invalidView: 'register'
		});
	},

	login: function(req, res) {
		return res.login({
			email: req.param('email'),
			password: req.param('password'),
			successRedirect: '/game',
			invalidView: 'login'
		});
	},

	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	}	
};

