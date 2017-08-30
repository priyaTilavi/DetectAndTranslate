var app = angular.module('detectApp', ['ngMaterial']);
    
    app.controller('transContrl',[ '$http','$scope', function ($http,$scope){
        $scope.transarray = [{Query:'microscopia'},{Query:'odontologia'},{Query:'teologia'},{Query:'mujeres gestantes'},{Query:'hija'},{Query:'date de naissance'},{Query:'contabilidade gerencial'}];
        $scope.target='en';
        $scope.show = false;
        $scope.translate = function(trans){
            $http.get('https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target='+$scope.target+'&q='+trans.Query).then(function(response){
                debugger;
                $scope.response = response.data.data.translations;
                $scope.index=$scope.transarray.indexOf(trans)
            })
        }
        
    }]);

    app.directive('editable', [function () {
    return {
       restrict: 'A',
       link: function (scope, elem, attrs) {
           elem.bind('click', function(event) {
               console.log(attrs.Editable);
           });
       }
    };
}])
    