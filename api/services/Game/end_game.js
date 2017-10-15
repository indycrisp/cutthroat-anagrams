var _ = require('lodash');

module.exports = {
	endGame: function(game, room) {
		Game.update({ id: game.id }, { completed: true })
		.then(function(updatedGame) {
			sails.sockets.broadcast(room.id, 'endGame');
		});
	}
};
