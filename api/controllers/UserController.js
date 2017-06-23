/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var users = [];
module.exports = {

	// Send a chat
	chat: function(req, res) {
		sails.io.sockets.emit("chat", {
			verb: "messaged",
			data: {
				from: req.param('sender'),
				msg: req.param('msg')
			}
		});
	},

	connect: function(req, res) {
		var username = req.param('username');
	
		if (!users.includes(username)) {
			users.push(username);
		}

		sails.io.sockets.emit("updateUserList", {
			verb: "updateUserList",
			data: {
				users: users
			}
		});
	}
};

