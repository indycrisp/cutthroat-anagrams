define([
	'./game'
], function(
	game
) {
	return {
		init: function() {
			var self = this;

			if ($('.lightbox').length) return;

			var loginTemplate = JST['assets/templates/login/login.ejs'];
			var lightboxHTML = JST['assets/templates/login/lightbox.ejs']({
				contentTemplate: loginTemplate
			});

			$('body').append(lightboxHTML);

			self.attachListeners();
		},

		attachListeners: function() {
			var self = this;

			$(document).keypress(function(e) {
				if (e.which === 13) {
					var authContainer = $('.auth-container');
					if (
						authContainer.hasClass('login-container')
						&& $('.login-username').val()
						&& $('.login-password').val()
					) {
						$('.login-username,.login-password').blur();
						self.submit('login');
					}
					else if (
						authContainer.hasClass('register-container')
						&& $('.register-username').val()
						&& $('.register-password').val()
					) {
						$('.register-username,.register-password').blur();
						self.submit('register');
					}
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

			$('.switch-to-register').off('click').click(function() {
				var registerTemplate = JST['assets/templates/login/register.ejs'];
				$('.auth-container').replaceWith(registerTemplate);
				self.attachListeners();
			});

			$('.switch-to-login').off('click').click(function() {
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
