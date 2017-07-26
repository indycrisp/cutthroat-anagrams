/**
 * Gameword.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		game: {
			model: 'game'
		},
		word: {
			type: 'string',
			minLength: 3
		},
		user: {
			model: 'user'
		}
	},

	findGameWords: function(args) {
		var self = this;

		var findFunction;
		if (args.id) {
			findFunction = Gameword.findOne(args);
		}
		else {
			findFunction = Gameword.find(args);
		}

		return findFunction
			.populate('game')
			.populate('user')
		;
	}
};

