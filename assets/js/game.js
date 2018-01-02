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
			var self = this;

			self.user = user;

			//TODO: Have the controller do the "joining" before the rendering (res.view())
			io.socket.post('/user/join', function(err) {
				self.attachListeners();
			});
	
			self.handleResize();
		},

		attachListeners: function() {
			var self = this;

			$(window).resize(function() {
				self.handleResize();
			});

			$('.new-game-button').off('click').click(function() {
				io.socket.post('/user/leaveGame', { userId: self.user.id }, function(err) {
					io.socket.post('/user/join', { userId: self.user.id });	
				});
			});

			$('.logout-button').off('click').click(function() {
				var userId = self.user.id;
				self.user = undefined;
				io.socket.post('/logout', { userId: userId }, function(data) {
					if (data && data.success) {
						document.location.reload();
					}
				});
			});

			$('.chat-input').keyup(function(event) {
				if (event.keyCode == 13) {
					var msg = $(event.target).val();
					if (msg) {
						io.socket.post('/user/chat', {
							sender: self.user.username,
							msg: msg
						});

						$(event.target).val('');
					}
				}
			});
		},


		handleResize: function() {
			var tileContainer = $('.tiles-container');
			var tileHeight = tileContainer.height();
			tileContainer.width(tileHeight);
			$('.chat-container').width(tileHeight);

			var bodyWidth = $('body').width();
			if (!bodyWidth) return;

			var newMiddleColumnWidth = tileHeight;
			var newSideColumnWidth = (bodyWidth - newMiddleColumnWidth ) / 2;
			$('.column-left,.column-right').width(newSideColumnWidth);
			$('.column-middle').width(newMiddleColumnWidth);
			
		},

		receiveChat: function(data) {
			var createdDate = new Date(data.createdDate);
			var html = JST['assets/templates/chat_message.ejs']({
				hour: ('0' + createdDate.getHours()).slice(-2),
				minute: ('0' + createdDate.getMinutes()).slice(-2),
				second: ('0' + createdDate.getSeconds()).slice(-2),
				username: data.user,
				message: data.text
			});

			var chatBox = $('.chat');
			chatBox.append(html);
			var chatHeight = chatBox[0].scrollHeight;
			chatBox.scrollTop(chatHeight);
		},
		
		updateCountdown: function(data) {
			$('.countdown').html(data.seconds);
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

		userLeave: function(data) {
			var userStatus = $('#user-status-' + data.user.id);
			var newStatus = JST['assets/templates/user_status.ejs']({
				userId: data.user.id,
				userStatus: 'left'
			});

			userStatus.replaceWith(newStatus);
		},


		refreshGameState: function(data) {
			var self = this;

			self.refreshChat({ chat: data ? data.chat : []  });
			self.refreshTiles({ tiles: data ? data.tiles : [] });	
			self.refreshUserBoard({
				users: data ? data.users : [],
				words: data ? data.words : []
			});

			self.refreshMenu({ game: data ? data.game : [] });
			self.attachListeners();
		},

		refreshChat: function(data) {
			var self = this;

			var chat = data.chat;
			var chatBox = JST['assets/templates/chat_box.ejs']();
			$('.chat-container').html(chatBox);

			_.each(data.chat, function(chatMessage) {
				self.receiveChat({
					createdDate: chatMessage.createdAt,
					text: chatMessage.text,
					user: chatMessage.user.username
				});
			});
		},

		refreshTiles: function(data) {
			if (!data.tiles) return;

			var tileTable = JST['assets/templates/tile_table.ejs']();
			$('.tiles-container').html(tileTable);

			//TODO: is this overkill? loop through each tile, check if data.tiles has
			//something.  if it does, use that value, otherwise clear it
			$('.tile').removeClass('greyed').html('');
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

		refreshUserBoard: function(data) {
			if (!data.users || !data.users.length) return;

			var userBoardLeftContainer = JST['assets/templates/user_board.ejs']({
				side: 'left'
			});

			var userBoardRightContainer = JST['assets/templates/user_board.ejs']({
				side: 'right'
			});

			$('.users-container-left').html(userBoardLeftContainer);
			$('.users-container-right').html(userBoardRightContainer);
			var usersLeftHTML = '';
			var usersRightHTML = '';
			var i=0;
			_.each(data.users, function(user) {
				var playerWords = data.words[user.id];
				if (!playerWords) playerWords = [];

				var wordContainer = $('#user-word-container-' + user.id);
				var newWordContainer = JST['assets/templates/word_container.ejs']({
					username: user.username,
					userId: user.id,
					userStatus: user.room ? 'connected' : 'disconnected',
					words: playerWords,
					wordTemplate: JST['assets/templates/word.ejs']
				});

				if (i % 2 === 0) {
					usersLeftHTML += newWordContainer;
				}
				else {
					usersRightHTML += newWordContainer;
				}
				i++;
			});

			$('.users-left').html(usersLeftHTML);
			$('.users-right').html(usersRightHTML);
		},

		refreshMenu: function(data) {
			var self = this;

			if (!data.game || !self.user) return;

			var menuRightContent = JST['assets/templates/menu_right.ejs']({
				gameCompleted: data.game.completed
			});

			var menuLeftContent = JST['assets/templates/menu_left.ejs']();

			$('.menu-container-right').html(menuRightContent);
			$('.menu-container-left').html(menuLeftContent);
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
		},

		endGame: function(data) {
			$('.new-game-button').removeClass('menu-button-hidden');
		}
	};
});
