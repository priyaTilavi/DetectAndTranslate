var app = angular.module('systranApp', []);

app.controller('translateSysContrl',[ '$http','$scope', function ($http,$scope){
    $scope.target='en';
    $scope.translated = false;
    var baseURL = 'https://api-platform.systran.net/translation/text/translate?key=1051ecf3-4a10-41eb-ad73-18ee21e8dd68';
    var translatedword='';
    $scope.show="";
    $scope.isLoading=false;
    $scope.languages=[];
    $scope.translationLanguage= "";
    $scope.titleTranslateResults = "";
    $scope.descriptionTranslateResults = "";
    $scope.click=false;
    $scope.translatesearch = function(target,word){
        $scope.show = "Show in ";
        $scope.isLoading=true;
        $http.get(baseURL+'&target='+target+'&input='+word).then(function(response){
            debugger;
            $scope.response = response.data.outputs;
            translatedword = $scope.response[0].output;
            $scope.targettitle = $scope.response[0].detectedLanguage;
            $scope.translationLanguage =  $scope.response[0].detectedLanguage;
            
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

            $scope.show += $scope.translationLanguage;
        })
    }

    $scope.translate = function(target,word){
        return $http.get(baseURL+'&target='+target+'&input='+word);
    }

    $scope.showTranslate = function(r) {
        return $http.get(baseURL+'&target='+'en&input='+r.title);
    }

    $scope.translateTitle = function(r,i,translang){
        debugger;
        $scope.click=true;
        $scope.translate($scope.targettitle,r.title).then(function(response){
            $scope.resultTranslate[i].show = "Show in ";
            $scope.translatedTitle = response.data.outputs[0].output;
            var language = response.data.outputs[0].detectedLanguage;
        if ($scope.targettitle != 'en') {
            
            
            $scope.translate($scope.targettitle,r.title).then(function(response){
                $scope.resultTranslate[i].title = response.data.outputs[0].output;
            });
            $scope.translate($scope.targettitle,r.description).then(function(response){
                $scope.resultTranslate[i].description = response.data.outputs[0].output;
            });
            $scope.resultTranslate[i].show += "English";
            $scope.targettitle = 'en';
            
        } else {
            
            $scope.translate($scope.targettitle,r.title).then(function(response){
                $scope.resultTranslate[i].title = response.data.outputs[0].output;
            });
            $scope.translate($scope.targettitle,r.description).then(function(response){
                $scope.resultTranslate[i].description = response.data.outputs[0].output;
            });
            
            
            if($scope.translang != null){
                $scope.resultTranslate[i].show += $scope.translang;
            }
            if(translang == null){
                $scope.targettitle = $scope.translationLanguage;
            }
            if(translang != null){
                $scope.targettitle = translang;
            }
            $scope.resultTranslate[i].show += $scope.translangValue;
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
            $scope.resultTranslate = $scope.result;
            for(var i=0;i<$scope.languages.length;i++){
                if($scope.languages[i].language === translang){
                    $scope.translangValue=$scope.languages[i].name;
                    break;
                }
            }
            $scope.isLoading=false;
            // $scope.countresults = result.data.articles.length;
            // $scope.result = result.data.articles;
            /*var titlePromises = [];
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
                       resultTranslate.push({title:response[i].data.data.translations[0].translatedText,description:response[j].data.data.translations[0].translatedText,show:"show in english"}); 
                    }
                    
                }).then(function(){
                    $scope.$apply(function(){
                        $scope.resultTranslate = resultTranslate;
                        
                    });
                    
                });*/
        });
    }

}]);


