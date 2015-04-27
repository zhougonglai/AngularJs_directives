myAppControllers
    .controller('CController', ['$scope', '$log', function ($scope, $log) {

        $scope.openGoTripDatePicker = function () {
            $scope.$broadcast('openGoTripDatePicker', {
                dateType: 'goTrip'
            });
        };

        $scope.openBackTripDatePicker = function () {
            $scope.$broadcast('openBackTripDatePicker', {
                dateType: 'backTrip'
            });
        };

        //去程低价日历
        $scope.openGoDatePricePicker = function () {
            $scope.$broadcast('openGoDatePricePicker', {
                dateType: 'goTrip',
                renderType: 'goDatePrice'
            });
        };

        //返程低价日历
        $scope.openBackDatePricePicker = function () {
            $scope.$broadcast('openBackDatePricePicker', {
                dateType: 'backTrip',
                renderType: 'backDatePrice'
            });
        };

        $scope.prevDay = function (type) {
            if (type === 'go') {
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

        $scope.nextDay = function (type) {
            if (type === 'go') {
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
            url: ''
        };

        $scope.$on('onSelectDate', function (e, data) {
            $log.info(data);

            $scope.goTripDate = data.goDateInfo.curDateObj.dateFormat;
            $scope.goTripDay = ' ' + data.goDateInfo.curDateObj.cnDay;
            $scope.backTripDate = data.backDateInfo.curDateObj.dateFormat;
            $scope.backTripDay = ' ' + data.backDateInfo.curDateObj.cnDay;
        });
    }]);