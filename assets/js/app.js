var game = require('./game');

io.socket.on('connect', function socketConnected(socket) {
	io.socket.get('/current_user', function(user) {
		window.user = user;

		game.init(user);
	
		io.socket.on('chat', function messageReceived(message) {
			game.receiveMessage(message);
		});

		io.socket.on('updateUserList', function(users) {
			game.updateUserList(users);
		});

		io.socket.on('message', function(data) {
		});
	});
});
