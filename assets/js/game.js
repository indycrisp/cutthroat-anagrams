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

		updateUserList: function(data) {
			//TODO: template
			$('#users').empty();
			var msg = '';
			if (data.users.length) {
				//TODO: lodash _.each
				for (var i=0; i<data.users.length; i++) {
					msg += "<div>" + data.users[i] + "</div>";
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

		refreshTiles: function(data) {
			//TODO: lodash _.each
			if (!data.tiles) return;

			for (var i=0; i<data.tiles.length; i++) {
				$('#tile-' + data.tiles[i].pos).html(data.tiles[i].letter);
			}
		}
	};
});
