define([
	'../styles/login.css',
	'lodash',
	'./game'
], function(
	gamestyles,
	_,
	game
) {
	return {
		init: function() {
			var self = this;

			if ($('.lightbox').length) return;

			var loginTemplate = JST['assets/templates/login/login.ejs'];
			//var registerTemplate = JST['assets/templates/login/register.ejs'];

			var lightboxHTML = JST['assets/templates/login/lightbox.ejs']({
				contentTemplate: loginTemplate
			});

			$('body').append(lightboxHTML);

			self.attachListeners();
		},

		attachListeners: function() {
			var self = this;

			$('input').off('enterKey').bind('enterKey', function(event) {
				var authContainer = $(event.target).closest('.auth-container');
				if (authContainer.hasClass('login-container')) {
					self.submit('login');
				}
				else if (authContainer.hasClass('register-container')) {
					self.submit('register');
				}
			});

			$('input').off('focus').bind('focus', function(event) {
				$(event.target).removeClass('invalid-input');
			});

			$('.login-button').off('click').click(function() {
				self.submit('login');
			});

			$('.register-button').off('click').click(function() {
				self.submit('register');
			});

			$('.switch-to-register-button').off('click').click(function() {
				var registerTemplate = JST['assets/templates/login/register.ejs'];
				$('.auth-container').replaceWith(registerTemplate);
				self.attachListeners();
			});

			$('.switch-to-login-button').off('click').click(function() {
				var loginTemplate = JST['assets/templates/login/login.ejs'];
				$('.auth-container').replaceWith(loginTemplate);
				self.attachListeners();
			});
		},

		submit: function(type) {
			var self = this;

			var usernameField = $('.' + type + '-username');
			var passwordField = $('.' + type + '-password');
			usernameField.removeClass('invalid-input');
			passwordField.removeClass('invalid-input');
			usernameField.next().html('');
			passwordField.next().html('');

			io.socket.post('/' + type, {
				username: usernameField.val(),
				password: passwordField.val()
			}, function(data) {
				if (data.errors && data.errors.length) {
					self.handleValidationErrors({
						errors: data.errors,
						type: type
					});
				}
				else {
					$('.lightbox').remove();
					game.init(data);
				}
			});
		},

		handleValidationErrors: function(data) {
			var self = this;

			_.each(data.errors, function(error) {
				var errorTemplate = JST['assets/templates/login/validation_error.ejs']({
					message: error.errorMessage
				});

				switch (error.errorType) {
					case 'USERNAME':
						var usernameField = $('.' + data.type + '-username');
						usernameField.addClass('invalid-input');
						var errorContainer = usernameField.next();
						$(errorContainer).html(errorTemplate);
						break;
					case 'PASSWORD':
						var passwordField = $('.' + data.type + '-password');
						passwordField.addClass('invalid-input');
						var errorContainer = passwordField.next();
						$(errorContainer).html(errorTemplate);
						break;
					default:
				}
			});
		}
	};
});
