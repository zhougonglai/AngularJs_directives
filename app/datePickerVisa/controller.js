/**
 * Created by dulin on 2015/4/27.
 */
myAppControllers
    .controller('DController', ['$scope', '$log', function ($scope, $log) {
        $scope.$on('onSelectDate', function (e, data) {
            var dateArr = data.dateArr;
            $scope.dateData = data;

            $scope.count = data.count;
            $scope.date = dateArr[0] + '-' + dateArr[1] + '-' + dateArr[2] + ' ' + dateArr[3];
        });

        $scope.datePickerConfig = {
            url: './jsonData/date.json',
            postData: 123123123123,
            version: null,
            nextStepCallBack: function () {
                alert('用户自定义下一步请求回调')
            }
        }
    }]);