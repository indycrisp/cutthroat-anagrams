/**
 * User.js
 *
 * @description :: TODO.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');
module.exports = {  
	attributes: {
		email: {
			type: 'email',
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

	attemptRegister: function(user, cb) {
		User.findOne({ email: user.email }).exec(cb);
	},
	
	attemptLogin: function(user, cb) {
		User.findOne({ email: user.email }).exec(cb);
	}
};

