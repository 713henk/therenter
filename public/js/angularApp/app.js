(function () {

	'use strict';

	angular
		.module('therenter', ['ui.router', 'ngMaterial', 'ngMessages', 'ngSanitize', 'ngStorage','facebook'])
		.config(function($stateProvider, $urlRouterProvider, FacebookProvider) {
			var myAppId = '120244561900887';
			// You can set appId with setApp method
			// FacebookProvider.setAppId('myAppId');

			/**
			 * After setting appId you need to initialize the module.
			 * You can pass the appId on the init method as a shortcut too.
			 */
			FacebookProvider.init(myAppId);
			//HOW TO ADD - FB.AppEvents.logPageView();
			//HOW TO ADD - FB.Event.subscribe('auth.statusChange', auth_status_change_callback); - and several others from home controller
			//FB.Event.subscribe('auth.authResponseChange' - auth.js



			$stateProvider
				.state('home', {
					stateName: 'דף הבית',
					url: '/',
					controller: 'HomeController',
					templateUrl: 'js/angularApp/components/home/home.html',
					controllerAs: 'vm'
				})
				.state('blog', {
					stateName: 'מאמרים',
					url: '/blog',
					controller: 'BlogController',
					templateUrl: 'js/angularApp/components/blog/blog.html'
					//component: 'blog',
					//resolve: {
					//	blog: function(blogService) {
					//		return blogService.getAllArticles();
					//	}
					//}
				})
				.state('article', {
					stateName: 'מאמר',
					url: '/blog/:slug',
					controller: function($scope, blogService, $stateParams) {
						$scope.slug = $stateParams.slug;
						console.log('STATE ARTICLE ID: ' + $stateParams.slug);
						console.log('RECEIVED ARTICLE ID: ' + $scope.slug);
						// get the article
						blogService.getArticleById($scope.slug).then(function (resultArticle){
							if (!resultArticle)
								console.log('NO ARTICLE RECEIVED');
							else {
								console.log('ARTICLE RECEIVED: ' + JSON.stringify(resultArticle));
								$scope.article = resultArticle;
							}

						});
					},
					templateUrl: 'js/angularApp/components/blog/article.html'
				})
				.state('checklist',{
					stateName: "צ'קליסט",
					url: '/checklist',
					controller: 'ChecklistController',
					templateUrl: 'js/angularApp/components/checklist/checklist.html'
				})
				.state('rentalSearch',{
					stateName: 'מאגר השכירות',
					url: '/rentalSearch',
					controller: 'ChecklistController',
					templateUrl: 'js/angularApp/components/checklist/rentalSearch.html'
				})
				.state('about', {
					stateName: 'אודות',
					url: '/about',
					//controller: '',
					templateUrl: 'js/angularApp/components/about/about.html'
					//controllerAs: 'vm'
				})
			.state('terms', {
				stateName: 'תנאי שימוש',
				url: '/terms',
				//controller: '',
				templateUrl: 'js/angularApp/components/terms/termsforfb.html'
				//controllerAs: 'vm'
			});
			$urlRouterProvider.otherwise('/');
		})
		.controller('MainCtrl', ['$scope', '$interpolate', '$location','$timeout', function($scope, $interpolate, $location, $timeout) {

			var tabs = [
				{title: 'Blog', path: 'blog', idx: 0},
				{title: 'Gallery', path: 'gallery', idx: 1},
				{title: 'Contact', path: 'contact', idx: 2}
			];
			$scope.lala = false;
			$scope.tabs = tabs;
			$scope.predicate = "title";
			$scope.reversed = true;
			$scope.selectedIndex = 0;
			$scope.allowDisable = true;

			$scope.onTabSelected = onTabSelected;
			$scope.announceSelected = announceSelected;
			$scope.announceDeselected = announceDeselected;

			$scope.go = function (tab, path) {
				onTabSelected(tab);
				$location.path(path);
			};

			function onTabSelected(tab) {
				$scope.selectedIndex = tab.idx;
				// console.log('Selected tab: ' + this.$index);

				$scope.announceSelected(tab);
			}

			function announceDeselected(tab) {
				$scope.farewell = $interpolate("Goodbye {{title}}!")(tab);
			}

			function announceSelected(tab) {
				$scope.greeting = $interpolate("Hello {{title}}!")(tab);
			}

			config.$inject = ['$stateProvider', '$urlRouterProvider'];
		}])
		.run(function ($rootScope,
					   $state,
					   $stateParams,
					   $window,
					   facebookService,
					   UserService,
					   $timeout,
					   Facebook) {
			var vm = this;
			//$rootScope.auth = authService;
			$rootScope.user = UserService;
			$rootScope.facebook = facebookService;
			$rootScope.isWaiting = false;
			/**
			 * Watch for Facebook to be ready.
			 * There's also the event that could be used
			 */
			$rootScope.$watch(
				function() {
					//console.log('IN WATCH FUNCTION BEFORE RETURN OF FACEBOOK READY');
					return Facebook.isReady();
				},
				function(newVal) {
					console.log('IN WATCH FUNCTION APP RUN');
					if (newVal) {
						console.log('NEW VAL WATCH APP RUN - ' + newVal);
						$rootScope.facebookReady = true;
					}

				}
			);
			/**
			 * Taking approach of Events :D
			 */
			$rootScope.$on('Facebook:statusChange', function(ev, data) {
				console.log('Status: ', data);
				if (data.status == 'connected') {
					//$scope.$apply(function() {
						console.log('CONNECTED');

					//});
				} else {
					//$scope.$apply(function() {
						console.log('DISCONNECTED');
					//});
				}


			});
			$rootScope.$on('$routeChangeStart', function (event) {
				$rootScope.isWaiting = true;
				console.log('ON ROUTE CHANGE START');
				/**
				 * Watch for Facebook to be ready.
				 * There's also the event that could be used
				 */
				$rootScope.$watch(
					function() {
						//console.log('IN WATCH FUNCTION BEFORE RETURN OF FACEBOOK READY');
						return Facebook.isReady();
					},
					function(newVal) {
						console.log('IN WATCH FUNCTION ROUTE CHANGE');
						if (newVal) {
							console.log('NEW VAL WATCH ROUTE CHANGE - ' + newVal);
							$rootScope.facebookReady = true;
						}

					}
				);
				var user_to_set = {};
				$rootScope.facebook.getLoginStatus().then(function(statusResponse){
					if (!statusResponse) {
						console.log('NO RESPONSE');
					}
					console.log('Status Response on route Change Start - ' + JSON.stringify(statusResponse));
					if (statusResponse.status === 'connected') {
						console.log('ROUTE CHANGE START - CONNECTED');
						if (statusResponse.authResponse) {
							console.log('ROUTE CHANGE START - RECEIVED AUTH RESPONSE');
							user_to_set.access_token = statusResponse.authResponse.accessToken;
							user_to_set.userID = statusResponse.authResponse.userID;
							console.log('SET ACCESS TOKEN AND USER ID');
							console.log('CALLING FACEBOOK GET INFORMATION');
							$rootScope.facebook.getMyFacebookInformation().then(function(userInfo){
								console.log('RECEVIED USER INFO RESPONSE - ' + JSON.stringify(userInfo));
								user_to_set.name = userInfo.first_name + " " + userInfo.last_name;
								user_to_set.first_name = userInfo.first_name;
								user_to_set.last_name = userInfo.last_name;
								user_to_set.gender = userInfo.gender;
								user_to_set.email = userInfo.email;
								console.log('SETTING USER - ' + JSON.stringify(user_to_set));
								$rootScope.user.setUser(user_to_set);
								console.log('IS THERE A USER LOGGED IN? - ' + JSON.stringify($rootScope.user.isLoggedIn()));
								console.log('CALLING CREATE FACEBOOK USER');
								$timeout(function(){
									$rootScope.isWaiting = false;
								}, 200)
								$rootScope.facebook.createFacebookUser(user_to_set).then(function(createdResponse){
									console.log('CREATE FACEBOOK USER RESPONSE - ' + JSON.stringify(createdResponse));
								});
							});
						}

					} else {
						//status is not connected check others
						$rootScope.user.setUser(null);
						console.log('STATUS - ' + statusResponse.status);
					}
					//check the response, update the user accordingly
				});

			});
			$rootScope.$on('$stateChangeStart', function () {
				console.log('ON STATE CHANGE START');
				$rootScope.isWaiting = true;

				/**
				 * Watch for Facebook to be ready.
				 * There's also the event that could be used
				 */
				$rootScope.$watch(
					function() {
						//console.log('IN WATCH FUNCTION BEFORE RETURN OF FACEBOOK READY');
						return Facebook.isReady();
					},
					function(newVal) {
						console.log('IN WATCH FUNCTION STATE CHANGE');
						if (newVal) {
							console.log('NEW VAL WATCH STATE CHANGE - ' + newVal);
							$rootScope.facebookReady = true;
						}

					}
				);
				var user_to_set = {};
				$rootScope.facebook.getLoginStatus().then(function(statusResponse){
					if (!statusResponse) {
						console.log('NO RESPONSE');
					}
					console.log('Status Response on route Change Start - ' + JSON.stringify(statusResponse));
					if (statusResponse.status === 'connected') {
						console.log('STATE CHANGE START - CONNECTED');
						if (statusResponse.authResponse) {
							console.log('STATE CHANGE START - RECEIVED AUTH RESPONSE');
							user_to_set.access_token = statusResponse.authResponse.accessToken;
							user_to_set.userID = statusResponse.authResponse.userID;
							console.log('SET ACCESS TOKEN AND USER ID');
							console.log('CALLING FACEBOOK GET INFORMATION');
							$rootScope.facebook.getMyFacebookInformation().then(function(userInfo){
								console.log('RECEVIED USER INFO RESPONSE - ' + JSON.stringify(userInfo));
								user_to_set.name = userInfo.first_name + " " + userInfo.last_name;
								user_to_set.first_name = userInfo.first_name;
								user_to_set.last_name = userInfo.last_name;
								user_to_set.gender = userInfo.gender;
								user_to_set.email = userInfo.email;
								console.log('SETTING USER - ' + JSON.stringify(user_to_set));
								$rootScope.user.setUser(user_to_set);
								$timeout(function(){
									$rootScope.isWaiting = false;
								}, 200);
								console.log('IS THERE A USER LOGGED IN? - ' + JSON.stringify($rootScope.user.isLoggedIn()));
								console.log('CALLING CREATE FACEBOOK USER');
								$rootScope.facebook.createFacebookUser(user_to_set).then(function(createdResponse){
									console.log('CREATE FACEBOOK USER RESPONSE - ' + JSON.stringify(createdResponse));
								});
							});
						}

					} else {
						//status is not connected check others
						$rootScope.user.setUser(null);
						console.log('STATUS - ' + statusResponse.status);
					}
					//check the response, update the user accordingly
				});


			});
			$rootScope.$watch($rootScope.user.isLoggedIn(), function (value, oldValue) {
				if(!value && oldValue) {
					console.log('USER HAS DISCONNECTED');
				}

				if(value) {
					console.log("Connect");
					$rootScope.user.setUser(value);
				}

			}, true);

			/**
			 * Taking approach of Events :D
			 */
			//$rootScope.auth.watchLoginChange();

		})
})();
