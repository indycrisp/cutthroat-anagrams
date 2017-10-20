/**
 * Chathistory.js
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
		text: {
			type: 'string'
		}
	},

	findChatHistory: function(args) {
		var self = this;

		var findFunction;
		if (args.id) {
			findFunction = Chathistory.findOne(args);
		}
		else {
			findFunction = Chathistory.find(args);
		}

		return findFunction
			.populate('game')
			.populate('user')
		;
	}
};

