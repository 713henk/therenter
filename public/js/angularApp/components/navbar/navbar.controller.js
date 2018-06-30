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
                if ($rootScope.user.isLoggedIn()) {
                    vm.w3_close();
                    // $rootScope.user.setUser(null);
                    $rootScope.facebook.logout().then(function(logoutResponse){
                        $rootScope.user.setUser(null);
                    });
                }
            }, 5000)

        };
        vm.w3_open = function() {
            document.getElementById("mySidebar").style.display = "block";
            document.getElementById("myOverlay").style.display = "block";
        };

        vm.w3_close = function() {
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