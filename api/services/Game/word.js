var _ = require('lodash');
var Promise = require('bluebird');
var checkWord = require('check-word');
words = checkWord('en');

module.exports = {
	guessWord: function(user, msg) {
		var self = this;

		// Skip words less than 3 letters or with spaces
		var trimmedMsg = msg.trim();
		if (trimmedMsg.length < 3 || /\s/.test(trimmedMsg)) { return Promise.resolve() }
		
		// Skip non-dictionary words
		var word = trimmedMsg.toLowerCase();	
		if (!words.check(word)) return Promise.resolve();

		return Promise.all([
			Gametile.find({ game: user.game.id, claimed: false }),
			Gameword.find({ game: user.game.id })
		]).spread(function(
			unclaimedGameTiles,
			gameWords
		) {
			//TODO: remove other forms of the guessed word from the set of claimedWords
			//var validClaimedWords = self.removeWordForms(word, claimedWords);
			var validClaimedWords = _.remove(gameWords, function(gameWord) {	
				return gameWord.word.length < word.length;
			});

			var tilesAndWords = unclaimedGameTiles.concat(validClaimedWords);
			var validTileCombination = self.findCombination(word, tilesAndWords);
			if (!validTileCombination || !validTileCombination.length) return false;
			
			var tilesToRemove = [];
			var wordsToRemove = [];
			_.each(validTileCombination, function(ind) {
				if (tilesAndWords[ind].letter) {
					tilesToRemove.push(tilesAndWords[ind]);
				}
				else {
					wordsToRemove.push(tilesAndWords[ind]);
				}
			});

			return Promise.all([
				self.addPlayerWord(user, word, wordsToRemove),
				self.removePlayerWords(user, wordsToRemove),
				self.removeGameTiles(tilesToRemove)
			]).spread(function(
				playerWordData,
				removedWordData,
				removedTiles
			) {
				GameService.events.addWordToPlayer(user, playerWordData.playerWord, playerWordData.userGame, removedWordData, removedTiles);
			});
		});
	},

	mapWordToObj: function(str, ind) {
		var self = this;

		var obj = { ind: ind };
		for (var i = 0; i < str.length; i++) {
			var letter = str.charAt(i);
			obj[letter] = (letter in obj) ? obj[letter] + 1: 1;
		}

		return obj;
	},

	subtractWordObjects: function(a, b) {
		var self = this;

		var result = {};

		for (var i = 97; i < 123; i++) {
			var letter = String.fromCharCode(i);
			var diff = (a[letter] || 0) - (b[letter] || 0);

			if (diff < 0) return null;

			if (diff > 0) {
				result[letter] = diff;
			}
		}

		return result;
	},

	findCombination: function(guess, tilesAndWords) {
		var self = this;

		var validCombo = [];
		var mappedTiles = [];

		var tilesAndWordsObj = [];
		for (var i = 0; i < tilesAndWords.length; i++) {
			var letter = tilesAndWords[i].letter;
			var word = tilesAndWords[i].word;

			if (word && word.toLowerCase() == guess) continue;

			tilesAndWordsObj.push({
				word: letter ? letter.toLowerCase() : word.toLowerCase(),
				ind: i
			});
		}

		// TODO: sort by the "value" of the word; value being the score of the player holding the word
		tilesAndWordsObj.sort(function(a, b) {
			return b.word.length - a.word.length || a.word.localeCompare(b.word);
		});

		for (var i = 0; i < tilesAndWordsObj.length; i++) {
			mappedTiles[i] = self.mapWordToObj(tilesAndWordsObj[i].word, tilesAndWordsObj[i].ind);
		}

		var recursiveFind = function(key, i) {
			if (i == mappedTiles.length) return false;

			// subtract the tile/word from the guessed word; if it's not subtractable, move on to the next tile/word
			// ex: key='the', mappedTiles = ['t', 'h', 'e'] is subtractable, returns empty obj
			var mappedIndex = mappedTiles[i].ind;
			delete mappedTiles[i].ind;

			var result = self.subtractWordObjects(key, mappedTiles[i]);
			if (result == null) return recursiveFind(key, i + 1);
			
			// if it was subtractable, this index is part of the valid combination
			validCombo.push(mappedIndex);
			
			// if result is empty, we've found all of the letters of the guessed word, return true
			// otherwise, test the next tile/word 
			if (_.keys(result).length == 0 || recursiveFind(result, i + 1)) return true;
			
			validCombo.pop();
			
			return recursiveFind(key, i + 1);
		};

		if (recursiveFind(self.mapWordToObj(guess), 0)) return validCombo;

		return;
	},

	addPlayerWord: function(user, word, wordsToRemove) {
		var self = this;

		var letterRemoveCount = 0;
		_.each(wordsToRemove, function(removedWord) {
			if (removedWord.user == user.id) {
				letterRemoveCount += removedWord.word.length;
			}
		});

		var newGameWord;
		return Gameword.create({
			game: user.game.id,
			word: word.toUpperCase(),
			user: user.id
		})
		.then(function(gameWord) {
			newGameWord = gameWord;
			return Usergame.findUserGames({ user: user.id, game: user.game.id });
		})
		.then(function(userGames) {
			var userGame = userGames[0];
			var value = userGame.score + word.length - letterRemoveCount;
			return Usergame.update({ id: userGame.id }, { score: value });
		})
		.then(function(updatedUserGames) {
			return {
				playerWord: newGameWord,
				userGame: updatedUserGames[0]
			};
		});
	},

	removePlayerWords: function(user, words) {
		var self = this;

		if (!words || !words.length) return;

		var removedWords = [];
		return Gameword.destroy({ id: _.map(words, 'id') })
		.then(function(gameWords) {
			removedWords = gameWords;
			return Usergame.findUserGames({ game: gameWords[0].game });
		})
		.then(function(userGames) {
			var playerWordData = {};
			_.each(removedWords, function(removedWord) {
				if (removedWord.user != user.id) {
					if (!playerWordData[removedWord.user]) playerWordData[removedWord.user] = [];
					playerWordData[removedWord.user].push(removedWord);
				}
			});

			var updates = [];
			_.each(userGames, function(userGame) {
				var wordData = playerWordData[userGame.user.id];
				var score = userGame.score;
				var updated = false;
				if (wordData && wordData.length) {
					_.each(wordData, function(word) {
						score -= word.word.length;
					});

					updated = true;
				}

				if (updated) {
					var updateUserGamePromise = Usergame.update({ id: userGame.id }, { score: score });
					updates.push(updateUserGamePromise);
				}
			});
			
			return Promise.map(updates, function(data) { return data; });
		})
		.then(function(updatedUserGames) {
			return {
				removedWords: removedWords,
				userGames: _.map(updatedUserGames, function(updatedGame) { return updatedGame[0]; })
			};
		});
	},

	removeGameTiles: function(tiles) {
		var self = this;

		var ids = _.map(tiles, 'id');
		return Gametile.update(ids, { claimed: true });
	}
};
