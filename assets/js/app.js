require([
	'./game',
	'./login',
	'./utils'
], function(
	game,
	login,
	Utils
) {
	io.socket.get('/current_user', function(user) {
		if (user && user.id) {
			game.init(user);
		}
		else {
			game.refreshGameState();
			game.handleResize();
			login.init();
		}

		io.socket.on('chat', function messageReceived(data) {
			game.receiveChat(data);
		});

		io.socket.on('userDisconnect', function(data) {
			game.userDisconnect(data);
		});

		io.socket.on('userLeave', function(data) {
			game.userLeave(data);
		});

		io.socket.on('updateCountdown', function(data) {
			game.updateCountdown(data);
		});

		io.socket.on('addTile', function(data) {
			game.addTile(data);
		});

		io.socket.on('refreshGameState', function(data) {
			game.refreshGameState(data);
		});

		io.socket.on('refreshTiles', function(data) {
			game.refreshTiles(data);
		});

		io.socket.on('refreshPlayerWords', function(data) {
			game.refreshPlayerWords(data);
		});

		io.socket.on('removeTiles', function(data) {
			game.removeTiles(data);
		});

		io.socket.on('addWordToPlayer', function(data) {
			game.addWordToPlayer(data);
		});

		io.socket.on('message', function(data) {
		});

		io.socket.on('endGame', function(data) {
			game.endGame(data);
		});

	});
});
