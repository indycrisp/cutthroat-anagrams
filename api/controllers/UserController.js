/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');
var Promise = require('bluebird');
module.exports = {
	getUser: function(req, res) {
		User.findUsers({ id: req.session.me }).exec(function(err, user) {
			res.json(user);
		});
	},

	// Broadcast a chat
	chat: function(req, res) {
		User.findUsers({ id: req.session.me }).exec(function(err, user) {
			GameService.word.guessWord(user, req.param('msg'))
			GameService.chat.sendChat(req);
		});
	},

	// Connect to a game
	join: function(req, res) {
		var self = this;

		if (!req.session.username) return;
	
		return GameService.join_game.connectToGame(req, res)
		.then(function(updatedUser) {
			return Promise.all([
				Room.findRooms({ id: updatedUser.room.id }),
				Gametile.find({ game: updatedUser.game.id }),
				Gameword.find({ game: updatedUser.game.id })
			]).spread(function(
				room,
				tiles,
				words
			) {
				return sails.sockets.join(req, room.id, function(err) {
					GameService.events.refreshGameState(room, tiles, words);
					res.ok();
				});
			});
		});
	},

	// Disconnect from a game; leaves the room, but doesn't remove the user from the game.	
	disconnect: function(user, socket) {
		var self = this;

		if (!user || !user.room) { return; }

		var roomId = user.room;
		User.update({ id: user.id }, { room: undefined })
		.then(function(users) {
			return Room.findOne({ id: roomId }).populate('users');
		}).then(function(room) {
			sails.sockets.leave(socket, room.id, function(err) {
				GamesService.events.refreshUserList(room);
			});
		});
	}
};

