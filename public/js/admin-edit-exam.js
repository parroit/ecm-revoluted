angular.module("ecm-admin")
    .controller("AdminEditExam",function ($scope, $http,$routeParams) {

        $scope.save = function(){
            var exam = angular.copy($scope.exam);
            delete exam.codice;
            delete exam._id;
            delete exam.__v;
            delete exam.questions;
            $http.post("/exam/" + $routeParams.codice, exam)

                .success(function (data) {
                    $scope.exam = data;
                    alert("exam saved!");

                })

                .error(function (err) {
                    alert("unable to retrieve exam:"+err);
                });
        };

        $http.get("/exam/" + $routeParams.codice)

            .success(function (data) {
                $scope.exam = data;

            })

            .error(function (err) {
                alert("unable to retrieve exam:"+err);
            });
    })

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/exam/:codice', {
                    templateUrl: '/ng-templates/edit-exam',
                    controller: 'AdminEditExam'
                });
        }]
    );



