/**
 * Created by User on 25/05/2017.
 */
(function () {

	'use strict';

	angular
		.module('therenter')
		.service('blogService', blogService);
	function blogService($q,$http) {
		function getAllArticles() {
			var allArticles = undefined;
			if (!allArticles) {
				var deferred = $q.defer();

				// get posts form backend
				$http.get('/api/post/list')
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						allArticles = result.data;
						// resolve the deferred
						deferred.resolve(allArticles);
					}, function (error) {
						allArticles = error;
						deferred.reject(allArticles);
					}).then();

				// set the posts object to be a promise until result comeback
				allArticles = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(allArticles);
		}

        //NOT BY ID - BY SLUG
		function getArticleById(slug) {
			var article = undefined;
			if (!article) {
				var deferred = $q.defer();

				// get posts form backend
				$http.get('/api/post/' + slug)
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						article = result.data;
						// resolve the deferred
						deferred.resolve(article);
					}, function (error) {
						article = error;
						deferred.reject(article);
					}).then();

				// set the posts object to be a promise until result comeback
				article = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(article);
		}

		return {
			getAllArticles: getAllArticles,
			getArticleById: getArticleById
		}
	}
})();
