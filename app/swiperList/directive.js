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

                //var dataTemplate = {
                //    'list|5': [
                //        {
                //            title: '@title',
                //            sentence: '@sentence',
                //            email: '@email',
                //            cnName: '@chineseName',
                //            showAction: false
                //        }
                //    ]
                //};
                //var mockData = Mock.mock(dataTemplate);

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
                        $log.info(stopTime);
                        $interval.cancel(stopTime);
                        stopTime = null;
                        $log.info(stopTime);
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

                /**
                 * @description 删除按钮点击事件，删除条目
                 *              根据li上data-item-id在scope.dataList中查找匹配id的对象，删除该对象。
                 * @param e
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
                                    $log.info(scope.dataList);
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
                                    $log.info(scope.dataList);
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