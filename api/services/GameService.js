//TODO: rename join_game to connect_game?
module.exports = {
	join_game: require('./game/join_game'),
	start_game: require('./game/start_game'),
	rejoin_game: require('./game/rejoin_game'),
	word: require('./game/word'),
	events: require('./game/events')
};
