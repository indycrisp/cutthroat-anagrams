/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');

var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var tileCounts = {
	'A': 9,
	'B': 2,
	'C': 2,
	'D': 4,
	'E': 12,
	'F': 2,
	'G': 3,
	'H': 2,
	'I': 9,
	'J': 1,
	'K': 1,
	'L': 4,
	'M': 2,
	'N': 6,
	'O': 8,
	'P': 2,
	'Q': 1,
	'R': 6,
	'S': 4,
	'T': 6,
	'U': 4,
	'V': 2,
	'W': 2,
	'X': 1,
	'Y': 2,
	'Z': 1
};

module.exports = {
	attributes: {
		users: {
			collection: 'User',
			via: 'game'
		},
		room: {
			model: 'Room'
		},
		count: {
			type: 'integer'
		}
	},

	tileCounts: tileCounts,
	alphabet: alphabet,

	findGames: function(args) {
		var self = this;

		var findFunction;
		if (args.id) {
			findFunction = Game.findOne(args);
		}
		else {
			findFunction = Game.find(args);
		}

		return findFunction
			.populate('users')
			.populate('room')
		;
	},

/*
	init: function(game, room) {
		var self = this;

		var tileData = self.createTileSet();
		self.startCountdown(room, game, tileData);
	},
	
	rejoin: function(req, game) {
		Gametile.find({ game: game.id })
		.then(function(tiles) {
			sails.sockets.broadcast(req.socket.id, 'refreshTiles', {
				tiles: tiles
			});
		});
	}

	createTileSet: function() {
		var self = this;

		var tileSet = [];
		_.each(tileCounts, function(count, letter) {                                                                                                                                                                                         
			for (var i = 0; i < count; i++) {                                                                                                                                                                                                
				tileSet.push(letter);                                                                                                                                                                                                   
			}                                                                                                                                                                                                                                
		});

		// 2 random tiles to make the total 100
		tileSet.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
		tileSet.push(alphabet[Math.floor(Math.random() * alphabet.length)]);                                                                                                                                                            
		
		var tileIndexes = [];
		for (var i = 0; i < 100; i++) {
			tileIndexes.push(i);
		}

		return {
			tileSet: tileSet,
			tileIndexes: tileIndexes
		};
	},

	startCountdown: function(room, game, tileData) {
		var self = this;

		var countdown = 10;
		var interval = setInterval(function() {                                                                                                                                                                                              
			if (tileData.tileIndexes.length === 0) {
				clearInterval(interval);                                                                                                                                                                                                     
			}                                                                                                                                                                                                                                
																																																											 
			sails.sockets.broadcast(room.id, 'updateCountdown', {                                                                                                                                                                            
				seconds: countdown                                                                                                                                                                                       
			});                                                                                                                                                                                                                              
																																																											 
			if (countdown === 0) {                                                                                                                                                                                                           
				var randIndex = Math.floor(Math.random() * tileData.tileIndexes.length);
				var randLetterIndex = Math.floor(Math.random() * tileData.tileSet.length);

				sails.sockets.broadcast(room.id, 'addTile', {
					tileIndex: tileData.tileIndexes[randIndex],
					tileLetter: tileData.tileSet[randLetterIndex]
				});                                                                                                                                                                                                                          
			
				Gametile.create({ 
					game: game,
					letter: tileData.tileSet[randLetterIndex],
					pos: tileData.tileIndexes[randIndex]
				}).exec(function(err, tile) {
				});

				tileData.tileIndexes.splice(randIndex, 1);
				tileData.tileSet.splice(randLetterIndex, 1);

				countdown = 10;                                                                                                                                                                                                              
			}                                                                                                                                                                                                                                
			else {                                                                                                                                                                                                                           
				countdown--;                                                                                                                                                                                                                 
			}                                                                                                                                                                                                                                
		}, 100);
	}
*/
};

