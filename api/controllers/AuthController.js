/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
module.exports = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},


	register: function(req, res) {
		return res.register({
			username: req.param('username'),
			password: req.param('password')
		});
	},

	login: function(req, res) {
		return res.login({
			username: req.param('username'),
			password: req.param('password'),
			successRedirect: '/game',
			invalidView: 'login'
		});
	},

	logout: function(req, res) {
		var self = this;

		req.session.destroy(function(err) {
			res.ok({ success: 1 });
		});
	},

	viewRegister: function(req, res) {
		res.view('register.ejs', {
			title: 'Register',
	   		err: ''
		});
	},

	viewLogin: function(req, res) {
		res.view('login.ejs', {
			title: 'Login',
			err: ''
		});
	},

	viewGame: function(req, res) {
		res.view('game.ejs', {
			title: 'cutthroat',
			err: ''
		});
	}
};

