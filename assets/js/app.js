var test = require('./game');

io.socket.on('connect', function socketConnected(socket) {
	io.socket.get('/current_user', function(user) {
		window.user = user;

		test.init(user);
	
		io.socket.on('chat', function messageReceived(message) {
			test.receiveMessage(message);
		});

		io.socket.on('updateUserList', function(users) {
			test.updateUserList(users);
		});

		io.socket.on('message', function(data) {
		});
	});
});
