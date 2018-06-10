/**
 * Created by User on 05/06/2017.
 */
/**
 * Created by User on 25/05/2017.
 */
var async = require('async'),
	keystone = require('keystone');

var CheckListEntry = keystone.list('CheckListEntry');
var Answer = keystone.list('Answer');
var Question = keystone.list('Question');
var FacebookUser = keystone.list('FacebookUser');
var _ = require("underscore");
/**
 * Create Entry
 */
exports.list = function(req, res) {
	CheckListEntry.model.find().exec(function(err, items) {

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
	CheckListEntry.model.findOne().where('_id', req.params.id).exec(function(err, item) {

		if (err) return res.status(400).send(err);
		if (!item) return res.status(404).send(err);

		res.send(
			item
		);

	});
};
exports.getByAddress = function(req, res) {
	console.log(req.query);
	var parsedQuery = {
		"address.city": req.query.city,
		"address.streetName": req.query.streetName,
		"address.streetNumber": req.query.streetNumber
	};
	if(req.query.floor) parsedQuery["address.floor"] = req.query.floor;
	if(req.query.apartmentNumber) parsedQuery["address.apartmentNumber"] = req.query.apartmentNumber;
	console.log(parsedQuery);
	CheckListEntry.model.find().where(parsedQuery).select('address date answers').exec(function(err, items) {
		//console.log(items);
		var newItems = [];
		async.each(items, function(item,cbtwo){
			//console.log(item);
			var tempItem = JSON.parse(JSON.stringify(item));
			tempItem["parsedAnswers"] = _.map(item.answers, function(answer){
				return {
					question: answer.slice(0,answer.search(":")),
					answer: answer.slice(answer.search(":")+2,answer.length)			
				}
			});
			if(newItems.length>0) {
				var found = false;
				for (var i = 0; i < newItems.length && !found; i++) {
					if (JSON.stringify(newItems[i].address) == JSON.stringify(tempItem.address)){
						if(newItems[i].date<tempItem.date)
							newItems[i] = tempItem;
						found = true;

					}
					else {
					}
				}
				if(!found){
					newItems.push(tempItem);
				}
				cbtwo();
			}
			else{
				newItems.push(tempItem);
				cbtwo();
			}
		},function(err) {
			if (err) return res.status(400).send(err);
			if (!newItems) return res.status(404).send(err);
			res.send(
				newItems
			);
			
		});


	});
};
//exports.getByAddress = function(req, res) {
//	console.log(req.query);
//	var parsedQuery = {
//		"address.city": req.query.city,
//		"address.streetName": req.query.streetName,
//		"address.streetNumber": req.query.streetNumber
//	};
//	if(req.query.floor) parsedQuery["address.floor"] = req.query.floor;
//	if(req.query.apartmentNumber) parsedQuery["address.apartmentNumber"] = req.query.apartmentNumber;
//	console.log(parsedQuery);
//	CheckListEntry.model.find().where(parsedQuery).select('address date answers').exec(function(err, items) {
//		//console.log(items);
//		var newItems = [];
//		async.eachSeries(items, function(item,cbtwo){
//			//console.log(item);
//			var tempItem = JSON.parse(JSON.stringify(item));
//			tempItem["parsedAnswers"] = [];
//			async.each(item.answers, function (answer,cb) {
//				Answer.model.findOne().where('_id', answer).exec(function (err, answer) {
//					tempItem["parsedAnswers"].push(answer.questionAndAnswerText);
//					cb();
//				})
//			}, function (err) {
//				delete  tempItem["answers"];
//				tempItem["parsedAnswers"] = _.map(tempItem["parsedAnswers"], function(item){
//					return {
//						question: item.slice(0,item.search(":")),
//						answer: item.slice(item.search(":")+2,item.length)
//					}
//				});
//				if(newItems.length>0) {
//					var found = false;
//					for (var i = 0; i < newItems.length && !found; i++) {
//						if (JSON.stringify(newItems[i].address) == JSON.stringify(tempItem.address)){
//							if(newItems[i].date<tempItem.date)
//								newItems[i] = tempItem
//							found = true;
//
//						}
//						else {
//						}
//					}
//					if(!found){
//						newItems.push(tempItem);
//					}
//					cbtwo();
//				}
//				else{
//					newItems.push(tempItem);
//					cbtwo();
//				}
//			});
//		},function(err) {
//			if (err) return res.status(400).send(err);
//			if (!newItems) return res.status(404).send(err);
//			res.send(
//				newItems
//			);
//		});
//
//
//	});
//};
/**
 * Create a Post
 */
exports.create = function(req, res) {
	var answers = JSON.parse(JSON.stringify(req.body));
	var answersToPush = [];
	for(var i=0;i<answers.answers.length;i++)
		answersToPush.push(answers.answers[i].parsed_question + ": " + answers.answers[i].answer)
	answers["answers"] = answersToPush;
	FacebookUser.model.findOne().where('userID', answers.facebookUser).exec(function (err, user) {
		if (err) return res.status(400).send("Facebook User Not Found. Please log in with facebook first.");
		if(!user) return res.status(404).send(err);
		else{
			answers["facebookUser"] = user._id;
			var item = new CheckListEntry.model(),
				data = (req.method == 'POST') ? answers : req.query;
			console.log("new Entry: "+JSON.stringify(answers))
			item.getUpdateHandler(req).process(data, function(err) {
				if (err) return res.status(400).send(err);

				res.send({
					post: item
				});

			});
		}
	});
	//})
};
//exports.create = function(req, res) {
//	var answers = JSON.parse(JSON.stringify(req.body));
//	var answersIds = [];
//	async.eachSeries(answers.answers, function(answer,cb) {
//		Question.model.findOne().where('_id', answer.question).exec(function (err, question) {
//			console.log("found question: "+question);
//			var data = {
//				question: question._id,
//				answer: answer.answer
//			};
//			var newAnswer = new Answer.model(data);
//			newAnswer.save(function(err,answerSaved){
//				console.log("saved answer: "+answerSaved)
//				answersIds.push(answerSaved._id);
//				cb()
//			})
//
//		})
//	}, function(err){
//		answers["answers"] = answersIds;
//		FacebookUser.model.findOne().where('userID', answers.facebookUser).exec(function (err, user) {
//			console.log("user :"+user);
//			if (err) return res.status(400).send("Facebook User Not Found. Please log in with facebook first.");
//			if(!user) return res.status(404).send(err);
//			else{
//				answers["facebookUser"] = user._id;
//				var item = new CheckListEntry.model(),
//					data = (req.method == 'POST') ? answers : req.query;
//				console.log("new Entry: "+JSON.stringify(answers))
//				item.getUpdateHandler(req).process(data, function(err) {
//					if (err) return res.status(400).send(err);
//
//					res.send({
//						post: item
//					});
//
//				});
//			}
//		})
//	})
//};
/**
 * Get Post by ID
 */
exports.update = function(req, res) {
	CheckListEntry.model.findById(req.params.id).exec(function(err, item) {

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
	CheckListEntry.model.findById(req.params.id).exec(function (err, item) {

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
