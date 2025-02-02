'use strict';

/* App Module */
var myApp = angular.module('myApp', [
    'ngRoute',
    'ngTouch',
    'ngAnimate',
    'myApp.services',
    'myApp.controllers',
    'myApp.directives'
]);

var weixinid;

angular.element(document).ready(function() {
    console.log('start');
    weixinid = '1sdfsdf213';
    angular.bootstrap(document, ['myApp']);
});

myApp.run(['$rootScope', '$log', '$timeout', '$window', function($rootScope, $log, $timeout, $window) {
    $rootScope.loading = false;
    $rootScope.$on('$routeChangeStart', function(event, current, previous, rejection) {
        $rootScope.loading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous, rejection) {
        $timeout(function() {
            $rootScope.loading = false;
        }, 1000);
    });
    $rootScope.$on('$routeChangeError', function() {
        $window.location.href = './error.html';
    });
}]).config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(false);
}]);


var myAppControllers = angular.module('myApp.controllers', []);
var myAppServices = angular.module('myApp.services', []);
var myAppDirectives = angular.module('myApp.directives', []);


myApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {

        var baseViewTplUrl = './templates/view';
        $httpProvider.defaults.headers = weixinid;
        //$locationProvider.html5Mode(true);

        $routeProvider
            .when('/home', {
                templateUrl: baseViewTplUrl + '/HomeView.tpl.html',
                controller: 'HomeController',
                resolve: {
                    "ngInfo": ['ngInfo', function(ngInfo) {
                        return ngInfo.getNgVersion();
                    }]
                }
            })
            .when('/modalDialog', {
                templateUrl: baseViewTplUrl + '/ModalDialogView.tpl.html',
                controller: 'AController'
            })
            .when('/datePicker/base', {
                templateUrl: baseViewTplUrl + '/DatePickerBaseView.tpl.html',
                controller: 'BController'
            })
            .when('/datePicker/flight', {
                templateUrl: baseViewTplUrl + '/DatePickerFlightView.tpl.html',
                controller: 'CController'
            })
            .when('/datePicker/visa', {
                templateUrl: baseViewTplUrl + '/DatePickerVisaView.tpl.html',
                controller: 'DController'
            })
            .when('/cityPicker', {
                templateUrl: baseViewTplUrl + '/CityPickerView.tpl.html',
                controller: 'EController'
            })
            .when('/rollerPicker', {
                templateUrl: baseViewTplUrl + '/RollerPickerView.tpl.html',
                controller: 'FController'
            })
            .when('/swiperList', {
                templateUrl: baseViewTplUrl + '/SwiperListView.tpl.html',
                controller: 'GController'
            })
            .when('/tab', {
                templateUrl: baseViewTplUrl + '/tabView.tpl.html',
                controller: 'HController'
            })
            .when('/footer', {
                templateUrl: baseViewTplUrl + '/FooterView.tpl.html',
                controller: 'IController'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }
]);
