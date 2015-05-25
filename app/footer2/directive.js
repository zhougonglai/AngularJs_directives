/**
 * Created by dulin on 2015/5/25.
 */
myAppDirectives
    .constant('footerConfig', {
        data: {
            "navigation": [
                {
                    "enText": "travel",
                    "cnText": "旅游度假",
                    "active": 0,
                    "sortData": [
                        {
                            "sort": "",
                            "text": "驴妈妈推荐",
                            "sortRule": "default",
                            "active": 0
                        },
                        {
                            "sort": 3,
                            "text": "价格从低到高",
                            "sortRule": "ASC",
                            "active": 1
                        },
                        {
                            "sort": 4,
                            "text": "价格从高到低",
                            "sortRule": "DESC",
                            "active": 2
                        }
                    ]
                },
                {
                    "enText": "viewspot",
                    "cnText": "景点门票",
                    "active": 1,
                    "sortData": [
                        {
                            "sort": "",
                            "text": "驴妈妈推荐",
                            "sortRule": "default",
                            "active": 0
                        },
                        {
                            "sort": 33,
                            "text": "价格从低到高",
                            "sortRule": "ASC",
                            "active": 1
                        },
                        {
                            "sort": 34,
                            "text": "价格从高到低",
                            "sortRule": "DESC",
                            "active": 2
                        }
                    ]
                },
                {
                    "enText": "hotel",
                    "cnText": "酒店",
                    "active": 2,
                    "sortData": [
                        {
                            "sort": "",
                            "text": "驴妈妈推荐",
                            "sortRule": "default",
                            "active": 0
                        },
                        {
                            "sort": 14,
                            "text": "价格从低到高",
                            "sortRule": "ASC",
                            "active": 1
                        },
                        {
                            "sort": 13,
                            "text": "价格从高到低",
                            "sortRule": "DESC",
                            "active": 2
                        }
                    ]
                },
                {
                    "enText": "edph",
                    "cnText": "吃喝玩乐",
                    "active": 3,
                    "sortData": [
                        {
                            "sort": "",
                            "text": "驴妈妈推荐",
                            "sortRule": "default",
                            "active": 0
                        },
                        {
                            "sort": 33,
                            "text": "价格从低到高",
                            "sortRule": "ASC",
                            "active": 1
                        },
                        {
                            "sort": 34,
                            "text": "价格从高到低",
                            "sortRule": "DESC",
                            "active": 2
                        }
                    ]
                },
                {
                    "enText": "car",
                    "cnText": "用车",
                    "active": 4,
                    "sortData": [
                        {
                            "sort": "",
                            "text": "驴妈妈推荐",
                            "sortRule": "default",
                            "active": 0
                        },
                        {
                            "sort": 33,
                            "text": "价格从低到高",
                            "sortRule": "ASC",
                            "active": 1
                        },
                        {
                            "sort": 34,
                            "text": "价格从高到低",
                            "sortRule": "DESC",
                            "active": 2
                        }
                    ]
                }
            ]
        }
    })
    .directive('footer', ['$log', 'footerConfig', '$http',
    function($log, footerConfig, $http) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: './templates/directive/footer2.tpl.html',
            scope: {
                userConfig: '='
            },
            link: function(scope, element, attrs) {

                var userConfig = scope.userConfig,
                    conditionUrl = userConfig.conditionUrl,
                    reqPromise,
                    linkFn = this;

                scope.renderData = null;
                scope.btnActive = 0;
                scope.navActive = 0;
                scope.sortActive = 0;
                scope.conditionTypeActive = 0;
                scope.childConditionActive = 0;
                scope.btnList = [
                    {
                        'enText': 'nav',
                        'cnText': '旅游度假',
                        'active': 0
                    },
                    {
                        'enText': 'sort',
                        'cnText': '排序',
                        'active': 1
                    },
                    {
                        'enText': 'pick',
                        'cnText': '筛选',
                        'active': 2
                    }
                ];
                scope.menuType = '';
                scope.isContentShow = false;
                scope.contentData = null;


                init();

                function init() {
                    reqPromise = requestData();
                    reqPromise.success(function(data, status, headers) {
                        scope.renderData = factoryData.call(linkFn, data, footerConfig.data);
                    });
                    reqPromise.error(function(err) {
                        alert('数据加载失败' + err);
                    });
                }

                function requestData() {
                    return $http({
                        method: 'POST',
                        url: conditionUrl
                    });
                }

                function factoryData(reqData, confData) {
                    var data = {},
                        len,
                        i = 0,
                        conditionObj,
                        conditions,
                        childConditionObj,
                        conditionList = reqData.data.conditionsList;
                    data.navigation = angular.copy(confData.navigation);
                    data.conditionList = angular.copy(conditionList);
                    len = data.conditionList.length;
                    for(; i < len; i++) {
                        conditionObj = data.conditionList[i];
                        conditionObj.active = i;
                        conditions = conditionObj.conditionsList;
                        for (var j = 0, l = conditions.length; j < l; j++) {
                            childConditionObj = conditions[j];
                            childConditionObj.active = j;
                        }
                    }
                    return data;
                }

                scope.btnClickEventHandler = function(btnObj, event) {
                    if(scope.btnActive === btnObj.active) {
                        toggleContent();
                        scope.menuType = btnObj.enText;
                    } else {
                        scope.btnActive = btnObj.active;
                        scope.menuType = btnObj.enText;
                        showContent();
                    }
                    var navigationList = scope.renderData.navigation;
                    switch (scope.menuType) {
                        case 'nav':
                            scope.contentData = navigationList;
                            break;
                        case 'sort':
                            scope.contentData = navigationList[scope.navActive].sortData;
                            break;
                        case 'pick':
                            scope.contentData = scope.renderData.conditionList;
                            break;
                        default:
                            break;
                    }
                };

                function showContent() {
                    scope.isContentShow = true;
                }

                function hideContent() {
                    scope.isContentShow = false;
                }

                function toggleContent() {
                    scope.isContentShow = !scope.isContentShow;
                }

                scope.navClickEventHandler = function(navObj, event) {
                    scope.navActive = navObj.active;
                };

                scope.sortClickEventHandler = function(sortObj, event) {
                    scope.sortActive = sortObj.active;
                };

                scope.conditionTypeClickEventHandler = function(conditionObj, event) {
                    scope.conditionTypeActive = conditionObj.active;
                };

                scope.childConditionClickEventHandler = function(childCondition, event) {
                    scope.childConditionActive = childCondition.active;
                };
            }
        }
    }
]);