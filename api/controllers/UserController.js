/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
	}	
};

