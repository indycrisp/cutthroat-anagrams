/**
 * User.js
 *
 * @description :: TODO.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {  
	attributes: {
		email: {
			type: 'email',
			//required: true,
			//unique: true
		},
		username: {
			type: 'string',
			required: true,
			unique: true
		},
		password: {
			type: 'string',
			required: true,
			minLength: 6
		},
		game: {
			model: 'Game'
		},
		room: {
			model: 'Room'
		},
		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
	},

	findUsers: function(args) {
		var self = this;

		var findFunction;
		if (args.id || args.email || args.username) {
			findFunction = User.findOne(args);
		}
		else {
			findFunction = User.find(args);
		}

		return findFunction
			.populate('game')
			.populate('room')
		;

	},

	attemptRegister: function(user, cb) {
		User.findOne({ username: user.username }).exec(cb);
	},
	
	attemptLogin: function(user, cb) {
		User.findOne({ username: user.username }).exec(cb);
	}
};

