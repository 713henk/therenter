/**
 * Created by User on 01/07/2017.
 */
var async = require('async'),
	keystone = require('keystone');
var decode = require('urldecode')
var QuestionCategory = keystone.list('QuestionCategory');

/**
 * List QuestionCategories
 */
exports.list = function(req, res) {
	QuestionCategory.model.find(function(err, items) {

		if (err) return res.apiError('database error', err);

		res.send(items);

	});
};

/**
 * Get QuestionCategory by ID
 */
exports.get = function(req, res) {
	var parsedName = decode(req.params.name);
	QuestionCategory.model.findOne().where('name', parsedName).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.send(
			item
		);

	});
};
exports.create = function(req, res) {
	var item = new QuestionCategory.model(),
		data = (req.method == 'POST') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function(err) {

		if (err) return res.status(400).send(err);

		res.send({
			post: item
		});

	});
};
