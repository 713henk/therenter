/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.all('/api*', keystone.middleware.cors);
	app.options('/api*', function(req, res) {
		res.send(200);
	});
	app.get('/', routes.views.index);
	app.get('/api/post/list', [keystone.middleware.api, keystone.middleware.cors], routes.api.posts.list);
	app.all('/api/post/create', [keystone.middleware.api, keystone.middleware.cors], routes.api.posts.create);
	app.get('/api/post/:slug', [keystone.middleware.api, keystone.middleware.cors], routes.api.posts.get);
	app.all('/api/post/:id/update', [keystone.middleware.api, keystone.middleware.cors], routes.api.posts.update);
	app.get('/api/post/:id/remove', [keystone.middleware.api, keystone.middleware.cors], routes.api.posts.remove);
	app.get('/api/post-category/list', [keystone.middleware.api, keystone.middleware.cors], routes.api.post_categories.list);
	app.get('/api/post-category/:key', [keystone.middleware.api, keystone.middleware.cors], routes.api.post_categories.get);
	app.get('/api/post-by-category/:key', [keystone.middleware.api, keystone.middleware.cors], routes.api.post_by_category.list);
	app.get('/api/questions/list', [keystone.middleware.api, keystone.middleware.cors], routes.api.questions.list);
	app.get('/api/questions/bycategory', [keystone.middleware.api, keystone.middleware.cors], routes.api.questions.getAllByCategory);
	app.all('/api/checklistentries/create', [keystone.middleware.api,keystone.middleware.cors], routes.api.checklistentries.create);
	app.get('/api/checklistentries/byaddress',[keystone.middleware.api, keystone.middleware.cors], routes.api.checklistentries.getByAddress);
	app.get('/api/checklistentries/byuser',[keystone.middleware.api, keystone.middleware.cors], routes.api.checklistentries.getByUser);



	app.all('/api/answer/create', [keystone.middleware.api,keystone.middleware.cors], routes.api.answers.create);
	app.get('/api/answer/:id', [keystone.middleware.api, keystone.middleware.cors], routes.api.answers.get);
	app.get('/api/streets/bycity/:city', [keystone.middleware.api, keystone.middleware.cors], routes.api.streets.getByCity);
	app.get('/api/streets/list', [keystone.middleware.api, keystone.middleware.cors], routes.api.streets.list);
	app.get('/api/cities/list',[keystone.middleware.api, keystone.middleware.cors], routes.api.cities.list);
	app.all('/api/facebookusers/create',[keystone.middleware.api, keystone.middleware.cors], routes.api.facebookusers.create ); 
	app.all('/api/question-categories/create',[keystone.middleware.api, keystone.middleware.cors], routes.api.question_categories.create );
	app.get('/api/question-categories/list',[keystone.middleware.api, keystone.middleware.cors], routes.api.question_categories.list );
	app.get('/api/question-categories/:name',[keystone.middleware.api, keystone.middleware.cors], routes.api.question_categories.get );
	app.get('/api/questions-by-category/:name',[keystone.middleware.api, keystone.middleware.cors], routes.api.question_by_category.list );

		// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
