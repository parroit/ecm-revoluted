function AdminEsamiCtrl($scope, $http) {
    $http.get("/exams")
        .success(function (data) {
            $scope.exams = data;
        })

        .error(function () {
            alert("unable to retrieve exams.");
        });
}

