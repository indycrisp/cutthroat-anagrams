webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__.e/* require */(1).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [
	__webpack_require__(2)
]; (function(
	test2
) {
	var self;

	return {	
		init: function() {
			self = this;

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
		}
	};
}.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);


/***/ })
]);