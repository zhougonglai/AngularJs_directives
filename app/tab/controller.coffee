myAppControllers.controller('HController', ['$scope', '$log', ($scope, $log)->
    $scope.tabConfig = {
        titleList: ['title1', 'title2', 'title3']
    }

    mockDataTpl = {
        'list|20': [
            {
                'title':'@STRING'
            }
        ]
    }
    $scope.list = Mock.mock(mockDataTpl).list

    $scope.$on('tabClickEvent', (e, data)->
        index = data.index
        switch index
            when 0
                mockDataTpl = {
                    'list|20': [
                        {
                            'title':'@STRING'
                        }
                    ]
                }
            when 1
                mockDataTpl = {
                    'list|10': [
                        {
                            'title':'@STRING'
                        }
                    ]
                }
            when 2
                mockDataTpl = {
                    'list|15': [
                        {
                            'title':'@STRING'
                        }
                    ]
                }
            else
                break;
        $scope.list = Mock.mock(mockDataTpl).list
        return
    )

    return
]);