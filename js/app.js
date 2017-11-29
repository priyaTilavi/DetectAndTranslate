var app = angular.module('detectApp', ['ngMaterial','ngRoute']);

app.controller('translateContrl',[ '$http','$scope', function ($http,$scope){
    $scope.target='en';
    $scope.translated = false;
    var translatedword='';
    $scope.isLoading=false;
    $scope.languages=[];
    $scope.translationLanguage= "";
    $scope.titleTranslateResults = "";
    $scope.descriptionTranslateResults = "";
    $scope.translatesearch = function(target,word){
        $scope.show = "Show in ";
        $scope.isLoading=true;
        $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+target+'&q='+word).then(function(response){
            $scope.response = response.data.data.translations;
            translatedword = $scope.response[0].translatedText;
            $scope.targettitle = $scope.response[0].detectedSourceLanguage;
            $scope.translationLanguage =  $scope.response[0].detectedSourceLanguage;
            $scope.show += "english";
            for(var i=0;i<$scope.languages.length;i++){
                if($scope.languages[i].language === $scope.translationLanguage){
                    $scope.translangValue=$scope.languages[i].name;
                    break;
                }
            }
            $scope.getAllLanguages().then(function success(response){
                 $scope.languages = response.data.data.languages;
            });
                    $scope.search($scope.translationLanguage);

            
        })
    }

    $scope.translate = function(target,word){
        return $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+target+'&q='+word);
    }

    $scope.showTranslate = function(r) {
        return $http.get('https://www.googleapis.com/language/translate/v2/detect?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target=en&q='+r.title);
    }

    $scope.translateTitle = function(r,i,translang){
        $scope.showTranslate(r).then(function(response){
            $scope.show = "Show in ";
            $scope.translatedTitle = response.data.data.detections;
            var language = $scope.translatedTitle[0][0].language;
        if (language != 'en') {
            $scope.targettitle = 'en';
            $scope.translate($scope.targettitle,r.title).then(function(response){
                $scope.resultTranslate[i].title = response.data.data.translations[0].translatedText;
            });
            $scope.translate($scope.targettitle,r.description).then(function(response){
                $scope.resultTranslate[i].description = response.data.data.translations[0].translatedText;
            });
            $scope.show += $scope.translangValue;
        } else {
            $scope.targettitle = translang;
            $scope.translate($scope.targettitle,r.title).then(function(response){
                $scope.resultTranslate[i].title = response.data.data.translations[0].translatedText;
            });
            $scope.translate($scope.targettitle,r.description).then(function(response){
                $scope.resultTranslate[i].description = response.data.data.translations[0].translatedText;
            });
            $scope.show += "English";
        }
        });


    }
     $scope.searchOnly = function(word){
        //var word = $scope.word;
        //var testUrl='https://newsapi.org/v1/articles?source='+word.split(' ').join('')+'&apiKey=10491e51250442cd96af1b3dbeefe7f1';
        var original='http://api-as01.dev.gale.web:8080/api/v1/items?callback=JSON_CALLBACK&q='+word+'&api_key=api-1234';
        $scope.isLoading=true;
        $http({url:original,method:'JSONP'}).then(function success(result){
            $scope.countresults = result.data.count;
            $scope.resultTranslate = result.data.docs;
            $scope.isLoading=false;
        });
     }

    $scope.getAllLanguages= function(){
        var languageURl = 'https://translation.googleapis.com/language/translate/v2/languages?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target=en';
        return $http({url:languageURl,method:'GET'});

    }

    $scope.search = function(translang){
        var original='http://api-as01.dev.gale.web:8080/api/v1/items?callback=JSON_CALLBACK&q='+translatedword+'&api_key=api-1234';
        $scope.isLoading=true;
        $http({url:original,method:'JSONP'}).then(function success(result){
            
            $scope.countresults = result.data.count;
            $scope.result = result.data.docs;
            for(var i=0;i<$scope.languages.length;i++){
                if($scope.languages[i].language === translang){
                    $scope.translangValue=$scope.languages[i].name;
                    break;
                }
            }
            // $scope.countresults = result.data.articles.length;
            // $scope.result = result.data.articles;
            var titlePromises = [];
            var descriptionPromises = [];
            for(var i=0;i<10;i++){
                var titleSearchString = $scope.result[i].title;  
                var descriptionSearchString = $scope.result[i].description;  
                titlePromises.push($scope.translate(translang,titleSearchString));
                descriptionPromises.push($scope.translate(translang,descriptionSearchString));;
            }
            var resultTranslate = [];
            Promise.all(titlePromises.concat(descriptionPromises)).then(function(response){
                    
                    for(var i=0,j=10;j<20;i++,j++){
                       resultTranslate.push({title:response[i].data.data.translations[0].translatedText,description:response[j].data.data.translations[0].translatedText}); 
                    }
                    
                }).then(function(){
                    $scope.$apply(function(){
                        $scope.resultTranslate = resultTranslate;
                        $scope.isLoading=false;
                    });
                    
                });
        });
    }

}]);

app.config(function ($httpProvider, $routeProvider) {
    $routeProvider
        .when("/translation", {
            templateUrl : "/resources/templates/translate.html",
            controller : "translateContrl"
        })

});

