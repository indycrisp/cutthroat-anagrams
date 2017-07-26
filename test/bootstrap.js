var sails = require('sails');
var _ = require('lodash');

global.chai = require('chai');
global.shoul = chai.should();

before(function(done) {
	this.timeout(5000);

	sails.lift({
		log: {
			level: 'silent'
		},
		hooks: {
			grunt: false
		},
		models: {
			connection: 'unitTestConnection',
			migrate: 'drop'
		},
		connections: {
			unitTestConnection: {
				adapter: 'sails-disk'
			}
		}
	}, function(err, server) {
		if (err) returndone(err);

		done(err, sails);
	});
});

after(function(done) {
	if (sails && _.isFunction(sails.lower)) {
		sails.lower(done);
	}
});
