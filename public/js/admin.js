var app = angular.module("ecm-admin",[]);
app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    }
);
