var test = require('./test');
	
test.init();

io.socket.on('connect', function socketConnected() {

});

io.socket.on('chat', function messageReceived(message) {
	test.receiveMessage(message.data);
});

io.socket.on('message', function(data) {

});

io.socket.on('disconnect', function() {

});
