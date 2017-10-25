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
    $scope.translated = false;
    var translatedword='';
    $scope.isLoading=false;
    $scope.languages=[];
    $scope.translationLanguage= "";
    $scope.titleTranslateResults = "";
    $scope.descriptionTranslateResults = "";
    $scope.translatesearch = function(target,word){
        $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+target+'&q='+word).then(function(response){
            $scope.isLoading=true;
            $scope.response = response.data.data.translations;
            translatedword = $scope.response[0].translatedText;
            $scope.targettitle = $scope.response[0].detectedSourceLanguage;
            $scope.translationLanguage =  $scope.response[0].detectedSourceLanguage;
            for(var i=0;i<$scope.languages.length;i++){
                if($scope.languages[i].language === $scope.translationLanguage){
                    $scope.translangValue=$scope.languages[i].name;
                    break;
                }
            }
            $scope.getAllLanguages().then(function success(response){
                 $scope.languages = response.data.data.languages;
            });
                if(!$scope.translated){
                    $scope.search($scope.translationLanguage);
                }
            $scope.translated = true;
            
        })
    }

    $scope.translate = function(target,word){
        return $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+target+'&q='+word);
    }

    $scope.showTranslate = function(r) {
        return $http.get('https://www.googleapis.com/language/translate/v2/detect?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target=en&q='+r.title);
    }

    $scope.translateTitle = function(r,i){
        $scope.showTranslate(r).then(function(response){
            $scope.translatedTitle = response.data.data.detections;
            var language = $scope.translatedTitle[0][0].language;
        if (language != 'en') {
            $scope.targettitle = 'en';
            $scope.translate($scope.targettitle,r.title).then(function(response){
                $scope.result[i].title = response.data.data.translations[0].translatedText;
            });
            $scope.translate($scope.targettitle,r.description).then(function(response){
                $scope.result[i].description = response.data.data.translations[0].translatedText;
            });
        } else {
            $scope.targettitle = $scope.translationLanguage;
            $scope.translate($scope.targettitle,r.title).then(function(response){
                $scope.result[i].title = response.data.data.translations[0].translatedText;
            });
            $scope.translate($scope.targettitle,r.description).then(function(response){
                $scope.result[i].description = response.data.data.translations[0].translatedText;
            });
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
        //var word = $scope.word;
        //var testUrl='https://newsapi.org/v1/articles?source='+word.split(' ').join('')+'&apiKey=10491e51250442cd96af1b3dbeefe7f1';
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
            if($scope.translated){
            var titleSearchString = '';
            var descriptionSearchString = '';
            $scope.result.forEach(function(element) {
                titleSearchString += element.title+'|';
                descriptionSearchString += element.description + '|';
            });
            $scope.translate(translang,titleSearchString).then(function(response){
                debugger;
                $scope.titleTranslateResults = response.data.data.translations[0].translatedText;
                $scope.translate(translang,descriptionSearchString).then(function(response){
                debugger;
                $scope.descriptionTranslateResults = response.data.data.translations[0].translatedText;
                var titles = $scope.titleTranslateResults.split('|');
                var descriptions = $scope.descriptionTranslateResults.split('|');
                $scope.resultTranslate = [];
                titles.forEach(function(elem,i){
                    $scope.resultTranslate.push({title:elem,description:descriptions[i]});
                });
            });
            });
            
            }
            $scope.isLoading=false;
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

