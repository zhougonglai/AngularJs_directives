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

var myAppControllers = angular.module('myApp.controllers', []);
var myAppServices = angular.module('myApp.services', []);
var myAppDirectives = angular.module('myApp.directives', []);


myApp.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {

    var baseViewTplUrl = './templates/view';

    //$locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: baseViewTplUrl + '/HomeView.tpl.html',
            controller: 'HomeController'
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
        .otherwise({
            redirectTo: '/'
        });
}]);

