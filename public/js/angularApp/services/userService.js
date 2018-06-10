/**
 * Created by Bluer on 26/06/2017.
 */
angular.module('therenter')
    .factory('UserService', [function() {
        var user;

        return{
            setUser : function(aUser){
                user = aUser;
            },
            isLoggedIn : function(){
                return(user)? user : false;
            }
        }
    }]);

