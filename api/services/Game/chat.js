var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {
	sendChat: function(req) {
		var self = this;

		var msg = req.param('msg');
		var user;
		var userColor;
		User.findUsers({ id: req.session.me })
		.then(function(foundUser) {
			user = foundUser;
			return Usergame.findUserGames({
				user: foundUser.id,
				game: foundUser.game.id
			});
		})
		.then(function(userGames) {
			userColor = userGames[0].color;	
			return Chathistory.create({
				text: msg,
				user: user,
				game: user.game,
				color: userColor
			});
		})
		.then(function(chatHistory) {
			if (user.game && !user.game.completed) {
				GameService.word.guessWord(user, chatHistory.text);
			}

			GameService.events.sendChat({
				user: user,
				userColor: userColor,
				text: chatHistory.text,
				createdDate: chatHistory.createdAt
			});
		});
	}
};
