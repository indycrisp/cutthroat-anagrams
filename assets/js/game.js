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
			var msg = "<div>"
				+ currentDate.getHours() 
				+ ":" + ('0' + currentDate.getMinutes()).slice(-2)
				+ ":" + ('0' + currentDate.getSeconds()).slice(-2)
				+ " " + message.from
				+ ": " + message.msg + "</div>";

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
				for (var i=0; i<data.users.length; i++) {
					msg += "<div>" + data.users[i] + "</div>";
				}
			}
	
			$('#users').append(msg);
		}
	};
});
