/**
 * Created by dulin on 2015/4/28.
 */
myAppDirectives
    .directive('swiperList', ['$log','$interval', function ($log, $interval) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {},
            templateUrl: './templates/directive/swiperList.tpl.html',
            link: function(scope, element, attrs) {

                scope.dataList = [];
                var stopTime;


                scope.init = function() {
                    scope.renderData();
                };

                scope.renderData = function() {
                    stopTime = $interval(addItem, 1000);
                };

                /**
                 * @description 向指令作用域的dataList属性中添加条目
                 */
                function addItem() {
                    if(scope.dataList.length === 5 && angular.isDefined(stopTime)) {
                        $interval.cancel(stopTime);
                        stopTime = null;
                        return;
                    }
                    var mockData = Mock.mock({
                        id: '@id',
                        title: '@title',
                        sentence: '@sentence',
                        email: '@email',
                        cnName: '@chineseName',
                        showAction: false
                    });
                    scope.dataList.push(mockData);
                }

                scope.$watch('dataList', function(newDataList, oldDataList) {
                    $log.info(newDataList, oldDataList);

                }, true);

                scope.swiperLeft = function(item) {
                    var len = scope.dataList.length,
                        i = 0,
                        dataObj;
                    for(; i < len; i++) {
                        dataObj = scope.dataList[i];
                        if(angular.equals(dataObj, item)) {
                            continue;
                        }
                        dataObj.showAction = false;
                    }

                    item.showAction = true;
                };

                scope.swiperRight = function(item) {
                    item.showAction = false;
                };

                /**
                 * @description 删除按钮点击事件，删除条目
                 *              根据li上data-item-id在scope.dataList中查找匹配id的对象，删除该对象。
                 * @param e
                 * @param isTop 是否已经置顶
                 * @param type 操作类型，'del':删除条目，'top':置顶条目
                 */
                scope.ctrlButtonHandler = function(e, type, isTop) {
                    var target = e.currentTarget,
                        $Btn,
                        $Item,
                        itemId,
                        itemObj,
                        topItemObj,
                        len = scope.dataList.length;
                    if(target.nodeName.toLocaleUpperCase() === 'DIV') {
                        $Btn = angular.element(target);
                        $Item = $Btn.parent().parent();
                        itemId = $Item[0].dataset.itemId;
                        for(var i = 0; i < len; i++) {
                            itemObj = scope.dataList[i];
                            if(itemId === itemObj.id) {
                                if(type === 'del') {
                                    scope.dataList.splice(i, 1);
                                }
                                if(type === 'top') {
                                    topItemObj = scope.dataList.splice(i, 1)[0];
                                    topItemObj.index = i;
                                    topItemObj.showAction = false;
                                    if(!isTop) {
                                        topItemObj.isTop = true;
                                        scope.dataList.unshift(topItemObj);
                                    } else {
                                        topItemObj.isTop = false;
                                        scope.dataList.push(topItemObj);
                                    }
                                }
                                return;
                            }
                        }
                    }
                };

                scope.init();
            }
        }
    }]);