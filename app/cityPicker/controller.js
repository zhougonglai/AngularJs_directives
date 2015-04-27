/**
 * Created by dulin on 2015/4/27.
 */
myAppControllers
    .controller('EController', ['$scope', '$log', function ($scope, $log) {
        $scope.showCityPicker = function () {
            $scope.$broadcast('openSelectCity', {});
        };

        $scope.cityPickerConfig = {
            url: './jsonData/visaProvince.json',
            type: 'visa-province'
        };

        $scope.$on('setCityName', function (e, cityObj) {
            $log.info(cityObj);
        });

        $scope.$on('closeSelectCity', function (e, data) {
            $log.info('隐藏城市选择');
        });
    }]);