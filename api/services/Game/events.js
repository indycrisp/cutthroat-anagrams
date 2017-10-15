module.exports = {
	removeTiles: function(user, tiles) {
		sails.sockets.broadcast(user.room.id, 'removeTiles', {
			tiles: tiles
		});	
	},

	addWordToPlayer: function(user, word) {
		sails.sockets.broadcast(user.room.id, 'addWordToPlayer', {
			word: word,
			user: user
		});
	},

	removeWordsFromPlayers: function(user, words) {
		sails.sockets.broadcast(user.room.id, 'removeWordsFromPlayers', {
			words: words
		});
	},

	sendChat: function(user, msg) {
		sails.sockets.broadcast(user.room.id, 'chat', {
			from: user.email,
			msg: msg
		});
	},

	refreshGameState: function(room, game, tiles, words) {
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
			words: wordsByPlayer
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
