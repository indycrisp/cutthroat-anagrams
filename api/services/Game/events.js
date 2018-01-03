module.exports = {
	addWordToPlayer: function(user, word, userGame, removedWordData, removedTiles) {
		sails.sockets.broadcast(user.room.id, 'addWordToPlayer', {
			word: word,
			user: user,
			userGame: userGame,
			removedTiles: removedTiles,
			removedWordData: removedWordData
		});
	},

	sendChat: function(data) {
		sails.sockets.broadcast(data.user.room.id, 'chat', {
			user: data.user,
			userColor: data.userColor,
			text: data.text,
			createdDate: data.createdDate
		});
	},

	refreshGameState: function(room, game, tiles, words, chat, userGames) {
		var wordsByPlayer = {};
		words.sort(function(a, b) {
			return a.id - b.id;
		});

		_.each(words, function(word) {
			if (!wordsByPlayer[word.user]) wordsByPlayer[word.user] = [];
			wordsByPlayer[word.user].push(word);
		});

		sails.sockets.broadcast(room.id, 'refreshGameState', {
			game: game,
			users: game.users,
			tiles: tiles,
			words: wordsByPlayer,
			chat: chat,
			userGames: userGames
		});
	},

	userDisconnect: function(user, room) {
		sails.sockets.broadcast(room.id, 'userDisconnect', {
			user: user
		});
	},

	userLeave: function(user, room) {
		sails.sockets.broadcast(room.id, 'userLeave', {
			user: user
		});
	}
};
