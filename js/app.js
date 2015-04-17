'use strict';

/* App Module */
var myApp = angular.module('myApp', [
    'modalDialogDirective',
    'selectCityDirective',
    'rollerPickerDirective',
    'datePickerDirective',
    'ngTouch',
    'services'
]);

myApp.controller('TestController', ['$scope', function($scope) {
    $scope.modalDialog = {
        title: '模态框',
        show: true,
        footerButton: 2
    };
}]);

myApp.controller('SelectCityController', ['$scope', '$http', '$log', function($scope, $http, $log) {
    $scope.show = function() {
        $scope.$broadcast('openSelectCity', {});
    };

    $scope.selectCityConfig = {
        url: './jsonData/flightCity.json',
        type: 'flight'
    };

    $scope.$on('setCityName', function(e, cityName) {
        //debugger;
    });

    $scope.$on('closeSelectCity', function(e, data) {
        $log.info('123');
    });

}]);

myApp.controller('RPParentController', ['$scope','$http', function($scope, $http) {


    $scope.$on('onSelectDate', function(e, data) {
        console.log(data);
    });
    $scope.datePickerConfig = {
        url: './jsonData/date.json',
        postData: 123123123123,
        version: null,
        nextStepCallBack: function() {
            alert('用户自定义下一步请求回调')
        }
    }
}]);