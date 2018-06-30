/**
 * Created by Bluer on 26/06/2017.
 */
angular.module('therenter')
    .factory('facebookService', function($q, Facebook, $http) {
    return {
        share: function(quote) {
            console.log('SHARING IS CARING');
            var deferred = $q.defer();
            // From now on you can use the Facebook service just as Facebook api says
            Facebook.ui({
                method: 'share',
                quote: quote,
                mobile_iframe: true,
                href: 'https://www.therenter.co.il'
            }, function(response){
                if (response && !response.error_message) {
                    deferred.resolve(response);
                } else {
                    deferred.reject('Error occured');
                }
            });
            return deferred.promise;
        },
        login: function() {
            var deferred = $q.defer();
            // From now on you can use the Facebook service just as Facebook api says
            Facebook.login(function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },
        logout: function(){
            var deferred = $q.defer();
            Facebook.logout(function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },
        getLoginStatus: function() {
            var deferred = $q.defer();
            Facebook.getLoginStatus(function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },
        getMyFacebookInformation: function() {
            var deferred = $q.defer();
            Facebook.api('/me', {
                fields: 'id,email,first_name,gender,last_name'
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },
        createFacebookUser: function(user) {
            var createdUser = undefined;
            if (!createdUser) {
                var deferred = $q.defer();

                // get posts form backend
                $http.post('/api/facebookusers/create', user)
                    .then(function (result) {
                        // save fetched posts to the local variable
                        createdUser = result.data;
                        // resolve the deferred
                        deferred.resolve(createdUser);
                    }, function (error) {
                        createdUser = error;
                        deferred.reject(createdUser);
                    }).then();

                // set the posts object to be a promise until result comeback
                createdUser = deferred.promise;
            }

            // in any way wrap the posts object with $q.when which means:
            // local posts object could be:
            // a promise
            // a real posts data
            // both cases will be handled as promise because $q.when on real data will resolve it immediately
            return $q.when(createdUser);
        }
    }
});