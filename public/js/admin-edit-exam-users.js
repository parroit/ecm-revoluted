angular.module("ecm-admin")
    .controller("AdminEditExamUsers",function ($scope, $http,$routeParams,pagedGrid) {
        $scope.codiceEsame = $routeParams.codiceEsame;
        pagedGrid($scope,{
            crudUrl: "/exams-users/"+$routeParams.codiceEsame,
            editUrl: "/users/",
            keyName: "user_id"

        });

    })

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/exams-users/:codiceEsame', {
                    templateUrl: '/ng-templates/edit-exam-users',
                    controller: 'AdminEditExamUsers'
                });
        }]
    );



