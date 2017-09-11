//TODO: use LESS
define([
	'../styles/gameroom.css',
	'lodash'
], function(
	gamestyles,
	_
) {
	return {	
		init: function(user) {
			//TODO: Have the controller do the "joining" before the rendering (res.view())
			io.socket.post('/user/join', function(err) {
				$('#chat-input').keyup(function (event) {
					if (event.keyCode == 13) {
						var msg = $(event.target).val();
						if (msg) {
							io.socket.post('/user/chat', {
								sender: user.email,
								msg: msg
							});

							$(event.target).val('');
						}
					}
				});
			});
		},

		receiveMessage: function(message) {
			var currentDate = new Date();
			var html = JST['assets/templates/chat_message.ejs']({
				hour: currentDate.getHours(),
				minute: ('0' + currentDate.getMinutes()).slice(-2),
				second: ('0' + currentDate.getSeconds()).slice(-2),
				username: message.from,
				message: message.msg
			});

			var chatBox = $('#chat');
			chatBox.append(html);
			var chatHeight = chatBox[0].scrollHeight;
			chatBox.scrollTop(chatHeight);
		},
		
		updateCountdown: function(data) {
			$('#countdown').html(data.seconds);
		},

		addTile: function(data) {
			$('#tile-' + data.tileIndex).html(data.tileLetter);
		},

		userDisconnect: function(data) {
			var userStatus = $('#user-status-' + data.user.id);
			var newStatus = JST['assets/templates/user_status.ejs']({
				userId: data.user.id,
				userStatus: 'disconnected'
			});

			userStatus.replaceWith(newStatus);
		},

		refreshGameState: function(data) {
			var self = this;

			self.refreshTiles({ tiles: data.tiles });	
			self.refreshPlayerWords({
				users: data.users,
				words: data.words
			});
		},

		refreshTiles: function(data) {
			if (!data.tiles) return;

			_.each(data.tiles, function(tile) {
				var tileCell = $('#tile-' + tile.pos);
				if (tile.claimed) {
					tileCell.addClass('greyed');
				}
				else {
					tileCell.html(tile.letter);
				}
			});
		},

		refreshPlayerWords: function(data) {
			if (!data.users || !data.users.length) return;

			var usersHTML = '';
			_.each(data.users, function(user) {
				var playerWords = data.words[user.id];
				if (!playerWords) playerWords = [];

				var wordContainer = $('#user-word-container-' + user.id);
				var newWordContainer = JST['assets/templates/word_container.ejs']({
					username: user.email,
					userId: user.id,
					userStatus: user.room ? 'connected' : 'disconnected',
					words: playerWords,
					wordTemplate: JST['assets/templates/word.ejs']
				});

				usersHTML += newWordContainer;
			});

			$('#users').html(usersHTML);
		},

		removeTiles: function(data) {
			if (!data.tiles) return;

			_.each(data.tiles, function(tile) {
				var tile = $('#tile-' + tile.pos);
				tile.html('');
				tile.addClass('greyed');
			});
		},

		addWordToPlayer: function(data) {
			if (!data.user || !data.word) return;

			var wordContainer = $('#user-' + data.user.id);
			var wordDiv = JST['assets/templates/word.ejs']({
				word: data.word
			});

			wordContainer.append(wordDiv);
		},

		removeWordsFromPlayers: function(data) {
			if (!data.words) return;

			_.each(data.words, function(word) {
				$("#player-word-" + word.id).remove();
			});
		}
	};
});
