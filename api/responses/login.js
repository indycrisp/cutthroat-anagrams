module.exports = function login(args) {
	var req = this.req;
	var res = this.res;

	User.attemptLogin({ username: args.username }, function(err, user) {
		if (err) return res.negotiate(err);

		var errors = [];
		if (!args.username) {
			errors.push({
				errorType: 'USERNAME',
				errorMessage: ''
			});

			errors.push({
				errorType: 'PASSWORD',
				errorMessage: ''
			});
		}
		else if (!user) {
			errors.push({
				errorType: 'USERNAME',
				errorMessage: "User doesn't exist"
			});
		}

		if (errors.length) {
			return res.ok({
				errors: errors
			});
		}

		var password = args.password;
		var hasher = require("password-hash");
		if (hasher.verify(password, user.password)) {
			req.session.me = user.id;
			req.session.username = user.username;
			return res.redirect(args.successRedirect);
		}
		else {
			errors.push({
				errorType: 'PASSWORD',
				errorMessage: "Incorrect password"
			});
		}

		if (errors.length) {
			return res.ok({
				errors: errors
			});
		}
	});
};
