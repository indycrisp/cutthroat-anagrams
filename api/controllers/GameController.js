/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	viewGame: function(req, res) {
		res.view('game.ejs', { title: 'Cutthroat' });
	}	
};

