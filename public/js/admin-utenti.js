angular.module("ecm-admin")
    .controller("AdminUtentiCtrl",function ($scope, $http,$location) {
        $scope.page = 0;
        $scope.sortField = 'name';
        $scope.sortDirection = 'asc';
        $scope.searchFilter = '';
        $scope.edit = function () {
            $location.path("/users/" + this.item.name);

        };
        $scope.load = function (page) {
            var url = "/user/list?page=" + page +
                "&sort=" + $scope.sortField +
                "&filter=" + (($scope.$$childHead && $scope.$$childHead.searchFilter) || '')  +
                "&sortDirection=" + $scope.sortDirection;
            $http.get(url)
                .success(function (data) {
                    $scope.users = data.items;
                    $scope.page = data.currPage;
                    $scope.totalPages = data.totalPages;
                })

                .error(function (err) {
                    alert("unable to retrieve users:"+err);
                });
        };
        $scope.search = function(){

            $scope.load(0);
        };
        $scope.sort = function (field) {
            if (field == $scope.sortField) {
                $scope.sortDirection = ($scope.sortDirection == 'asc')
                    ? 'desc'
                    : 'asc';
            }
            else {
                $scope.sortDirection = 'asc';
                $scope.sortField = field;
            }

            $scope.load($scope.page);
        };

        $scope.load(0);

        $scope.nextPage = function () {
            if ($scope.page < $scope.totalPages - 1)
                $scope.load($scope.page + 1);
        };

        $scope.prevPage = function () {
            if ($scope.page > 0)
                $scope.load($scope.page - 1);
        };
        $scope.firstPage = function () {
            if ($scope.page != 0)
                $scope.load(0);
        };
        $scope.lastPage = function () {
            if ($scope.page != $scope.totalPages - 1)
                $scope.load($scope.totalPages - 1);
        };
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



