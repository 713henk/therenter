/**
 * Created by User on 11/06/2017.
 */
/**
 * Created by User on 05/06/2017.
 */
var async = require('async'),
	keystone = require('keystone');
var Street = keystone.list('Street');
var decode = require('urldecode')
/**
 * List Posts
 */

exports.list = function(req, res) {
	Street.model.find().exec(function(err, items) {
		if (err) return res.status(400).send(err);
		res.send(items);
	});
};

/**
 * Get Post by ID
 */
exports.getByCity = function(req, res) {
	var parsedCity = decode(req.params.city)
	var streetList = "";
	Street.model.find().where('cityName', JSON.parse(parsedCity)).exec(function(err, items) {
		if (err) return res.status(400).send(err);
		streetList = items.map( function (item) {
			return {
				value: item.streetName.toLowerCase(),
				display: item.streetName
			};
		});
		res.send(
			streetList
		);

	});
};


/**
 * Create a Post
 */
exports.create = function(req, res) {

	var item = new Street.model(),
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
	Street.model.findById(req.params.id).exec(function(err, item) {
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
	Street.model.findById(req.params.id).exec(function (err, item) {
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
