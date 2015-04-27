/**
 * Created by dulin on 2015/4/27.
 */
/**
 * Created by dulin on 2015/4/27.
 */

myAppControllers
    .controller('AController', ['$scope', '$log', function ($scope, $log) {

        $scope.modalDialog = {
            title: '自定义模态框',
            show: false
        };
        $scope.modalDialogContent = Mock.Random.paragraph();
        $scope.showModalDialog = function() {

            $scope.$broadcast('showModalDialog', {});
            $scope.modalDialogContent = Mock.Random.paragraph();
        };

    }]);