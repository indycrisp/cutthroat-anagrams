/**
 * Usergame.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		user: {
			model: 'User'
		},
		game: {
			model: 'Game'
		},
		score: {
			type: 'integer',
			defaultsTo: 0
		},
		rank: {
			type: 'integer'
		},
		color: {
			type: 'string'
		}
	},

	findUserGames: function(args) {
		var self = this;

		var findFunction;
		if (args.id) {
			findFunction = Usergame.findOne(args);
		}
		else {
			findFunction = Usergame.find(args);
		}

		return findFunction
			.populate('user')
			.populate('game')
		;
	}
};

