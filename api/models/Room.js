/**
 * Room.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		users: {
			collection: 'User',
			via: 'room'
		},
		game: {
			model: 'Game'
		}
	},
	
	findRooms: function(args) {
		var self = this;

		var findFunction;
		if (args.id) {
			findFunction = Room.findOne(args);
		}
		else {
			findFunction = Room.find(args);
		}

		return findFunction
			.populate('users')
			.populate('game')
		;
	}
};

