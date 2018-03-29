angular.module('detectApp', ['ngMaterial','ngRoute','googleApp','systranApp','microApp'])
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
        .when("/translationMicro", {
            templateUrl : "/resources/templates/translate.html",
            controller : "translateMicroContrl"
        })

});