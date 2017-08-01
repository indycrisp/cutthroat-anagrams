module.exports = {
	removeTiles: function(user, tiles) {
		sails.sockets.broadcast(user.room, 'removeTiles', {
			tiles: tiles
		});	
	},

	addWordToPlayer: function(user, word) {
		sails.sockets.broadcast(user.room, 'addWordToPlayer', {
			word: word,
			user: user
		});
	},

	removeWordsFromPlayers: function(user, words) {
		sails.sockets.broadcast(user.room, 'removeWordsFromPlayers', {
			words: words
		});
	}
};
