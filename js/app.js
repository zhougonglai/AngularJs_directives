'use strict';

/* App Module */
var myApp = angular.module('myApp', [
    'modalDialogDirective',
    'selectCityDirective',
    'rollerPickerDirective',
    'datePickerDirective'
]);

myApp.controller('TestController', ['$scope', function($scope) {
    $scope.modalDialog = {
        title: '模态框',
        show: true,
        footerButton: 2
    };
}]);

myApp.controller('SelectCityController', ['$scope', '$http', function($scope, $http) {
    $scope.$on('setCityName', function(e, cityName) {
        //debugger;
    });

}]);

myApp.controller('RPParentController', ['$scope','$http', function($scope, $http) {
    $http({
        method: 'POST',
        url: './jsonData/city.json'
    }).success(function(data) {
        $scope.cityData = data.data;
    });

    $scope.$on('onSelectDate', function(e, data) {
        debugger;
    })
}]);