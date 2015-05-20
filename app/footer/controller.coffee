myAppControllers.controller('IController', ['$scope', '$log', ($scope, $log)->
    $scope.footerConfig = {
        btnList: [
            {
                text: '旅游度假'
                type: 'single'
                content: [
                    {
                        text: '旅游度假'
                    }
                    {
                        text: '景点门票'
                    }
                    {
                        text: '酒店'
                    }
                    {
                        text: '吃喝玩乐'
                    }
                    {
                        text: '用车'
                    }
                ]
                callback: ->
                    return
            }
            {
                text: '排序 '
                type: 'single'
                content: [
                    {
                        id: '1'
                        text: '驴妈妈推荐'
                    }
                    {
                        id: '2'
                        text: '价格从高到低'
                    }
                    {
                        id: '3'
                        text: '价格从低到高'
                    }
                ]
                callback: ->
                    return
            }
            {
                text: '筛选'
                type: 'double'
                content: {
                    'list': [
                        {
                            text: '景点区域'
                            id: '2'
                            condition: [
                                {
                                    text: '不限'
                                    code: '1'
                                }
                                {
                                    text: '北京'
                                    code: '2'
                                }
                                {
                                    text: '上海'
                                    code: '3'
                                }
                                {
                                    text: '天津'
                                    code: '4'
                                }
                            ]
                        }
                        {
                            text: '景点活动'
                            id: '3'
                            condition: [
                                {
                                    text: '购买当日可入园'
                                    code: '0'
                                }
                                {
                                    text: '景区不定期举办活动节目'
                                    code: '1'
                                }
                                {
                                    text: '景点门票支持返现'
                                    code: '2'
                                }
                                {
                                    text: '景点包含优惠立减等活动'
                                    code: '3'
                                }
                            ]
                        }
                        {
                            text: '景点级别'
                            id: '4'
                            condition: [
                                {
                                    text: '不限'
                                    code: '0'
                                }
                                {
                                    text: '5A景区'
                                    code: '1'
                                }
                                {
                                    text: '4A景区'
                                    code: '2'
                                }
                                {
                                    text: '3A景区'
                                    code: '3'
                                }
                            ]
                        }
                        {
                            text: '主题分类'
                            id: '5'
                        }
                        {
                            text: '支付方式'
                            id: '6'
                        }
                    ]
                }
                callback: ->
                    return
            }
        ]
    }
    return
])