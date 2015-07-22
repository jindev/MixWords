'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Word = mongoose.model('Word'),
	_ = require('lodash');

/**
 * Create a Word
 */
exports.create = function(req, res) {
	var word = new Word(req.body);
	word.user = req.user;

	word.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(word);
		}
	});
};

/**
 * Show the current Word
 */
exports.read = function(req, res) {
	res.jsonp(req.word);
};

/**
 * Update a Word
 */
exports.update = function(req, res) {
	var word = req.word ;

	word = _.extend(word , req.body);

	word.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(word);
		}
	});
};

/**
 * Delete an Word
 */
exports.delete = function(req, res) {
	var word = req.word ;

	word.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(word);
		}
	});
};

/**
 * List of Words
 */
exports.list = function(req, res) { 
	Word.find().sort('-created').populate('user', 'displayName').exec(function(err, words) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(words);
		}
	});
};

/**
 * Word middleware
 */
exports.wordByID = function(req, res, next, id) { 
	Word.findById(id).populate('user', 'displayName').exec(function(err, word) {
		if (err) return next(err);
		if (! word) return next(new Error('Failed to load Word ' + id));
		req.word = word ;
		next();
	});
};

/**
 * Word authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.word.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
