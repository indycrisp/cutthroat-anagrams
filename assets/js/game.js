//TODO: use LESS
define([
	'../styles/gameroom.css'
], function(
	gamestyles
) {
	return {	
		init: function(user) {
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
			//TODO: template it
			var msg = "<div class='chat-message'>"
				+ currentDate.getHours() 
				+ ":" + ('0' + currentDate.getMinutes()).slice(-2)
				+ ":" + ('0' + currentDate.getSeconds()).slice(-2)
				+ " " + message.from
				+ ": " + "<span class='chat-text'>" + message.msg + "</span></div>";

			var chatBox = $('#chat');
			chatBox.append(msg);
			var chatHeight = chatBox[0].scrollHeight;
			chatBox.scrollTop(chatHeight);
		},

		refreshUserList: function(data) {
			//TODO: template
			$('#users').empty();
			var msg = '';
			if (data.users.length) {
				//TODO: lodash _.each
				for (var i=0; i<data.users.length; i++) {
					//TODO: make sure we have user ID here for word container ID
					msg += "<div>" + data.users[i].email + "<div class='words-container' id='user-" + data.users[i].id + "'></div></div>";
				}
			}
	
			$('#users').append(msg);
		},

		updateCountdown: function(data) {
			$('#countdown').html(data.seconds);
		},

		addTile: function(data) {
			$('#tile-' + data.tileIndex).html(data.tileLetter);
		},

		refreshGameState: function(data) {
			var self = this;

			self.refreshUserList({ users: data.users });
			self.refreshTiles({ tiles: data.tiles });	
			self.refreshPlayerWords({
				users: data.users,
				words: data.words
			});
		},

		refreshTiles: function(data) {
			//TODO: lodash _.each
			if (!data.tiles) return;

			for (var i=0; i<data.tiles.length; i++) {
				var tileCell = $('#tile-' + data.tiles[i].pos);
				if (data.tiles[i].claimed) {
					tileCell.addClass('greyed');
				}
				else {
					tileCell.html(data.tiles[i].letter);
				}
			}
		},

		refreshPlayerWords: function(data) {
			if (!data.users || !data.users.length) return;

			//TODO: lodash _.each
			for (var i=0; i<data.users.length; i++) {
				var playerWords = data.words[data.users[i].id];
				if (!playerWords) continue;

				var wordContainer = $('#user-' + data.users[i].id);
				var newWordContainer = "<div class='words-container' id='user-" + data.users[i].id + "'>";
				for (var j=0; j<playerWords.length; j++) {
					//TODO: template
					newWordContainer += "<div id='player-word-" + playerWords[j].id + "' class='player-word'>" + playerWords[j].word + "</div>";
					//wordContainer.append(wordDiv);
				}

				newWordContainer += "</div>";
				wordContainer.replaceWith(newWordContainer);
			}
		},

		removeTiles: function(data) {
			if (!data.tiles) return;

			//TODO: lodash _.each
			for (var i=0; i<data.tiles.length; i++) {
				var tile = $('#tile-' + data.tiles[i].pos);
				tile.html('');
				tile.addClass('greyed');
			}
		},

		addWordToPlayer: function(data) {
			if (!data.user || !data.word) return;

			//TODO: use user ID instead of email
			//TODO: template
			var wordContainer = $('#user-' + data.user.id);
			var wordDiv = "<div id='player-word-" + data.word.id + "' class='player-word'>" + data.word.word + "</div>";
			wordContainer.append(wordDiv);
		},

		removeWordsFromPlayers: function(data) {
			if (!data.words) return;

			//TODO: lodash _.each
			for (var i=0; i<data.words.length; i++) {
				var id = data.words[i].id;
				$("#player-word-" + id).remove();
			}
		}
	};
});
