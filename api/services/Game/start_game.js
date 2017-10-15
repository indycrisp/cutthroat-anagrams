var _ = require('lodash');

module.exports = {
	startGame: function(game, room) {
		var self = this;

		var tileData = self.createTileSet();
		self.startGameInterval(game, room, tileData);
	},

	createTileSet: function() {
		var self = this;

		var tileSet = [];
		_.each(Game.tileCounts, function(count, letter) {
			for (var i = 0; i < count; i++) {
				tileSet.push(letter);
			}
		});

		// 2 random letters to make the total 100
		tileSet.push(Game.alphabet[Math.floor(Math.random() * Game.alphabet.length)]);
		tileSet.push(Game.alphabet[Math.floor(Math.random() * Game.alphabet.length)]);

		var tileIndexes = [];
		for (var i = 0; i < 100; i++) {
			tileIndexes.push(i);
		}

		return {
			tileSet: tileSet,
			tileIndexes: tileIndexes
		};
	},

	startGameInterval: function(game, room, tileData) {
		var self = this;

		var gameEnding = false;
		var countdown = 5;
		var interval = setInterval(function() {
			if (tileData.tileIndexes.length === 0) {
				if (gameEnding && countdown === 0) {
					clearInterval(interval);
					GameService.end_game.endGame(game, room);
				}
				else if (!gameEnding) {
					gameEnding = true;
					countdown = 15;
				}
			}

			sails.sockets.broadcast(room.id, 'updateCountdown', {
				seconds: countdown
			});

			if (gameEnding) {
				countdown--;
				return;
			}

			if (countdown === 0) {
				var randIndex = Math.floor(Math.random() * tileData.tileIndexes.length);
				var randLetterIndex = Math.floor(Math.random() * tileData.tileSet.length);

				sails.sockets.broadcast(room.id, 'addTile', {
					tileIndex: tileData.tileIndexes[randIndex],
					tileLetter: tileData.tileSet[randLetterIndex]
				});	

				Gametile.create({
					game: game.id,
					letter: tileData.tileSet[randLetterIndex],
					pos: tileData.tileIndexes[randIndex]
				}).exec(function(err) {	
				});

				tileData.tileIndexes.splice(randIndex, 1);
				tileData.tileSet.splice(randLetterIndex, 1);

				countdown = 5;
			}
			else {
				countdown--;
			}
		}, 1);
	}
};
