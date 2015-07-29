/**
 * Created by dulin on 2015/4/27.
 */
myAppControllers
    .controller('FController', ['$scope', '$log', function ($scope, $log) {

        $scope.config = {
            name: 'novaline',
            email: 'novaline@qq.com'
        };

        $scope.vm = {
            money: 8888
        }
    }]);