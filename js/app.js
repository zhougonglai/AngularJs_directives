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
        url: './jsonData/visaProvince.json',
        type: 'visa-province'
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
    $scope.openGoTripDatePicker = function() {
        $scope.$broadcast('openGoTripDatePicker', {
            dateType: 'goTrip'
        });
    };

    $scope.openBackTripDatePicker = function() {
        $scope.$broadcast('openBackTripDatePicker', {
            dateType: 'backTrip'
        });
    };

    //去程低价日历
    $scope.openGoDatePricePicker = function() {
        $scope.$broadcast('openGoDatePricePicker', {
            dateType: 'goTrip',
            renderType: 'goDatePrice'
        });
    };

    //返程低价日历
    $scope.openBackDatePricePicker = function() {
        $scope.$broadcast('openBackDatePricePicker', {
            dateType: 'backTrip',
            renderType: 'backDatePrice'
        });
    };

    $scope.prevDay = function(type) {
        if(type === 'go') {
            //前一天(去程)
            $scope.$broadcast('prevDay', {
                dateType: 'goTrip'
            });
        } else {
            //前一天(返程)
            $scope.$broadcast('prevDay', {
                dateType: 'backTrip'
            });
        }

    };

    $scope.nextDay = function(type) {
        if(type === 'go') {
            //后一天(去程)
            $scope.$broadcast('nextDay', {
                dateType: 'goTrip'
            });
        } else {
            //后一天(返程)
            $scope.$broadcast('nextDay', {
                dateType: 'backTrip'
            });
        }



    };

    $scope.dpConfig = {
        url: '',
        requestData: {}
    };

    $scope.$on('onSelectDate', function(e, data) {
        $log.info(data);

        $scope.goTripDate = data.goDateInfo.curDateObj.dateFormat;
        $scope.goTripDay = ' ' + data.goDateInfo.curDateObj.cnDay;
        $scope.backTripDate = data.backDateInfo.curDateObj.dateFormat;
        $scope.backTripDay = ' ' + data.backDateInfo.curDateObj.cnDay;
    });

}]);