/* global GameService */

var _ = require('lodash');
require('../../bootstrap');

describe('The GameService', function() {
	before(function(done) {
		done();
	});

	it('test mapWordToObj', function(done) {
		var wordModule = GameService.word;
		var testStr1 = 'aaa';
		var testStr2 = 'asdasd';
		var testStr3 = '';
		var testStr4 = 'asd asd';

		var result1 = wordModule.mapWordToObj(testStr1, 0);
		var result2 = wordModule.mapWordToObj(testStr2, 0);
		var result3 = wordModule.mapWordToObj(testStr3, 0);
		var result4 = wordModule.mapWordToObj(testStr4, 0);

		result1.should.be.an('object');
		_.keys(result1).should.have.length(2);
		result1['a'].should.equal(3);
		result1['ind'].should.equal(0);

		result2.should.be.an('object');
		_.keys(result2).should.have.length(4);
		result2['a'].should.equal(2);
		result2['s'].should.equal(2);
		result2['d'].should.equal(2);

		result3.should.be.an('object');
		var emptyKeys = _.keys(result3);
		emptyKeys.should.have.length(1);

		result4.should.be.an('object');
		_.keys(result4).should.have.length(5);
		result4['a'].should.equal(2);
		result4['s'].should.equal(2);
		result4['d'].should.equal(2);
		result4[' '].should.equal(1);

		done();
	});

	it('test subtractWordObjects', function(done) {
		var wordModule = GameService.word;
		var testObj1 = {
			'a': 2,
			'b': 1,
			'c': 3
		};

		var testObj2 = {
			'a': 3,
			'b': 5,
			'c': 3
		};

		var result1 = wordModule.subtractWordObjects(testObj1, testObj2);
		var result2 = wordModule.subtractWordObjects(testObj2, testObj1);

		(result1 == null).should.be.true;

		result2.should.be.an('object');
		_.keys(result2).should.have.length(2);
		result2['b'].should.equal(4);
		result2['a'].should.equal(1);
		(result2['c'] == null).should.be.true;

		done();
	});

	it('test findCombination', function(done) {
		var wordModule = GameService.word;

		var convert = function(letter) {
			if (letter.length > 1) {
				return { 'word' : letter };
			}
			else {
				return { 'letter' : letter };
			}
		};

		var testWord = 'hat';
		var testTiles1 = [];
		var testTiles2 = ['h', 'a', 't'];
		var testTiles3 = ['t', 'h', 'a'];
		var testTiles4 = ['b', 't', 'h', 'b'];

		var result1 = wordModule.findCombination(testWord, _.map(testTiles1, convert));
		var result2 = wordModule.findCombination(testWord, _.map(testTiles2, convert));
		var result3 = wordModule.findCombination(testWord, _.map(testTiles3, convert));
		var result4 = wordModule.findCombination(testWord, _.map(testTiles4, convert));

		(result1 == undefined).should.be.true;
		result2.should.have.length(3);
		result2.sort().should.eql([0, 1, 2]);

		result3.should.have.length(3);
		result3.sort().should.eql([0, 1, 2]);

		(result4 == undefined).should.be.true;

		var testWord2 = 'anticipate';
		var testTiles5 = ['tape', 'cant', 'i', 'i'];
		var testTiles6 = ['tape', 'i', 'n', 'matter', 'i', 'poop', 'cant'];
		var testTiles7 = ['tap', 'e', 'i', 'n', 'tape', 'i', 'cant'];
		var result5 = wordModule.findCombination(testWord2, _.map(testTiles5, convert));
		var result6 = wordModule.findCombination(testWord2, _.map(testTiles6, convert));
		var result7 = wordModule.findCombination(testWord2, _.map(testTiles7, convert));

		result5.should.have.length(4);
		result5.sort().should.eql([0, 1, 2, 3]);

		result6.should.have.length(4);
		result6.sort().should.eql([0, 1, 4, 6]);

		result7.should.have.length(4);
		result7.sort().should.eql([2, 4, 5, 6]);
	
		var testWord3 = 'whatever';
		var testTiles8 = ['w', 'h', 'a', 't', 'e', 'v', 'e', 'r', 'w', 'h', 'a', 't', 'e', 'v', 'e', 'r', 'w', 'h', 'a', 't', 'e', 'v', 'e', 'r', 'w', 'h', 'a', 't', 'e', 'v', 'e', 'r', 'w', 'h', 'a', 't', 'e', 'v', 'e', 'r'];

		var result8 = wordModule.findCombination(testWord3, _.map(testTiles8, convert));
		result8.should.have.length(8);

		done();
	});
});
