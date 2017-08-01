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
			
			var tilesAndWords = unclaimedGameTiles.concat(gameWords);
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
				self.addPlayerWord(user, word),
				self.removePlayerWords(wordsToRemove),
				self.removeGameTiles(tilesToRemove)
			]).spread(function(
				playerWord,
				removedWords,
				removedTiles
			) {
				GameService.events.removeTiles(user, removedTiles);
				GameService.events.addWordToPlayer(user, playerWord);

				if (removedWords.length) {
					GameService.events.removeWordsFromPlayers(user, removedWords);				
				}
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

	addPlayerWord: function(user, word) {
		var self = this;

		return Gameword.create({
			game: user.game.id,
			word: word.toUpperCase(),
			user: user.id
		});
	},

	removePlayerWords: function(words) {
		var self = this;

		var ids = _.map(words, 'id');
		return Gameword.destroy({ id: ids });
	},

	removeGameTiles: function(tiles) {
		var self = this;

		var ids = _.map(tiles, 'id');
		return Gametile.update(ids, { claimed: true });
	}
};
