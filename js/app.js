var app = angular.module('detectApp', ['ngMaterial','ngRoute']);

// app.controller('transContrl',[ '$http','$scope', function ($http,$scope){
//     $scope.transarray = [{Query:'microscopia'},{Query:'odontologia'},{Query:'teologia'},{Query:'mujeres gestantes'},{Query:'hija'},{Query:'date de naissance'},{Query:'contabilidade gerencial'}];
//     $scope.target='en';
//     $scope.show = false;
//     $scope.translate = function(trans){
//         $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.target+'&q='+trans.Query).then(function(response){
//             debugger;
//             $scope.response = response.data.data.translations;
//             $scope.search(trans);
//             $scope.index=$scope.transarray.indexOf(trans)
//         })
//     }
//     $scope.search = function(trans){
//         $http({url:'http://api-as01.dev.gale.web:8080/api/v1/items?q=happy&api_key=api-1234',method: 'GET',headers: {
//             'Content-Type': 'application/json; charset=utf-8'
//         }}).then(function success(result){
//             $scope.result = result.data.docs;
//             $scope.count.response = $scope.response;
//         });
//     }
//
// }]);

app.controller('translateContrl',[ '$http','$scope', function ($http,$scope){
    $scope.target='en';
    $scope.show = "translate";
    $scope.translatesearch = function(){
        $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.target+'&q='+$scope.word).then(function(response){
            debugger;
            $scope.response = response.data.data.translations;
            var translatedword = $scope.response[0].translatedText;
            $scope.targettitle = $scope.response[0].detectedSourceLanguage;
            $scope.search(translatedword);
        })
    }
    $scope.translate = function(){
        $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.target+'&q='+$scope.word).then(function(response){
            debugger;
            $scope.response = response.data.data.translations;
            $scope.targettitle ='en';
            var word = $scope.word;
            $scope.search(word);
        })
    }

    function showTranslate(r) {
        $http.get('https://www.googleapis.com/language/translate/v2/detect?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target=en&q='+r.title).then(function(response){
            $scope.translatedTitle = response.data.data.detections;
            var language = $scope.translatedTitle[0][0].language;

        if (language != 'en') {
            $scope.targettitle = 'en';
        } else {
            $scope.targettitle = $scope.response[0].detectedSourceLanguage;
        }
        })
    }

    $scope.translateTitle = function(r){
        debugger;
        showTranslate(r);
        $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.targettitle+'&q='+r.title).then(function(response){
            $scope.translatedTitle = response.data.data.translations;
            r.translatedTitle = $scope.translatedTitle[0].translatedText;
        })
        $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.targettitle+'&q='+r.description).then(function(response){
            $scope.translatedDescription = response.data.data.translations;
            r.translatedDescription = $scope.translatedDescription[0].translatedText;
        })


    }




    $scope.search = function(word){
        $http({url:'http://api-as01.dev.gale.web:8080/api/v1/items?callback=JSON_CALLBACK&q='+word+'&api_key=api-1234',method: 'JSONP'}).then(function success(result){
            $scope.countresults = result.data.count;
            $scope.result = result.data.docs;
        });
    }

}]);

app.config(function ($httpProvider, $routeProvider) {
    $routeProvider
        .when("/translation", {
            templateUrl : "/resources/templates/translate.html",
            controller : "translateContrl"
        })
        .when("/first", {
            templateUrl : "/resources/templates/first.html",
            controller : "transContrl"
        })

});

