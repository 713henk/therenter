/**
 * Created by User on 21/05/2017.
 */
var async = require('async'),
	keystone = require('keystone');
var decode = require('urldecode')
var Question = keystone.list('Question');
var QuestionCategory = keystone.list('QuestionCategory');

/**
 * Get Question by Category
 */
exports.list = function(req, res) {
	var parsedName = decode(req.params.name);
	QuestionCategory.model.findOne().where('name', parsedName).exec(function(err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		var category = item;

		Question.model.find().populate('category').where('category').in([category.id]).exec(function(err, items) {
			if (err) return res.apiError('database error', err);
			if (!items || items.length === 0) return res.status(404).send('not found');

			res.send(
				items
			);
		});
	});
};
/**
 * Created by User on 01/07/2017.
 */
