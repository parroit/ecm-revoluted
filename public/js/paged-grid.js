function requiredParam(params,name){
    if (name in params)
        return params[name];
    throw new Error("Option "+name+" required");
}
angular.module("ecm-admin")
    .factory("pagedGrid",function ($http,$location) {
        return function pagedGrid($scope,options){
            var crudUrl = requiredParam(options,"crudUrl");
            var editUrl = requiredParam(options,"editUrl");
            var keyName = requiredParam(options,"keyName");
            var initialSort = options.initialSort || keyName;

            $scope.page = 0;
            $scope.sortField = initialSort;
            $scope.sortDirection = 'asc';
            $scope.searchFilter = '';
            $scope.edit = function () {
                $location.path(editUrl + "/" + this.item[keyName]);

            };
            $scope.load = function (page) {
                var url = crudUrl + "/list?page=" + page +
                    "&sort=" + $scope.sortField +
                    "&filter=" + (($scope.$$childHead && $scope.$$childHead.searchFilter) || '')  +
                    "&sortDirection=" + $scope.sortDirection;
                $http.get(url)
                    .success(function (data) {
                        $scope.items = data.items;
                        $scope.page = data.currPage;
                        $scope.totalPages = data.totalPages;
                    })

                    .error(function (err) {
                        alert("unable to retrieve rows:"+err);
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
        };
    });




