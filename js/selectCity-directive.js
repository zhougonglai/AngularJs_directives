/**
 * Created by dulin on 2015/4/3.
 */

var selectCityDirective = angular.module('selectCityDirective', []);

selectCityDirective.directive('selectCity', ['$http', '$filter', function($http, $filter) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            cityModel: '='
        },
        templateUrl: './templates/selectCity.tpl.html',
        require: ['selectCity'],
        controller: function($scope, $element, $attrs) {
            var $cityContainer = $element,
                $letterList = $cityContainer.children().eq(2),
                viewClientHeight = $letterList[0].clientHeight;

            var self = this;
            self.open = true;
            self.headerClientHeight = $cityContainer.children().eq(0)[0].clientHeight;
            var otherLetters = ['pt', 'CURRENT', 'HISTORY', 'HOT'];

            $http({
                method: 'POST',
                url: './jsonData/city.json'
            }).success(function(data, status, headers) {
                self.cityList = data.data;
                self.letterList = self.getCityFirstLetter(self.cityList);
                self.anchorWord = otherLetters.concat(self.letterList);
                self.anchorWord.splice(0, 1);
                self.init();
                self.bindIndexEvent(self.anchorWord);
            }).error(function(data, status, headers) {

            });



            /**
             * @description 页面初始化。
             *              1.初始化页面样式；
             *              2.初始化页面锚点；
             */
            self.init = function() {
                self.initLetterListHeight();
                self.setAnchor('#', true);
            };


            /**
             * @description 初始化字母列表样式，设置字母列表高度及"padding-top"。
             */
            self.initLetterListHeight = function () {
                var items = $letterList.children(),
                    len = self.anchorWord.length;
                self.itemPt = viewClientHeight % len;
                    self.itemHeight = (viewClientHeight - self.itemPt) / len;
                items.css({
                    height: self.itemHeight + 'px'
                });
                $letterList.css('padding-top', self.itemPt + 'px');
            };

            /**
             * @description 设置锚点
             * @param {String} word href，字母，字母数组
             * @param {Boolean} isLocation 是否跳转到锚点
             */
            self.setAnchor = function(word, isLocation) {
                if(!word) return;
                var hash = '',
                    isJump = isLocation || false;
                if(angular.isString(word)) {
                    if(word.indexOf('#') !== -1) {
                        hash = word;
                    } else {
                        hash = '#' + word;
                    }
                    if(isJump) {
                        location.hash = hash;
                        self.fixAnchorStyle(hash);
                    }
                }
                if(angular.isArray(word)) {
                    var i = 0,
                        len = word.length,
                        anchorList = [],
                        anchor = '';
                    for(; i < len; i++) {
                        if(i === 0) {
                            continue;
                        }
                        anchor = '#' + word[i];
                        anchorList.push(anchor);
                    }
                    return anchorList;
                }
            };

            self.fixAnchorStyle = function(hash) {

            };

            /**
             * @description 关闭城市选择面板
             */
            self.close = function() {
                self.open = !self.open;
            };

            /**
             * @description 获取城市首字母数组
             * @param cityList 城市数组
             * @returns {Array} 城市首字母数组
             */
            self.getCityFirstLetter = function(cityList) {
                if(!angular.isArray(cityList)) return;
                var i = 0,
                    len = cityList.length,
                    letterList = [];
                if(!len) return;
                for(; i < len; i++) {
                    for(var k in cityList[i]) {
                        if(k !== 'firstletter') {
                            continue;
                        }
                        if(i === 0 || cityList[i - 1][k] !== cityList[i][k]) {
                            var lowercaseLetter = cityList[i][k],
                                uppercaseLetter = $filter('uppercase')(lowercaseLetter);
                            letterList.push(uppercaseLetter);
                        }
                    }
                }
                letterList.sort();
                return letterList;
            };

            /**
             * @description 选择城市事件处理
             * @param {String} cityName 城市名
             */
            self.selectCity = function(cityName) {
                $scope.$emit('setCityName', cityName);
                self.close();
            };

            /**
             * @description 绑定字母索引触摸事件
             * @param anchorWord
             */
            self.bindIndexEvent = function(anchorWord) {
                var awLen = anchorWord.length,
                    whichAnchor = {};
                $letterList.on('touchstart', function(e) {
                    var target = e.target;
                    if(target.nodeName.toLocaleUpperCase() === 'A') {
                        self.setAnchor(target.hash, true);
                    }
                    $cityContainer.off();
                    $cityContainer.on('touchmove', function(e) {
                        e.preventDefault();
                        return false;
                    });
                });

                $letterList.on('touchmove', function(e) {
                    var iH = self.itemHeight,
                        iPt = self.itemPt,
                        tcY = e.changedTouches[0].clientY,
                        hdH = self.headerClientHeight,
                        i = 0;

                    for(; i < awLen; i++) {
                        if(i === 0) {
                            whichAnchor[anchorWord[i]] = (tcY <= i * iH + iPt + hdH);
                            continue;
                        }
                        whichAnchor[anchorWord[i]] = (tcY > (iPt + hdH + (i-1) * iH) && tcY <= (i * iH + iPt + hdH));
                    }

                    for(var k in whichAnchor) {
                        if(whichAnchor[k]) {
                            self.setAnchor(k, true);
                            break;
                        }
                    }
                });

                $letterList.on('touchend', function(e) {
                    $cityContainer.off();
                })
            };

        },
        controllerAs: 'SelectCityController',
        link: function(scope, element, attrs, ctrls) {

        }
    }
}]);