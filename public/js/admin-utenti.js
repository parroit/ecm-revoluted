angular.module("ecm-admin")
    .controller("AdminUtentiCtrl",function ($scope, $http,$location,pagedGrid) {
        pagedGrid($scope,{
            crudUrl: "/user",
            editUrl: "/users",
            keyName: "name"

        });

    })

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/users', {
                    templateUrl: '/templates/users.html',
                    controller: 'AdminUtentiCtrl'
                }).

                otherwise({
                    redirectTo: '/users'
                });
        }]
    );



