module.exports = function register(args) {
	var req = this.req;
	var res = this.res;

	User.attemptRegister({ email: args.email }, function(err, user) {
		if (err) return res.negotiate(err);

		if (user) {
			return res.view(args.invalidView, { err: 'User already exists' });
		}

		var password = args.password;
		var hasher = require('password-hash');	
		password = hasher.generate(password);
		User.create({
			email: args.email,
			password: password
		}).then(function(user) {
			req.session.me = user.id;
			req.session.username = user.email;
			return res.redirect(args.successRedirect);
		});
	});
};                                                                                                                                                       
