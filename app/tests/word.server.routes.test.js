'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Word = mongoose.model('Word'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, word;

/**
 * Word routes tests
 */
describe('Word CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Word
		user.save(function() {
			word = {
				name: 'Word Name'
			};

			done();
		});
	});

	it('should be able to save Word instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Word
				agent.post('/words')
					.send(word)
					.expect(200)
					.end(function(wordSaveErr, wordSaveRes) {
						// Handle Word save error
						if (wordSaveErr) done(wordSaveErr);

						// Get a list of Words
						agent.get('/words')
							.end(function(wordsGetErr, wordsGetRes) {
								// Handle Word save error
								if (wordsGetErr) done(wordsGetErr);

								// Get Words list
								var words = wordsGetRes.body;

								// Set assertions
								(words[0].user._id).should.equal(userId);
								(words[0].name).should.match('Word Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Word instance if not logged in', function(done) {
		agent.post('/words')
			.send(word)
			.expect(401)
			.end(function(wordSaveErr, wordSaveRes) {
				// Call the assertion callback
				done(wordSaveErr);
			});
	});

	it('should not be able to save Word instance if no name is provided', function(done) {
		// Invalidate name field
		word.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Word
				agent.post('/words')
					.send(word)
					.expect(400)
					.end(function(wordSaveErr, wordSaveRes) {
						// Set message assertion
						(wordSaveRes.body.message).should.match('Please fill Word name');
						
						// Handle Word save error
						done(wordSaveErr);
					});
			});
	});

	it('should be able to update Word instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Word
				agent.post('/words')
					.send(word)
					.expect(200)
					.end(function(wordSaveErr, wordSaveRes) {
						// Handle Word save error
						if (wordSaveErr) done(wordSaveErr);

						// Update Word name
						word.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Word
						agent.put('/words/' + wordSaveRes.body._id)
							.send(word)
							.expect(200)
							.end(function(wordUpdateErr, wordUpdateRes) {
								// Handle Word update error
								if (wordUpdateErr) done(wordUpdateErr);

								// Set assertions
								(wordUpdateRes.body._id).should.equal(wordSaveRes.body._id);
								(wordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Words if not signed in', function(done) {
		// Create new Word model instance
		var wordObj = new Word(word);

		// Save the Word
		wordObj.save(function() {
			// Request Words
			request(app).get('/words')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Word if not signed in', function(done) {
		// Create new Word model instance
		var wordObj = new Word(word);

		// Save the Word
		wordObj.save(function() {
			request(app).get('/words/' + wordObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', word.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Word instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Word
				agent.post('/words')
					.send(word)
					.expect(200)
					.end(function(wordSaveErr, wordSaveRes) {
						// Handle Word save error
						if (wordSaveErr) done(wordSaveErr);

						// Delete existing Word
						agent.delete('/words/' + wordSaveRes.body._id)
							.send(word)
							.expect(200)
							.end(function(wordDeleteErr, wordDeleteRes) {
								// Handle Word error error
								if (wordDeleteErr) done(wordDeleteErr);

								// Set assertions
								(wordDeleteRes.body._id).should.equal(wordSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Word instance if not signed in', function(done) {
		// Set Word user 
		word.user = user;

		// Create new Word model instance
		var wordObj = new Word(word);

		// Save the Word
		wordObj.save(function() {
			// Try deleting Word
			request(app).delete('/words/' + wordObj._id)
			.expect(401)
			.end(function(wordDeleteErr, wordDeleteRes) {
				// Set message assertion
				(wordDeleteRes.body.message).should.match('User is not logged in');

				// Handle Word error error
				done(wordDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Word.remove().exec();
		done();
	});
});