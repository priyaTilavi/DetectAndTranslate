angular.module('detectApp', ['ngMaterial','ngRoute','googleApp','systranApp'])
 .config(function ($httpProvider, $routeProvider) {
    $routeProvider
        .when("/translation", {
            templateUrl : "/resources/templates/translate.html",
            controller : "translateContrl"
        })
        .when("/translationSys", {
            templateUrl : "/resources/templates/translate.html",
            controller : "translateSysContrl"
        })

});