myAppControllers.controller('IController', ['$scope', '$log', ($scope, $log)->
    $scope.footerConfig = {
        url: './jsonData/customCondition.json'
    }

    $scope.$on('selectCondition', (e, data)->
        $log.info(data)
        return
    )
    return
])