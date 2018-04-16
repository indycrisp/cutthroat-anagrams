//TODO: use LESS
// hihi
define([
	'../styles/gameroom.css',
	'lodash',
	'./utils.js'	
], function(
	gamestyles,
	_,
	Utils
) {
	return {	
		init: function(user) {
			var self = this;

			self.user = user;
			self.animation = Promise.resolve();

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
				username: data.user.username,
				color: data.userColor,
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
			var tile = $('#tile-' + data.tileIndex);
			tile.html(data.tileLetter);
			tile.addClass('tile-activated');
			tile.animate({ backgroundColor: '' }, 500, function() {
				tile.removeClass('tile-activated');	
				
				// So that we can continue the change the color...
				tile.css("background-color", "");
			});
		},

		userDisconnect: function(data) {
			var userStatus = $('#user-status-' + data.user.id);
			var newStatus = JST['assets/templates/user_status.ejs']({
				userId: data.user.id,
				userStatus: 'disconnected'
			});

			$('#user-name-' + data.user.id).addClass('user-name-disconnected');
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
			self.refreshTiles({
				tiles: data ? data.tiles : [],
				game: data? data.game: []
			});

			self.refreshUserBoard({
				users: data ? data.users : [],
				words: data ? data.words : [],
				userGames: data ? data.userGames: []
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
					user: chatMessage.user,
					userColor: chatMessage.color
				});
			});
		},

		refreshTiles: function(data) {
			if (!data.tiles || !data.game) return;

			var tileTable = JST['assets/templates/tile_table.ejs']({
				gameCompleted: data.game.completed	
			});

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

				var userGame = _.find(data.userGames, function(userGame) {
					return userGame.user.id == user.id && userGame.game.id == user.game;
				});

				var wordContainer = $('#user-word-container-' + user.id);
				var newWordContainer = JST['assets/templates/word_container.ejs']({
					username: user.username,
					userId: user.id,
					userScore: userGame.score,
					userStatus: user.room ? 'connected' : 'disconnected',
					words: playerWords,
					wordTemplate: JST['assets/templates/word.ejs'],
					userStatusTemplate: JST['assets/templates/user_status.ejs']
				});

				if (i % 2 === 0) {
					usersLeftHTML += newWordContainer;
				}
				else {
					usersRightHTML += newWordContainer;
				}
				i++;
			});

			_.each($('.player-word'), function(playerWord) {
				var letterCount = 0;
				_.each($(playerWord).find('.player-letter'), function(playerLetter) {
					$(playerLetter).css('left', letterCount * $(playerLetter).height());
					letterCount++;
				});
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
			var self = this;
			if (!data.tiles) return;

			_.each(data.tiles, function(tile) {
				var tile = $('#tile-' + tile.pos);
				tile.html('');
				tile.addClass('greyed');
			});
		},

		endGame: function(data) {
			$('.tiles-table').addClass('blur');
			$('.new-game-button').removeClass('menu-button-hidden');
		},
		
		addWordToPlayer: function(data) {
			var self = this;
				
			self.animation = self.animation.then(function(resolveData) {
				return self._addWordToPlayer(data);
			});
		},

		_addWordToPlayer: function(data) {
			var self = this;

			var removedBoardLetters = self._getRemovedBoardLetters(data);
			var removedPlayerWordData = self._getRemovedPlayerWordData(data);

			var newWordDiv = self._getNewWordDiv(data, removedPlayerWordData);
			var removedLetters = removedBoardLetters.concat(removedPlayerWordData.removedPlayerLetters);
			
			var sortedRemovedTiles = self._getSortedRemovedTiles(data, removedLetters);

			var letterCount = 0;
			var animationPromises = [];
			_.each(sortedRemovedTiles, function(tile) {
				var tileDiv = tile.el;
				var newLetterDiv = JST['assets/templates/letter.ejs']({
					letter: tile.letter
				});

				var animationPromise;
				if (tile.type === 'letter' || !tile.isFirstCurrentPlayerWord) {
					var cloneClass = 'tile-clone';

					//TODO: ????
					animationPromise = Utils.cloneAndAnimateMove(tileDiv, newWordDiv, cloneClass, newLetterDiv, letterCount, tile.pos);
				}
				else {
					animationPromise = Utils.animateMove(tileDiv, letterCount);
				}

				if (tile.type == 'letter') {
					tileDiv.html('');
					tileDiv.addClass('greyed');
				}

				animationPromises.push(animationPromise);
				letterCount++;
			});

			self._removeTakenWords(data, removedPlayerWordData);
			self._updateScores(data);

			return Promise.all(animationPromises).then(function(data) {	
				return Promise.resolve();
			});
		},

		_updateScores: function(data) {
			var self = this;

			var userScoreContainer = $('#user-score-' + data.user.id);
			userScoreContainer.html(data.userGame.score);

			var otherUserGames = data.removedWordData ? data.removedWordData.userGames : [];
			_.each(otherUserGames, function(userGame) {
				console.log(userGame);
				var otherUserScoreContainer = $('#user-score-' + userGame.user);
				otherUserScoreContainer.html(userGame.score);
			});
		},

		_getSortedRemovedTiles: function(data, removedLetters) {
			var self = this;

			var word = data.word.word;
			var sortedRemovedTiles = [];
			for (var i = 0; i < word.length; i++) {
				var matchingIndex = _.findIndex(removedLetters, function(letter) {
					return letter.letter == word[i];
				});

				if (matchingIndex != -1) {
					sortedRemovedTiles.push(removedLetters[matchingIndex]);
					removedLetters.splice(matchingIndex, 1);
				}
			}

			return sortedRemovedTiles;
		},


		_getRemovedBoardLetters: function(data) {
			var self = this;

			var removedTiles = data.removedTiles ? _.clone(data.removedTiles) : [];
			var removedBoardLetters = [];
			_.each(removedTiles, function(tile) {
				removedBoardLetters.push({
					letter: tile.letter.trim(),
					el: $('#tile-' + tile.pos),
					type: 'letter',
					pos: 0
				});
			});
		
			return removedBoardLetters;
		},

		_getRemovedPlayerWordData: function(data) {
			var self = this;

			var removedWords = data.removedWordData ? _.clone(data.removedWordData.removedWords) : [];
			var removedPlayerWords = [];
			var removedPlayerLetters = [];
			var currentPlayerWords = [];
			_.each(removedWords, function(word) {
				var wordDiv = $('#player-word-' + word.id);
				removedPlayerWords.push(wordDiv);
			
				var isFirstCurrentPlayerWord = false;	
				if (word.user == data.user.id) {
					currentPlayerWords.push(word);
					if (currentPlayerWords.length == 1) {
						isFirstCurrentPlayerWord = true;
					}
				}
				
				var letterPosition = 0;
				_.each(wordDiv.find('.player-letter'), function(letterDiv) {
					removedPlayerLetters.push({
						letter: $(letterDiv).html().trim(),
						el: $(letterDiv),
						type: 'word',
						pos: letterPosition,
						isFirstCurrentPlayerWord: isFirstCurrentPlayerWord
					});

					letterPosition++;
				});	
			});

			return {
				removedPlayerWordDivs: removedPlayerWords,
				removedPlayerLetters: removedPlayerLetters,
				currentPlayerWords: currentPlayerWords
			};
		},

		_getNewWordDiv: function(data, removedWordData) {
			var self = this;

			var currentPlayerWords = removedWordData.currentPlayerWords;
			var wordDiv;
			if (currentPlayerWords.length) {
				var firstWord = currentPlayerWords[0];
				wordDiv = $('#player-word-' + firstWord.id);
				wordDiv.attr('id', 'player-word-' + data.word.id);
			}
			else {
				var newWordDiv = JST['assets/templates/word.ejs']({
					word: data.word,
					noLetters: true
				});

				var wordContainer = $('#user-' + data.user.id);
				wordContainer.append(newWordDiv);
				wordDiv = wordContainer.find('#player-word-' + data.word.id);
			}

			return wordDiv;
		},

		_removeTakenWords: function(data, removedWordData) {
			var self = this;

			var removedPlayerWords = data.removedWordData ? _.clone(data.removedWordData.removedWords) : [];
			var currentPlayerWords = removedWordData ? removedWordData.currentPlayerWords : [];
			var firstCurrentPlayerWord = currentPlayerWords[0];

			var removeableWords = [];
			_.each(removedPlayerWords, function(word) {
				if (word.user != data.user.id || word.id != firstCurrentPlayerWord.id) {
					removeableWords.push(word);
				}
			});

			_.each(removeableWords, function(word) {
				$('#player-word-' + word.id).remove();
			});
		}
	};
});
