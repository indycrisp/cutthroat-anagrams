module.exports = {
	leaveRoom: function(user) {
		var self = this;

		return User.update({ id: user.id }, { room: undefined })
		.then(function(updatedUsers) {
			return Room.findRooms({ id: user.room });
		});
	}
};
