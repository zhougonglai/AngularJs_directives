/**
 * Created by dulin on 2015/4/3.
 */

var selectCity = angular.module('selectCityDirective', []);


selectCity.directive('selectCity', ['$http', function($http) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            cityConfig: '='
        },
        templateUrl: './templates/selectCity.tpl.html',
        require: ['selectCity'],
        controller: function($scope, $element, $filter, $window) {
            var self = this,
                $cityContainer = $element,
                $letterList = $cityContainer.children().eq(2),
                viewClientHeight = $letterList[0].clientHeight,
                headerClientHeight = $cityContainer.children().eq(0)[0].clientHeight,
                cityConfig = $scope.cityConfig,
                requestUrl = cityConfig.url,
                type = cityConfig.type;

            self.type = type;
            var visaCountryList,
                flightCityList;

            var visaProvince = visaProvince || {},
                visaCountry = visaCountry || {},
                flight = flight || {},
                train = train || {};

            self.open = false;
            $scope.$on('openSelectCity', function(e, data) {
                self.open = !self.open;
                self.initHistorySelected();
            });

            self.requestData = function() {
                $http({
                    method: 'POST',
                    url: requestUrl
                }).success(function(data, status, headers) {
                    if(data) {
                        switch (type) {
                            case 'visa-province':
                                visaProvince.init(self, data);
                                break;
                            case 'flight':
                                flightCityList = data.data;
                                break;
                            case 'train':
                                train.init(self, data);
                                break;
                            case 'visa-country':
                                visaCountryList = data.data;
                                break;
                            default:
                                break;
                        }
                    }
                }).error(function(data, status, headers) {

                });
            };

            /**
             * @description 页面初始化。
             *              1.初始化页面样式；
             *              2.初始化页面锚点；
             */
            self.init = function() {
                self.initLetterListHeight();
                self.setAnchor('#', true);
                self.initHistorySelected();
            };

            self.initHistorySelected = function() {
                self.historySelectedList = angular.fromJson(localStorage.getItem('historySelectedList'));
            };

            /**
             * @description 初始化字母列表样式，设置字母列表高度及"padding-top"。
             */
            self.initLetterListHeight = function () {
                var items = $letterList.children(),
                    itemPt = viewClientHeight % 26;
                self.itemHeight = (viewClientHeight - itemPt) / 26;
                items.css({
                    height: self.itemHeight + 'px'
                });
                if(type === 'visa-province' || type === 'visa-country') {
                    self.itemPt = itemPt + 50;
                } else {
                    self.itemPt = itemPt;
                }
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
             * @description 火车票城市选择单例对象
             */
            train = function($window, angular) {
                var storage = $window.localStorage;
                return {
                    letterList: [],
                    otherLetters: ['pt', 'CURRENT', 'HISTORY', 'HOT'],
                    anchorWord: null,
                    cityList: null,
                    historySelectedList: [],

                    getCityFirstLetter: function() {
                        if(!angular.isArray(this.cityList)) return;
                        var i = 0,
                            cityList = this.cityList,
                            len = cityList.length;
                        if(!len) return;
                        for(; i < len; i++) {
                            for(var k in cityList[i]) {
                                if(k !== 'firstletter') {
                                    continue;
                                }
                                if(i === 0 || cityList[i - 1][k] !== cityList[i][k]) {
                                    var lowercaseLetter = cityList[i][k],
                                        uppercaseLetter = $filter('uppercase')(lowercaseLetter);
                                    this.letterList.push(uppercaseLetter);
                                }
                            }
                        }
                        this.letterList.sort();
                        return this;
                    },

                    getAnchorWord: function() {
                        this.anchorWord = this.otherLetters.concat(this.letterList);
                        this.anchorWord.splice(0, 1);
                        return this;
                    },

                    getCityList: function(requestData) {
                        this.cityList = requestData.data;
                        return this;
                    },

                    bindControllerData: function(SCController) {

                        SCController.cityList =  this.cityList;
                        SCController.letterList = this.letterList;
                        SCController.anchorWord = this.anchorWord;
                        SCController.inputPlaceholder = '输入城市名或拼音';
                        SCController.curPosition = '当前定位城市区域';
                        SCController.historyOptions = '历史选择城市';

                        return this;
                    },

                    updateHistorySelected: function(cityName,SCController) {
                        this.historySelectedList.unshift({name: cityName});
                        if(this.historySelectedList.length > 6) {
                            this.historySelectedList.length = 6;
                        }
                        storage.setItem('historySelectedList',angular.toJson(this.historySelectedList));
                        var historySelectedList = storage.getItem('historySelectedList');
                        if(historySelectedList && historySelectedList.length > 0) {
                            SCController.historySelectedList = historySelectedList;
                        }
                        return this;
                    },

                    init: function(SCController, requestData) {
                        this.getCityList(requestData)
                            .getCityFirstLetter()
                            .getAnchorWord()
                            .bindControllerData(SCController);
                        SCController.init();
                        SCController.bindIndexEvent(train.anchorWord);
                    }
                }
            }($window, angular);

            /**
             * @description 签证省份单例对象
             */
            visaProvince = function($window, angular){
                var storage = $window.localStorage;
                return {
                    letterList: [],
                    anchorWord: null,
                    provinceList: null,
                    historySelectedList: [],

                    getProvinceFirstLetter: function() {
                        if(!angular.isArray(this.provinceList)) return;
                        var provinceList = this.provinceList,
                            len = provinceList.length,
                            provinceObj,
                            pinyin,
                            uppercaseLetter,
                            letterArr = [],
                            i = 0;
                        for(; i < len; i++) {
                            provinceObj =  provinceList[i];
                            pinyin = provinceObj['pinyin'];
                            letterArr.push(pinyin[0]);
                        }
                        var l = letterArr.length,
                            j = 0;

                        for(; j < l; j++) {
                            if(j === 0 || letterArr[j - 1] !== letterArr[j]) {
                                uppercaseLetter = $filter('uppercase')(letterArr[j]);
                                this.letterList.push(uppercaseLetter);
                            }
                            provinceObj = provinceList[j];
                            provinceObj.firstletter = $filter('uppercase')(letterArr[j]);
                            this.letterList.sort();
                        }
                        return this;
                    },

                    getProvinceList: function(requestData) {
                        this.provinceList = requestData.data;
                        return this;
                    },

                    getAnchorWord: function() {
                        this.anchorWord = this.letterList;
                        return this;
                    },

                    bindControllerData: function(SCController) {
                        var historySelectedList = storage.getItem('historySelectedList');
                        SCController.provinceList =  this.provinceList;
                        SCController.letterList = this.letterList;
                        SCController.anchorWord = this.anchorWord;
                        SCController.inputPlaceholder = '输入省份或自治区，直辖市';
                        SCController.curPosition = '当前定位区域';
                        SCController.historyOptions = '历史选择';
                        if(historySelectedList && historySelectedList.length > 0) {
                            SCController.historySelectedList = historySelectedList;
                        }
                        return this;
                    },

                    updateHistorySelected: function(cityName, SCController) {
                        if(cityName) {
                            var historyList = angular.fromJson(storage.getItem('historySelectedList'));
                            if(historyList && historyList.length > 0) {
                                var len = historyList.length,
                                    i = 0;
                                for(; i < len; i++) {
                                    var historyObj = historyList[i];
                                    if(historyObj['name'] === cityName) {
                                        return ;
                                    }
                                }
                            }
                            this.historySelectedList.unshift({name: cityName});
                            if(this.historySelectedList.length > 6) {
                                this.historySelectedList.length = 6;
                            }
                            storage.setItem('historySelectedList', angular.toJson(this.historySelectedList));
                        }

                        var historySelectedList = this.historySelectedList;
                        if(historySelectedList && historySelectedList.length > 0) {
                            SCController.historySelectedList = historySelectedList;
                        }
                        return this;
                    },

                    init: function(SCController, requestData) {
                        this.getProvinceList(requestData)
                            .getProvinceFirstLetter()
                            .getAnchorWord()
                            .bindControllerData(SCController);
                        SCController.init();
                        SCController.bindIndexEvent(this.anchorWord);
                    }
                }
            }($window, angular);

            /**
             * @description 选择城市事件处理
             * @param {String} cityName 城市名
             */
            self.selectCity = function(cityName) {
                switch (type) {
                    case 'visa-province':
                        visaProvince.updateHistorySelected(cityName, self);
                        break;
                    case 'train':
                        train.updateHistorySelected(cityName, self);
                        break;
                    default:
                        break;
                }
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
                        tcYFixed = 10,
                        tcY = e.changedTouches[0].clientY - tcYFixed,
                        hdH = headerClientHeight,
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

            self.requestData();

        },
        controllerAs: 'SelectCityController'
    }
}]);