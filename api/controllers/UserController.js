/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');
module.exports = {
	getUser: function(req, res) {
		User.findUsers({ id: req.session.me }).exec(function(err, user) {
			res.json(user);
		});
	},

	// Broadcast a chat
	chat: function(req, res) {
		User.findOne({ email: req.param('sender') }).exec(function(err, user) {
			GameService.word.guessWord(user, req.param('msg'))
			.then(function() {
/*			
			var trimmedMsg = req.param('msg').trim();
			if (!/\s/.test(trimmedMsg) && trimmedMsg.length >= 3) {
				GameService.word.guessWord(trimmedMsg);
			}
*/
				sails.sockets.broadcast(user.room, 'chat', {                                                                                                                                                                          
					from: req.param('sender'),
					msg: req.param('msg')
				});
			});
		});
	},

	// Connect to a game
	join: function(req, res) {
		var self = this;

		if (!req.session.username) return;
	
		return GameService.join_game.connectToGame(req, res)
		.then(function(updatedUser) {
			return Room.findRooms({ id: updatedUser.room.id });
		})
		.then(function(room) {
			var users = _.map(room.users, 'email').sort();
			return sails.sockets.join(req, room.id, function(err) {
				sails.sockets.broadcast(room.id, 'updateUserList', {
					users: users
				});

				res.ok();
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
				var users = _.map(room.users, 'email').sort();	
				sails.sockets.broadcast(room.id, 'updateUserList', {
					users: users
				});
			});
		});
	}
};

