/**
 * Created by dulin on 2015/5/22.
 */
myAppControllers.controller('KController', ['$scope', '$log', '$window', '$location', '$timeout', '$animate', '$route', '$http',
    function($scope, $log, $window, $location, $timeout, $animate, $route, $http) {
    $log.info('1');
    $scope.reload = function() {
        $log.info('刷新');
        //$window.location.href = $location.absUrl();  //刷新测试无效
        //$window.location.reload() //刷新全部页面
        $route.reload(); //刷新单页面，即刷新当前路由对应的view
    };
    //
    //var promise = $http({
    //    url: './jsonData/ngVersion.json',
    //    method: 'POST'
    //});
    //
    //promise.then(function(data, status, headers) {
    //    $log.info('请求成功，刷新当前页面');
    //    $route.reload();
    //})


    var rootEle = document.querySelector('html'),
        $rootEle = angular.element(rootEle);

    var $rootS = $rootEle.scope();
debugger

}]);