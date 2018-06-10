/**
 * Created by Bluer on 11/06/2017.
 */
(function () {

    'use strict';

    angular
        .module('therenter')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$rootScope', '$timeout'];

    function NavbarController($rootScope, $timeout) {

        var vm = this;
        vm.contactForm = {
            name: "",
            email: "",
            topic: "",
            content: ""
        };
        vm.logout = function () {
            $timeout(function(){
                console.log('INTENT LOGOUT');
                if ($rootScope.user.isLoggedIn()) {
                    vm.w3_close();
                    console.log('not yett')
                    // $rootScope.user.setUser(null);
                    $rootScope.facebook.logout().then(function(logoutResponse){
                        console.log('LOGOUT RESPONSE - ' + logoutResponse);
                        $rootScope.user.setUser(null);
                    });
                }
            }, 5000)

        };
        vm.w3_open = function() {
            console.log('OPEN SMALL MENU');
            document.getElementById("mySidebar").style.display = "block";
            document.getElementById("myOverlay").style.display = "block";
        };

        vm.w3_close = function() {
            console.log('CLOSE SMALL MENU');
            document.getElementById("mySidebar").style.display = "none";
            document.getElementById("myOverlay").style.display = "none";
        };
        vm.myFunction = function() {
            var x = document.getElementById("myTopnav");
            if (x.className === "topnav") {
                x.className += " responsive";
            } else {
                x.className = "topnav";
            }
        };
    }

}());