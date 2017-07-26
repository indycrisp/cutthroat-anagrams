var game = require('./game');

io.socket.on('connect', function socketConnected(socket) {
	io.socket.get('/current_user', function(user) {
		window.user = user;
		var isGame = $('#game-container').length;
		if (!isGame) return;
		
		game.init(user);

		io.socket.on('chat', function messageReceived(message) {
			game.receiveMessage(message);
		});

		io.socket.on('updateUserList', function(users) {
			game.updateUserList(users);
		});

		io.socket.on('updateCountdown', function(data) {
			game.updateCountdown(data);
		});

		io.socket.on('addTile', function(data) {
			game.addTile(data);
		});

		io.socket.on('refreshTiles', function(data) {
			game.refreshTiles(data);
		});

		io.socket.on('message', function(data) {
		});
	});
});
