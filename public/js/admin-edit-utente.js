angular.module("ecm-admin")
    .controller("AdminEditUtente",function ($scope, $http,$routeParams) {


        $http.get("/user/" + $routeParams.name)

            .success(function (data) {
                $scope.user = data;

            })

            .error(function (err) {
                alert("unable to retrieve user:"+err);
            });
    })

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/users/:name', {
                    templateUrl: '/ng-templates/edit-user',
                    controller: 'AdminEditUtente'
                });
        }]
    );



