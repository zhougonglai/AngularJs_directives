/**
 * Created by dulin on 2015/5/25.
 */
myAppControllers.controller('LController', ['$scope', '$log',
    function($scope, $log) {
        $scope.footerConfig = {
            conditionUrl: './jsonData/condition.json'
        }
    }
]);