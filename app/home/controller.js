/**
 * Created by dulin on 2015/4/27.
 */
myAppControllers
    .controller('HomeController', ['$scope', '$log', '$location','ngInfo', '$window', '$route', function ($scope, $log, $location, ngInfo, $window, $route) {
        $scope.directiveListClickHandler = function (e) {
            var target = e.target,
                id = target.id;
            if (target.nodeName.toLocaleUpperCase() === 'A') {
                switch (id) {
                    case 'j-modal-dialog':
                        $location.path('/modalDialog');
                        break;
                    case 'j-date-picker-base':
                        $location.path('/datePicker/base');
                        break;
                    case 'j-date-picker-flight':
                        $location.path('/datePicker/flight');
                        break;
                    case 'j-date-picker-visa':
                        $location.path('/datePicker/visa');
                        break;
                    case 'j-city-picker':
                        $location.path('/cityPicker');
                        break;
                    case 'j-roller-picker':
                        $location.path('/rollerPicker');
                        break;
                    case 'j-swiper-list':
                        $location.path('/swiperList');
                        break;
                    case 'j-tab':
                        $location.path('/tab');
                        break;
                    case 'j-tab2':
                        $location.path('/tab2');
                        break;
                    case 'j-footer':
                        $location.path('/footer');
                        break;
                    default:
                        break;
                }
            }
        };
        $log.debug('if "debugEnabled" is set to "false", this message will not display');
        if(ngInfo.data) {
            $scope.ngVersion = ngInfo.data.ngVersion;
        }

        $scope.directiveListMouseOverHandler = function (e) {
            var target = e.target,
                id = target.id;
            if (target.nodeName.toLocaleUpperCase() === 'A') {
                $scope.$broadcast('mouseOverEvent', {
                    e: e,
                    imgUrl: [
                        './img/1.jpg',
                        './img/2.jpg',
                        './img/3.jpg',
                        './img/4.jpg',
                        './img/5.jpg',
                        './img/6.jpg'
                    ]
                });
            }
        };

        $log.info('1');
        $scope.reload = function() {
            $log.info('刷新');
            //$window.location.href = $location.absUrl();  //刷新测试无效
            //$window.location.reload() //刷新全部页面
            $route.reload(); //刷新单页面，即刷新当前路由对应的view
        };
    }]);