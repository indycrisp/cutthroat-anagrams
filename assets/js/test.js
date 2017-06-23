define([
	'./test2'
], function(
	test2
) {
	return {	
		init: function() {
			io.socket.post('/user/connect', {
				username: username
			});

			$('#chat-input').keyup(function (event) {
				if (event.keyCode == 13) {
					var msg = $(event.target).val();
					io.socket.post('/user/chat', {
						sender: 'lala',
						msg: msg
					});
				}
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

			$('#chat').append(msg);
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
