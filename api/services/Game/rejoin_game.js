var _ = require('lodash');

module.exports = {
	rejoinGame: function(req, game) {
		var self = this;

		Gametile.find({ game: game.id })
		.then(function(tiles) {
			console.log(tiles);
			sails.sockets.broadcast(req.socket.id, 'refreshTiles', {
				tiles: tiles
			});
		});
	}
};
