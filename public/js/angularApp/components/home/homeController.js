/**
 * Created by User on 25/05/2017.
 */
(function () {

	'use strict';
	var isDlgOpen;
	angular
		.module('therenter')
		.controller('HomeController', HomeController)
		.config(function($mdThemingProvider) {
			$mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
			$mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
			$mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
			$mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
		});

		HomeController.$inject = ['anchorSmoothScroll', '$location', '$rootScope', '$mdDialog'];
		function HomeController(anchorSmoothScroll, $location, $rootScope, $mdDialog){
			var vm = this;
			/**
			 * IntentLogin
			 */
			vm.IntentLogin = function() {
				var tmpUser = $rootScope.user.isLoggedIn();
				if (!tmpUser) {
					var user_to_set = {};
					$rootScope.facebook.login().then(function(loginReponse){
						if (loginReponse.authResponse) {
							user_to_set.access_token = loginReponse.authResponse.accessToken;
							user_to_set.userID = loginReponse.authResponse.userID;
							$rootScope.facebook.getMyFacebookInformation().then(function(userInfo){
								user_to_set.first_name = userInfo.first_name;
								user_to_set.last_name = userInfo.last_name;
								user_to_set.gender = userInfo.gender;
								user_to_set.email = userInfo.email;
								$rootScope.user.setUser(user_to_set);
								$rootScope.facebook.createFacebookUser(user_to_set).then(function(createdResponse){
								});
							});
						} else {
							console.log('ERROR GETTING LOGIN AUTH RESPONSE');
						}
					});

				} else {
					console.log('USER ALREADY LOGGED IN - ' + tmpUser.first_name + " " + tmpUser.last_name);
				}
			};
			function DialogController($scope, $mdDialog) {
				$scope.hide = function() {
					$mdDialog.hide();
				};

				$scope.cancel = function() {
					$mdDialog.cancel();
				};
			}

			vm.showAdvanced = function(ev, source) {
				var dialogSource = null;
				if (source === "rental") {
					dialogSource = 'checklist/checklist.dialog';
				} else if (source === "checklist") {
					dialogSource = 'checklist/thankyou.dialog';
				}	else if (source === "terms") {
					dialogSource = 'terms/terms';
				} else {
					dialogSource = null;
					//$scope.dialogSource = 'checklist.dialog';
				}
				if (dialogSource !== null) {
					$mdDialog.show({
						controller: DialogController,
						templateUrl: '/js/angularApp/components/' + dialogSource + '.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
						//fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
					})
						.then(function(answer) {
							console.log('either answer or hide were pressed');
						}, function() {
							$scope.status = 'You cancelled the dialog.';
						});
				} else {
					alert('Sorry, something went wrong: ' + source);
				}

			};
			vm.gotoElement = function(eID) {
				// set the location.hash to the id of
				// the element you wish to scroll to.
				$location.hash('intro');
				// call $anchorScroll()
				anchorSmoothScroll.scrollTo(eID);

			};
		}
})();

//UPDATED SDK
//(function(d, s, id){
//	var js, fjs = d.getElementsByTagName(s)[0];
//	if (d.getElementById(id)) {return;}
//	js = d.createElement(s); js.id = id;
//	js.src = "//connect.facebook.net/en_US/sdk.js";
//	fjs.parentNode.insertBefore(js, fjs);
//}(document, 'script', 'facebook-jssdk'));
//CREATE FACEBOOK USER
//$rootScope.auth.createFacebookUser(profile).then(function (resultUser) {
//	if (!resultUser) {
//		console.log('SORRY SOMETHING WENT WRONG');
//	} else {
//		console.log('GOT RESULT FROM FACEBOOK ME');
//		console.log(resultUser);
//	}
//});
//var logout_from_fb = function() {
//	FB.getLoginStatus(function(response) {
//		console.log(response);
//		if (response && response.status === 'connected') {
//			console.log('CALLING FB.LOGOUT');
//			FB.logout(function(logoutResponse) {
//				console.log('FB LOGOUT RESPONSE - ' + logoutResponse);
//				vm.auth.logout();
//			});
//		}
//	});
//};

//var auth_response_change_callback = function(response) {
//	console.log("auth_response_change_callback");
//	console.log(response);
//	FB.getLoginStatus(function (response) {
//		statusChangeCallback(response);
//	});
//};
//var login_event = function(response) {
//	console.log("login_event");
//	console.log(response.status);
//	console.log(response);
//};
//
//var logout_event = function(response) {
//	console.log("logout_event");
//	console.log(response.status);
//	console.log(response);
//	logout_from_fb();
//};
//
//var auth_status_change_callback = function(response) {
//	FB.getLoginStatus(function (response) {
//		statusChangeCallback(response);
//	});
//	console.log("auth_status_change_callback: " + response.status);
//};

//window.fbAsyncInit = function () {
//	FB.init({
//		appId: '120244561900887',
//		cookie: true,  // enable cookies to allow the server to access
//					   // the session
//		xfbml: true,  // parse social plugins on this page
//		version: 'v2.9' // use graph api version 2.8
//	});
//
//	FB.AppEvents.logPageView();
//	FB.Event.subscribe('xfbml.render', finished_rendering);
//	//FB.Event.subscribe('auth.logout', logout_from_fb);
//
//	FB.Event.subscribe('auth.authResponseChange', auth_response_change_callback);
//	FB.Event.subscribe('auth.statusChange', auth_status_change_callback);
//
//	FB.Event.subscribe('auth.login', login_event);
//	FB.Event.subscribe('auth.logout', logout_event);
//
//
//	// Now that we've initialized the JavaScript SDK, we call
//	// FB.getLoginStatus().  This function gets the state of the
//	// person visiting this page and can return one of three states to
//	// the callback you provide.  They can be:
//	//
//	// 1. Logged into your app ('connected')
//	// 2. Logged into Facebook, but not your app ('not_authorized')
//	// 3. Not logged into Facebook and can't tell if they are logged into
//	//    your app or not.
//	//
//	// These three cases are handled in the callback function.
//
//	FB.getLoginStatus(function (response) {
//		statusChangeCallback(response);
//	});
//
//};
