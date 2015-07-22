'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var words = require('../../app/controllers/words.server.controller');

	// Words Routes
	app.route('/words')
		.get(words.list)
		.post(users.requiresLogin, words.create);

	app.route('/words/:wordId')
		.get(words.read)
		.put(users.requiresLogin, words.hasAuthorization, words.update)
		.delete(users.requiresLogin, words.hasAuthorization, words.delete);

	// Finish by binding the Word middleware
	app.param('wordId', words.wordByID);
};
