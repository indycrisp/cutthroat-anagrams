var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {
	sendChat: function(req) {
		var self = this;

		var msg = req.param('msg');
		var user;
		User.findUsers({ id: req.session.me })
		.then(function(foundUser) {
			user = foundUser;
			return Chathistory.create({
				text: msg,
				user: user,
				game: user.game
			});
		})
		.then(function(chatHistory) {
			GameService.word.guessWord(user, chatHistory.text);
			GameService.events.sendChat({
				user: user,
				text: chatHistory.text,
				createdDate: chatHistory.createdAt
			});
		});
	}
};
