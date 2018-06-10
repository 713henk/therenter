/**
 * Created by User on 05/06/2017.
 */
var async = require('async'),
	keystone = require('keystone');

var Answer = keystone.list('Answer');

/**
 * List Posts
 */
exports.list = function(req, res) {
	Answer.model.find().exec(function(err, items) {

		if (err) return res.status(400).send(err);

		// res.apiResponse({
		//   posts: items
		// });

		res.send(items);

	});
};

/**
 * Get Post by ID
 */
exports.get = function(req, res) {
	Answer.model.findOne().where('_id', req.params.id).exec(function(err, item) {

		if (err) return res.status(400).send(err);
		if (!item) return res.status(404).send(err);

		res.send(
			item
		);

	});
};


/**
 * Create a Post
 */
exports.create = function(req, res) {

	var item = new Answer.model(),
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
	Answer.model.findById(req.params.id).exec(function(err, item) {

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
	Answer.model.findById(req.params.id).exec(function (err, item) {

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
