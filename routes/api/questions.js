/**
 * Created by User on 25/05/2017.
 */
var async = require('async'),
	keystone = require('keystone');

var Question = keystone.list('Question');
var QuestionCategory = keystone.list('QuestionCategory');

/**
 * List Posts
 */
exports.list = function(req, res) {
	Question.model.find().sort('sortOrder').exec(function(err, items) {
		if (err) return res.status(400).send(err);
		res.send(items);

	});
};

/**
 * Get Post by ID
 */
exports.get = function(req, res) {
	Question.model.findOne().where('_id', req.params.id).exec(function(err, item) {

		if (err) return res.status(400).send(err);
		if (!item) return res.status(404).send(err);

		res.send(
			item
		);

	});
};
exports.getAllByCategory = function(req, res) {
	var response = [];
	QuestionCategory.model.find().sort('sortOrder').exec(function (err,categories) {
		async.eachSeries(categories, function (category, cb) {
			Question.model.find().where('category', category.id).sort('sortOrder').exec(function (err, questions) {
				if (err) return res.status(400).send(err);
				if (!questions) return res.status(404).send(err);
				response.push({
					categoryName: category.name,
					questions: questions
				});
				cb();
			})
		}, function(results,err){
			if (err) return res.status(400).send(err);
			res.send(response)
		})
	});
};


/**
 * Create a Post
 */
exports.create = function(req, res) {

	var item = new Question.model(),
		data = (req.method == 'POST') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function(err) {

		if (err) return res.status(400).send(err);

		res.send({
			post: item
		});

	});
};

/**
 * Get Post by ID
 */
exports.update = function(req, res) {
	Question.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.status(400).send(err);
		if (!item) return res.status(404).send(err);

		var data = (req.method == 'POST') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function(err) {

			if (err) return res.status(400).send(err);

			res.send({
				post: item
			});

		});

	});
};

/**
 * Delete Post by ID
 */
exports.remove = function(req, res) {
	Question.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.status(400).send(err);
		if (!item) return res.status(404).send(err);

		item.remove(function (err) {
			if (err) return res.status(400).send(err);

			return res.send({
				success: true
			});
		});

	});
};
