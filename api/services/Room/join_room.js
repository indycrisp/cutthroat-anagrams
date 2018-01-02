var _ = require('lodash');                                                                                                                                                                                                                   
var Promise = require('bluebird');                                                                                                                                                                                                           
																																																											 
module.exports = {                                                                                                                                                                                                                           
	
	// Add a user to a room, then return the updated user model
	joinRoom: function(user, roomId) {
		return User.update({ id: user.id }, { room: roomId })
		.then(function(users) {
			return User.findUsers({ id: user.id });
		});
	}
};
