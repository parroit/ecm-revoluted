
angular.module("ecm-admin")
    .controller("AdminEsamiCtrl",function ($scope, $http) {
        $http.get("/exams")
            .success(function (data) {
                $scope.exams = data;
            })

            .error(function () {
                alert("unable to retrieve exams.");
            });
    })

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/exams', {
                    templateUrl: '/templates/exams.html',
                    controller: 'AdminEsamiCtrl'
                })
        }]
    );

