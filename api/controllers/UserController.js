/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');
module.exports = {

	getUser: function(req, res) {
		User.findOne({ id: req.session.me }).exec(function(err, user) {
			res.json(user);
		});
	},

	// Send a chat
	chat: function(req, res) {
		User.findOne({ email: req.param('sender') }).exec(function(err, user) {
			sails.sockets.broadcast(user.room, 'chat', {                                                                                                                                                                          
				from: req.param('sender'),
				msg: req.param('msg')
			});
		});
	},

	join: function(req, res) {
		var self = this;

		self.session = req;
		//var username = req.param('username');
		var username = req.session.username;

		// TODO: put this in a User model function
		User.findOne({ email: username }).exec(function(err, user) {
			if (!user) { return; }

			// If user belongs to a game, add them to the game room	
			if (user.game) {
				console.log('USER HAS GAME, JUST JOIN IT');

				Game.findOne({ id: user.game }).populate('users')
				.exec(function(err, game) {
					return self._addUserToRoom(req, game);
				});
			}
			else {
				// Look for a game with less than 4
				Game.findOne({ count: { '<': 4 } }).populate('users').exec(function(err, game) {
					// ...If it exists, add the player to the game and the room
					if (game) {
						console.log('GAME < 4 PLAYERS, ADD PLAYER TO GAME');
						self._addNewUser(req, game);
					}
					// ...Otherwise, create a new game and add the player ot the game and the room
					else {
						console.log('NO GAME < 4 PLAYERS, CREATING NEW GAME AND ADDING PLAYER');
						
						var newGameId;
						Game.create({ count: 0 })
						.then(function(game) {
							newGameId = game.id;
							return Room.create({ game: game });
						}).then(function(room) {
							return Game.update({ id: newGameId }, { room: room });
						}).then(function(games) {
							return self._addNewUser(req, games[0]);
						});
					}
				});
			}
		});

		res.ok();
	},

	_addNewUser: function(req, game) {
		var self = this;
		
		return self._addUserToGame(req, game)
		.then(function(updatedGame) {
			return self._addUserToRoom(req, updatedGame);
		});
	},

	_addUserToGame: function(req, game) {
		var self = this;

		var gameId = game.id;
		return User.update({ email: req.session.username }, { game: game })
		.then(function(user) {
			return Game.findOne({ id: gameId }).populate('users');
		});
	},

	// TODO: promisify sails.sockets?
	_addUserToRoom: function(req, game) {
		var self = this;

		return User.update({ email: req.session.username }, { room: game.room })
		.then(function(users) {
			return Room.findOne({ id: users[0].room }).populate('users');
		}).then(function(room) {
			var users = _.map(room.users, 'email').sort();
			// TODO: move socket events somewhere else
			return sails.sockets.join(req, room.id, function(err) {
				sails.sockets.broadcast(room.id, 'updateUserList', {
					users: users
				});
			});
		});	
	},

	disconnect: function(user) {
		var self = this;

		if (!user || !user.room) { return; }

		var roomId = user.room;
		User.update({ id: user.id }, { room: undefined })
		.then(function(users) {
			return Room.findOne({ id: roomId }).populate('users');
		}).then(function(room) {
			sails.sockets.leave(self.session, room.id, function(err) {
				var users = _.map(room.users, 'email').sort();	
				sails.sockets.broadcast(room.id, 'updateUserList', {
					users: users
				});
			});
		});
	}
};

