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
	}
};

