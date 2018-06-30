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
						// get the article
						blogService.getArticleById($scope.slug).then(function (resultArticle){
							if (resultArticle) {
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
				.state('myChecklists',{
					stateName: "הצ'קליסטים שלי",
					url: '/myChecklists',
					controller: 'ChecklistController',
					templateUrl: 'js/angularApp/components/checklist/myChecklists.html'
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
					if (newVal) {
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
						console.log('user successfully connected');
				} else {
						console.log('user successfully disconnect');
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
						return Facebook.isReady();
					},
					function(newVal) {
						if (newVal) {
							$rootScope.facebookReady = true;
						}

					}
				);
				var user_to_set = {};
				$rootScope.facebook.getLoginStatus().then(function(statusResponse){
					if (statusResponse.status === 'connected') {
						if (statusResponse.authResponse) {
							user_to_set.access_token = statusResponse.authResponse.accessToken;
							user_to_set.userID = statusResponse.authResponse.userID;
							$rootScope.facebook.getMyFacebookInformation().then(function(userInfo){
								console.log('recevied user info response - ' + JSON.stringify(userInfo));
								user_to_set.name = userInfo.first_name + " " + userInfo.last_name;
								user_to_set.first_name = userInfo.first_name;
								user_to_set.last_name = userInfo.last_name;
								user_to_set.gender = userInfo.gender;
								user_to_set.email = userInfo.email;
								$rootScope.user.setUser(user_to_set);
								console.log('user login status? - ' + JSON.stringify($rootScope.user.isLoggedIn()));
								$timeout(function(){
									$rootScope.isWaiting = false;
								}, 200)
								$rootScope.facebook.createFacebookUser(user_to_set).then(function(createdResponse){
									console.log('create facebook user response - ' + JSON.stringify(createdResponse));
								});
							});
						}

					} else {
						$rootScope.user.setUser(null);
					}
				});

			});
			$rootScope.$on('$stateChangeStart', function () {
				$rootScope.isWaiting = true;

				/**
				 * Watch for Facebook to be ready.
				 * There's also the event that could be used
				 */
				$rootScope.$watch(
					function() {
						return Facebook.isReady();
					},
					function(newVal) {
						if (newVal) {
							$rootScope.facebookReady = true;
						}

					}
				);
				var user_to_set = {};
				$rootScope.facebook.getLoginStatus().then(function(statusResponse){
					if (statusResponse.status === 'connected') {
						if (statusResponse.authResponse) {
							user_to_set.access_token = statusResponse.authResponse.accessToken;
							user_to_set.userID = statusResponse.authResponse.userID;
							$rootScope.facebook.getMyFacebookInformation().then(function(userInfo){
								console.log('recevied user info response - ' + JSON.stringify(userInfo));
								user_to_set.name = userInfo.first_name + " " + userInfo.last_name;
								user_to_set.first_name = userInfo.first_name;
								user_to_set.last_name = userInfo.last_name;
								user_to_set.gender = userInfo.gender;
								user_to_set.email = userInfo.email;
								$rootScope.user.setUser(user_to_set);
								$timeout(function(){
									$rootScope.isWaiting = false;
								}, 200);
								console.log('user login status? - ' + JSON.stringify($rootScope.user.isLoggedIn()));
								$rootScope.facebook.createFacebookUser(user_to_set).then(function(createdResponse){
									console.log('create facebook user response - ' + JSON.stringify(createdResponse));
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
				if(value) {
					$rootScope.user.setUser(value);
				}

			}, true);

			/**
			 * Taking approach of Events :D
			 */
			//$rootScope.auth.watchLoginChange();

		})
})();
