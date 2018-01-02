module.exports = function register(args) {
	var req = this.req;
	var res = this.res;

	User.attemptRegister({ username: args.username }, function(err, user) {
		if (err) return res.negotiate(err);

		var errors = [];
		if (!args.username) {
			errors.push({
				errorType: 'USERNAME',
				errorMessage: 'Required'
			});
		}
		else if (args.username.length > 20) {
			errors.push({
				errorType: 'USERNAME',
				errorMessage: '20 character max'
			});
		}
		else if (user) {
			errors.push({
				errorType: 'USERNAME',
				errorMessage: 'Already taken'
			});
		}

		if (!args.password) {
			errors.push({
				errorType: 'PASSWORD',
				errorMessage: 'Required'
			});
		}
		else if (args.password.length < 7) {
			errors.push({
				errorType: 'PASSWORD',
				errorMessage: '7 character minimum'
			});
		}

		if (errors.length) {
			return res.ok({
				errors: errors
			});
		}

		var password = args.password;
		var hasher = require('password-hash');	
		password = hasher.generate(password);
		User.create({
			username: args.username,
			password: password
		}).then(function(user) {
			req.session.me = user.id;
			req.session.username = user.username;
			return res.ok(user);
		});
	});
};                                                                                                                                                       
