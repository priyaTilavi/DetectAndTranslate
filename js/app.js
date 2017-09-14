var app = angular.module('detectApp', ['ngMaterial']);
    
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
            
            $http({url:'http://api.galegroup.com/api/v1/items?collection.id=AONE&q=war&api_key=b2ee18c0-98f4-11e7-a0a0-005056b83960',method: 'GET',headers: {
                    'Content-Type': 'application/json; charset=utf-8'
        }}).then(function success(result){
                    $scope.count = result;
            });
        }
        
    }]);

    app.config(function ($httpProvider) {
        
});

