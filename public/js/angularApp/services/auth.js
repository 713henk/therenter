//(function () {
//
//    'use strict';
//
//    angular
//        .module('therenter')
//        .factory('UserService', [function() {
//            return {
//                isLogged: false,
//                username: ''
//            };
//        }])
//        .service('authService', authService);
//
//    authService.$inject = ['$rootScope'];
//
//    function authService($rootScope) {
//        var watchLoginChange = function() {
//            FB.Event.subscribe('auth.authResponseChange', function(res) {
//                var user_to_set = {};
//                if (res.status === 'connected') {
//                    /*
//                    The user is already logged,
//                    is possible retrieve his personal info
//                    */
//
//                    /*
//                    This is also the point where you should create a
//                    session for the current user.
//                    For this purpose you can use the data inside the
//                    res.authResponse object.
//                    */
//                    if (res.authResponse) {
//                        user_to_set.access_token = res.authResponse.accessToken;
//                        user_to_set.userID = res.authResponse.userID;
//                        $rootScope.facebook.getMyFacebookInformation().then(function(userInfo){
//                            user_to_set.first_name = userInfo.first_name;
//                            user_to_set.last_name = userInfo.last_name;
//                            user_to_set.gender = userInfo.gender;
//                            user_to_set.email = userInfo.email;
//                            $rootScope.user.setUser(user_to_set);
//                        });
//                    } else {
//                        console.log('ERROR GETTING AUTH RESPONSE ON CHANGE - AUTH SERVICE');
//                    }
//                }
//                else {
//                    /*
//                     The user is not logged to the app, or into Facebook:
//                     destroy the session on the server.
//                     */
//                    user_to_set = null;
//                    $rootScope.user.setUser(user_to_set);
//                }
//            });
//        };
//
//        return {
//            watchLoginChange: watchLoginChange
//        }
//    }
//})();