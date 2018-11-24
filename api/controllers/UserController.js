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
				Game.findGames({ id: updatedUser.game.id }),
				Gametile.find({ game: updatedUser.game.id }),
				Gameword.find({ game: updatedUser.game.id }),
				Chathistory.findChatHistory({ game: updatedUser.game.id }),
				Usergame.findUserGames({ game: updatedUser.game.id })
			]).spread(function(
				room,
				game,
				tiles,
				words,
				chat,
				userGames
			) {
				return sails.sockets.join(req, room.id, function(err) {
					GameService.events.refreshGameState(room, game, tiles, words, chat, userGames);
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
				GameService.events.userDisconnect(user, room);
			});
		});
	},

	leaveGame: function(req, res) {
		var self = this;

		var user;
		var room;
		User.findUsers({ id: req.session.me })
		.then(function(foundUser) {
			user = foundUser;
			room = foundUser.room;
			return User.update({ id: req.session.me }, { room: undefined, game: undefined });
		}).then(function(users) {
			sails.sockets.leave(req, room.id, function(err) {
				GameService.events.userLeave(user, room);
				res.ok();
			});
		});
	}
};

