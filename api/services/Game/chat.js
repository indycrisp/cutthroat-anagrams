var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {
	sendChat: function(req) {
		var self = this;

		var msg = req.param('msg');
		User.findUsers({ id: req.session.me }).exec(function(err, user) {
			GameService.word.guessWord(user, msg);
			GameService.events.sendChat(user, msg);
		});
	}
};
