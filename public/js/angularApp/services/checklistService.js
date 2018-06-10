/**
 * Created by User on 25/05/2017.
 */
/**
 * Created by User on 25/05/2017.
 */
(function () {

	'use strict';

	angular
		.module('therenter')
		.service('checklistService', checklistService);
	function checklistService($q,$http) {
		function getQuestions() {
			var allItems = undefined;
			if (!allItems) {
				var deferred = $q.defer();

				// get posts form backend
				$http.get('/api/questions/list')
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						allItems = result.data;
						// resolve the deferred
						deferred.resolve(allItems);
					}, function (error) {
						allItems = error;
						deferred.reject(allItems);
					}).then();

				// set the posts object to be a promise until result comeback
				allItems = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(allItems);
		}
		function getQuestionsByCategory() {
			var allItems = undefined;
			if (!allItems) {
				var deferred = $q.defer();

				// get posts form backend
				$http.get('/api/questions/bycategory')
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						allItems = result.data;
						// resolve the deferred
						deferred.resolve(allItems);
					}, function (error) {
						allItems = error;
						deferred.reject(allItems);
					}).then();

				// set the posts object to be a promise until result comeback
				allItems = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(allItems);
		}
		function getStreetsList() {
			var allStreets = undefined;
			if (!allStreets) {
				var deferred = $q.defer();

				// get posts form backend
				$http.get('/api/streets/list')
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						allStreets = result.data;
						// resolve the deferred
						deferred.resolve(allStreets);
					}, function (error) {
						allStreets = error;
						deferred.reject(allStreets);
					}).then();

				// set the posts object to be a promise until result comeback
				allStreets = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(allStreets);
		}
		function getStreetsByCity(city) {
			var allStreets = undefined;
			if (!allStreets) {
				var deferred = $q.defer();

				// get posts form backend
				$http({method: 'GET',
						url: '/api/streets/bycity/' + city,
						headers: {'Content-Type': 'text/html; charset=utf-8'}}
				)
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						allStreets = result.data;
						// resolve the deferred
						deferred.resolve(allStreets);
					}, function (error) {
						allStreets = error;
						deferred.reject(allStreets);
					}).then();

				// set the posts object to be a promise until result comeback
				allStreets = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(allStreets);
		}
		function getCitiesList() {
			var allCities = undefined;
			if (!allCities) {
				var deferred = $q.defer();

				// get posts form backend
				$http.get('/api/cities/list')
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						allCities = result.data;
						// resolve the deferred
						deferred.resolve(allCities);
					}, function (error) {
						allCities = error;
						deferred.reject(allCities);
					}).then();

				// set the posts object to be a promise until result comeback
				allCities = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(allCities);
		}
		function searchAddress(address) {
			var searchResults = undefined;
			if (!searchResults) {
				var deferred = $q.defer();

				// get posts form backend
				$http({method: 'GET',
					url: '/api/checklistentries/byaddress/',
					params: { city: address.city,
					streetName: address.streetName,
					streetNumber: address.streetNumber,
					floor: address.floor,
					apartmentNumber: address.apartmentNumber},
					headers: {'Content-Type': 'text/html; charset=utf-8'}})
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						searchResults = result.data;
						// resolve the deferred
						deferred.resolve(searchResults);
					}, function (error) {
						searchResults = error;
						deferred.reject(searchResults);
					}).then();

				// set the posts object to be a promise until result comeback
				searchResults = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(searchResults);
		}
		function createChecklistEntry(entryToAdd) {
			var entryAdded = undefined;
			if (!entryAdded) {
				var deferred = $q.defer();

				// get posts form backend
				$http.post('/api/checklistentries/create', entryToAdd)
					.then(function (result) {
						//console.log('result.data ' + JSON.stringify(result.data));
						// save fetched posts to the local variable
						entryAdded = result.data;
						// resolve the deferred
						deferred.resolve(entryAdded);
					}, function (error) {
						entryAdded = error;
						deferred.reject(entryAdded);
					}).then();

				// set the posts object to be a promise until result comeback
				entryAdded = deferred.promise;
			}

			// in any way wrap the posts object with $q.when which means:
			// local posts object could be:
			// a promise
			// a real posts data
			// both cases will be handled as promise because $q.when on real data will resolve it immediately
			return $q.when(entryAdded);
		}
		return {
			getQuestionsByCategory: getQuestionsByCategory,
			getQuestions: getQuestions,
			getStreetsList:getStreetsList,
			getStreetsByCity:getStreetsByCity,
			getCitiesList: getCitiesList,
			searchAddress: searchAddress,
			createChecklistEntry: createChecklistEntry
		}
	}
})();
