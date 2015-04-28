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
            //autoHide: true,
            //delay: 3000
            //footButtonList: [
            //    {
            //        buttonText: '确定',
            //        callBack: function() {
            //            $log.info('确定');
            //        }
            //    },
            //    {
            //        buttonText: '取消',
            //        callBack: function() {
            //            $log.info('取消');
            //        }
            //    }
            //]
        };
        $scope.modalDialogContent = Mock.Random.paragraph();
        $scope.showModalDialog = function() {

            $scope.$broadcast('showModalDialog', {});
            $scope.modalDialogContent = Mock.Random.paragraph();
        };

    }]);