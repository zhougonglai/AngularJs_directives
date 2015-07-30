myAppControllers.controller('IController', ['$scope', '$log', '$window', ($scope, $log, $window)->
    $scope.footerConfig = {
        url: './jsonData/customCondition.json'
    }

    $scope.$on('selectCondition', (e, data)->
        $log.info(data)
        return
    )

    return
])