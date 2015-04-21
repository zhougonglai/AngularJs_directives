'use strict';

/* App Module */
var myApp = angular.module('myApp', [
    'modalDialogDirective',
    'selectCityDirective',
    'rollerPickerDirective',
    //'datePickerDirective',
    //'datePicker.base',
    'datePicker.flight',
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
        url: './jsonData/trainCity.json',
        type: 'train'
    };

    $scope.$on('setCityName', function(e, cityObj) {
        $log.info(cityObj);
    });

    $scope.$on('closeSelectCity', function(e, data) {
        $log.info('隐藏城市选择');
    });

}]);

myApp.controller('RPParentController', ['$scope','$http', function($scope, $http) {


    $scope.$on('onSelectDate', function(e, data) {
        $scope.dateData = data;
    });
    $scope.datePickerConfig = {
        url: './jsonData/date.json',
        postData: 123123123123,
        version: null,
        nextStepCallBack: function() {
            //console.log($scope.dateData);
            alert('用户自定义下一步请求回调')
        }
    }
}]);


myApp.controller('DPBaseController', ['$scope','$log', function($scope, $log) {
    $scope.$on('onSelectDate', function(e, data) {
        $log.info(data);
    });
}]);