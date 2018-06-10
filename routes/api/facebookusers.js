/**
 * Created by User on 15/06/2017.
 */

var async = require('async'),
	keystone = require('keystone');

var FacebookUser = keystone.list('FacebookUser');

/**
 * List Posts
 */
//exports.list = function(req, res) {
//	var citiesList = "";
//	FacebookUser.model.find().exec(function(err, items) {
//		if (err) return res.status(400).send(err);
//		citiesList = items.map( function (item) {
//			return {
//				value: item.cityName.toLowerCase(),
//				display: item.cityName
//			};
//		});
//		//for(var i=0;i<items.length;i++){
//		//	citiesList.push({
//		//		value: items[i].cityName.toLowerCase(),
//		//		display: items[i].cityName
//		//	});
//		//}
//		res.send(citiesList);
//	});
//};

/**
 * Get Post by ID
 */
exports.get = function(req, res) {
	FacebookUser.model.findOne().where('_id', req.params.id).exec(function(err, item) {

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
	console.log(req.body);
	FacebookUser.model.findOne().where('userID', req.body.userID).exec(function(err, user) {
		if (err) return res.status(400).send(err);
		if (user) return res.send("fbuser exists.");
		else{
			var item = new FacebookUser.model(),
				data = (req.method == 'POST') ? req.body : req.query;
			item.getUpdateHandler(req).process(data, function(err) {
				if (err) return res.status(400).send(err);

				res.send({
					post: item
				});
			})
		}
	});
};

/**
 * Get Post by ID
 */
exports.update = function(req, res) {
	FacebookUser.model.findById(req.params.id).exec(function(err, item) {

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
	FacebookUser.model.findById(req.params.id).exec(function (err, item) {

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
