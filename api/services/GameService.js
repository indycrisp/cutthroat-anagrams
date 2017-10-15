//TODO: rename join_game to connect_game?
module.exports = {
	join_game: require('./game/join_game'),
	start_game: require('./game/start_game'),
	end_game: require('./game/end_game'),
	word: require('./game/word'),
	chat: require('./game/chat'),
	events: require('./game/events')
};
