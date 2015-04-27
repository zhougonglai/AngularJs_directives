/**
 * Created by dulin on 2015/4/27.
 */
myAppControllers
    .controller('HomeController', ['$scope', '$log', '$location', function ($scope, $log, $location) {
        $scope.directiveListClickHandler = function (e) {
            var target = e.target,
                id = target.id;
            if(target.nodeName.toLocaleUpperCase() === 'A') {
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
                    default:
                        break;
                }
            }
        }
    }]);