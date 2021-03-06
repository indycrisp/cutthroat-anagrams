var _ = require('lodash');
var Promise = require('bluebird');

var PLAYERS_PER_GAME = 2;
var PLAYER_COLOR_MAP = {
	1: 'red',
	2: 'blue'
};

module.exports = {
	connectToGame: function(req, res) {
		var self = this;

		return Promise.all([
			User.findUsers({ id: req.session.me }),
			Game.findGames({ count: { '<': PLAYERS_PER_GAME } })
		]).spread(function(
			user,
			joinableGames
		) {
			if (!user) return;

			// If the user is in a game already, rejoin it
			// If there is a game with less than max people, join it
			// Otherwise, start a new game + room and join them
			if (user.game) {
		 		return RoomService.join_room.joinRoom(user, user.game.room);
			}
			else if (joinableGames.length) {
				var gameToJoin = joinableGames[0];
				return self.joinExistingGame(user, gameToJoin)
				.then(function(updatedUser) {
					if (updatedUser.game.count === PLAYERS_PER_GAME) {
						GameService.start_game.startGame(gameToJoin, updatedUser.room);
					}

					return updatedUser;	
				});
			}
			else {
				return self.joinNewGame(user);
			}
		});
	},

	// Join a game/room that has less than max players
	joinExistingGame: function(user, game) {
		var self = this;

		return self.addUserToGame(user, game)
		.then(function(updatedUser) {
			return RoomService.join_room.joinRoom(updatedUser, game.room.id);
		});
	},

	// Create a new game and room and join them
	joinNewGame: function(user) {
		var self = this;

		var newGame;
		var newRoom;
		return Game.create({ count: 0 })
		.then(function(game) {
			newGame = game;
			return Room.create({ game: game.id });
		})
		.then(function(room) {
			newRoom = room;
			return Game.update({ id: newGame.id }, { room: room.id });
		})
		.then(function(updatedGames) {
			return self.addUserToGame(user, updatedGames[0]);
		})
		.then(function(user) {
			return RoomService.join_room.joinRoom(user, newRoom.id);
		});
	},

	// Tie a user model to a game model, and increment the game's user count
	addUserToGame: function(user, game) {
		var self = this;

		var gameCount = 0;
		return Game.update({ id: game.id }, { count: game.count + 1 })
		.then(function(updatedGames) {
			gameCount = updatedGames[0].count;
			return User.update({ id: user.id }, { game: updatedGames[0].id });
		})
		.then(function(users) {
			var userColor = PLAYER_COLOR_MAP[gameCount];
			return Usergame.create({ user: user, game: game, color: userColor });
		})
		.then(function(history) {
			return User.findUsers({ id: user.id });
		});
	}
};
