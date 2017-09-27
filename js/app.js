var app = angular.module('detectApp', ['ngMaterial','ngRoute']);
    
    app.controller('transContrl',[ '$http','$scope', function ($http,$scope){
        $scope.transarray = [{Query:'microscopia'},{Query:'odontologia'},{Query:'teologia'},{Query:'mujeres gestantes'},{Query:'hija'},{Query:'date de naissance'},{Query:'contabilidade gerencial'}];
        $scope.target='en';
        $scope.show = false;
        $scope.translate = function(trans){
            $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.target+'&q='+trans.Query).then(function(response){
                debugger;
                $scope.response = response.data.data.translations;
                $scope.search(trans);
                $scope.index=$scope.transarray.indexOf(trans)
            })
        }
        $scope.search = function(trans){
            
            $http({url:'http://api-as01.dev.gale.web:8080/api/v1/items?q=happy&api_key=api-1234',method: 'GET',headers: {
                    'Content-Type': 'application/json; charset=utf-8'
        }}).then(function success(result){
                    $scope.result = result.data.docs;
                    $scope.count.response = $scope.response;
            });
        }
        
    }]);

    app.controller('translateContrl',[ '$http','$scope', function ($http,$scope){
        $scope.target='en';
        $scope.show = "translate";
        $scope.translatesearch = function(){
            $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.target+'&q='+$scope.word).then(function(response){
                debugger;
                $scope.response = response.data.data.translations;
                var word = $scope.word;
                var translatedword = $scope.response[0].translatedText;
                $scope.targettitle = $scope.response[0].detectedSourceLanguage;
                if($scope.show == "translate"){$scope.show == "translate"}
                $scope.search(translatedword);
            })
        }
        $scope.translate = function(){
            $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.target+'&q='+$scope.word).then(function(response){
                debugger;
                $scope.response = response.data.data.translations;
                $scope.show = "translate to"+$scope.target;
                var word = $scope.word;
                $scope.search(word);
            })
        }
        $scope.translateTitle = function(r){
            $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.targettitle+'&q='+r.title).then(function(response){
                debugger;
                if($scope.show == "translate"){
                    $scope.targettitle = 'en';
                    $scope.show = "translate to English";
                }else{
                    $scope.targettitle =$scope.response[0].detectedSourceLanguage;
                    $scope.show = "translate";
                }
                
                $scope.translatedTitle = response.data.data.translations;
                r.translatedTitle = $scope.translatedTitle[0].translatedText;
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

