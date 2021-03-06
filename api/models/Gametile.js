/**
 * Gametile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		game: {                                                                                                                                                                                                    
			model: 'Game'                                                                                                                                                                                                                    
		},
		letter: {
			type: 'string',
			maxLength: 1
		},
		pos: {
			type: 'integer'
		},
		claimed: {
			type: 'boolean',
			defaultsTo: false
		}
	}
};

