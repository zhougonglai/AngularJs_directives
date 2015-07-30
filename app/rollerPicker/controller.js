/**
 * Created by dulin on 2015/4/27.
 */
myAppControllers
    .controller('FController', ['$scope', '$log', '$interval',function ($scope, $log,$interval) {

        $scope.config = {
            name: 'novaline',
            email: 'novaline@qq.com'
        };

        $scope.vm = {
            money: 8888
        };

        $log.info(angular.identity('aaa', 'bbb'));

        angular.noop()

        $scope.count = 1;

        $interval(function() {
            $scope.count ++;
        }, 1000);
    }]);