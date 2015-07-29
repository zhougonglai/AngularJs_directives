/**
 * Created by dulin on 2015/4/9.
 */
myAppDirectives
    .constant('rollerPickerConfig', {})
    .directive('rollerPicker', ['$document','$timeout','$parse',  function ($document, $timeout, $parse) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: './templates/directive/rollerPicker.tpl.html',
            link: function (scope, element, attrs) {
                var isBool = scope.$eval(attrs.isBool),
                    isNumber = scope.$eval(attrs.isNum),
                    config = scope.$eval(attrs.config);


                var money = $parse(attrs.money);

                $timeout(function() {
                    money.assign(scope, 9999);
                }, 2000);


            }
        }
    }]);
