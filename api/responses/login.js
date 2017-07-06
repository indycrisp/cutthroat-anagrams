module.exports = function login(args) {
	var req = this.req;
	var res = this.res;

	User.attemptLogin({ email: args.email }, function(err, user) {
		if (err) return res.negotiate(err);

		if (!user) {
			return res.view(args.invalidView, { err: 'User does not exist' });
		}

		req.session.me = user.id;
		req.session.username = user.email;

		var password = args.password;
		var hasher = require("password-hash");
		if (hasher.verify(password, user.password)) {
			return res.redirect(args.successRedirect);
			//User.join(req, res).then(function(err) {
			//	res.redirect(args.successRedirect);
			//});
		}
		else {
			return res.view(args.invalidView, { err: 'Invalid password' });
		}
	});
};
