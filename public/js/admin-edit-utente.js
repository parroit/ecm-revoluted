angular.module("ecm-admin")
    .controller("AdminEditUtente",function ($scope, $http,$routeParams) {

        $scope.save = function(){
            var user = angular.copy($scope.user);
            delete user.name;
            delete user._id;
            delete user.__v;
            $http.post("/user/" + $routeParams.name, user)

                .success(function (data) {
                    $scope.user = data;
                    alert("user saved!");

                })

                .error(function (err) {
                    alert("unable to retrieve user:"+err);
                });
        };

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



