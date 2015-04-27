/**
 * Created by dulin on 2015/4/3.
 */

var selectCity = angular.module('selectCityDirective', []);


selectCity.directive('selectCity', ['$http', 'dataManager', 'Ajax', function ($http, dataManager, Ajax) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            cityConfig: '='
        },
        templateUrl: './templates/selectCity.tpl.html',
        require: ['selectCity'],
        controller: function ($scope, $element, $filter, $window, $location, $anchorScroll) {
            var self = this,
                $cityContainer = $element,
                $letterList = $cityContainer.children().eq(2),
                viewClientHeight = $letterList[0].clientHeight,
                headerClientHeight = $cityContainer.children().eq(0)[0].clientHeight,
                cityConfig = $scope.cityConfig,
                requestUrl = cityConfig.url,
                type = cityConfig.type;

            self.type = type;
            var visaCountryList;

            var visaProvince = visaProvince || {},
                visaCountry = visaCountry || {},
                flight = flight || {},
                train = train || {};

            self.open = false;
            $scope.$on('openSelectCity', function (e, data) {
                self.open = !self.open;
                self.initHistorySelected();
            });

            /**
             * @description 根据用户传递的城市数据url地址，和项目类型，请求对应项目的城市，或者省份，或者国家的数据
             *              数据类型(type):1. 'train' 火车票项目城市数据
             *                            2. 'flight' 飞机票项目城市数据
             *                            3. 'visa-province' 签证项目省份数据
             *                            4. 'visa-country' 签证项目国家数据
             *
             *              根据不同的类型，进入不同的分支，每个分支为一个单例对象。
             *
             */
            self.requestData = function () {
                var promise = Ajax.post({
                    url: requestUrl
                });
                promise.then(function (obj) {
                    if (obj.data) {
                        switch (type) {
                            case 'visa-province':
                                visaProvince.init(self, obj.data);
                                break;
                            case 'flight':
                                flight.init(self, obj.data);
                                break;
                            case 'train':
                                train.init(self, obj.data);
                                break;
                            case 'visa-country':
                                visaCountryList = obj.data;
                                break;
                            default:
                                break;
                        }
                    }
                });
                promise.then(function (obj) {

                });
            };

            /**
             * @description 页面初始化。
             *              1.初始化页面样式——根据不同手机屏幕视口高度，动态设置快速索引的高度和整体位置
             *              2.初始化页面锚点
             *              3.初始化城市等的历史选择
             */
            self.init = function () {
                self.initLetterListHeight();
                self.setAnchor('#', true);
                self.initHistorySelected();
            };

            /**
             * @description 历史选择城市等信息，存放在localStorage缓存中，打开该指令视图，从localStorage中取得用户历史选择，
             *              更新视图历史选择。
             */
            self.initHistorySelected = function () {
                self.historySelectedList = angular.fromJson(localStorage.getItem('historySelectedList'));
            };

            /**
             * @description 初始化快速索引列表样式，设置快速索引列表高度，位置及"padding-top"
             *              对于"签证"项目，根据设计图，需要在计算出的"padding-top"上加一个修正值。
             */
            self.initLetterListHeight = function () {
                var items = $letterList.children(),
                    itemPt = viewClientHeight % 26;
                self.itemHeight = (viewClientHeight - itemPt) / 26;
                items.css({
                    height: self.itemHeight + 'px'
                });
                if (type === 'visa-province' || type === 'visa-country') {
                    self.itemPt = itemPt + 50;
                } else {
                    self.itemPt = itemPt;
                }
                $letterList.css('padding-top', self.itemPt + 'px');
            };

            /**
             * @description 设置锚点
             * @param {String} word 1.由快速索引传过来的与锚点id值相同的字符串
             *                      2.形如['A','B']的数组
             * @param {Boolean} isLocation 是否跳转到锚点
             * @return {Array} anchorList 当word值是第2个时，返回形如['#A','#B']的数组
             */
            self.setAnchor = function (word, isLocation) {
                if (!word) return;
                var hash = '',
                    isJump = isLocation || false;
                if (angular.isString(word)) {
                    if (word.indexOf('#') === -1) {
                        hash = word;
                    } else {
                        hash = word.replace('#', '');
                    }
                    if (isJump) {
                        //location.hash = hash;
                        $location.hash(hash);
                        $anchorScroll();
                        self.fixAnchorStyle(hash);
                    }
                }
                if (angular.isArray(word)) {
                    var i = 0,
                        len = word.length,
                        anchorList = [],
                        anchor = '';
                    for (; i < len; i++) {
                        if (i === 0) {
                            continue;
                        }
                        anchor = '#' + word[i];
                        anchorList.push(anchor);
                    }
                    return anchorList;
                }
            };

            /**
             * @description 修正锚点定位后上部的border和header的border重合的样式
             * @param id 锚点id
             */
            self.fixAnchorStyle = function (id) {

            };

            /**
             * @description 关闭城市选择面板
             *              向父级作用域发送'closeSelectCity'事件
             *              父级作用域监听该事件，在城市选择面板隐藏后执行一些操作。
             */
            self.close = function () {
                self.open = !self.open;
                $scope.$emit('closeSelectCity', {});
            };


            /**
             * @description 火车票城市选择单例对象
             */
            train = function ($window, angular) {
                return {
                    letterList: [],
                    otherLetters: ['pt', 'CURRENT', 'HISTORY', 'HOT'],
                    hasOtherAnchor: true,
                    anchorWord: null,
                    cityList: null,
                    historySelectedList: [],
                    currentCity: '上海',

                    /**
                     * @description 取得请求回来的城市数据中的城市拼音首字母，去除重复的首字母，用于设置锚点。
                     * @returns {train} 使该单例对象可以链式调用方法
                     */
                    getCityFirstLetter: function () {
                        if (!angular.isArray(this.cityList)) return;
                        var i = 0,
                            cityList = this.cityList,
                            len = cityList.length;
                        if (!len) return;
                        for (; i < len; i++) {
                            for (var k in cityList[i]) {
                                if (k !== 'firstletter') {
                                    continue;
                                }
                                if (i === 0 || cityList[i - 1][k] !== cityList[i][k]) {
                                    var lowercaseLetter = cityList[i][k],
                                        uppercaseLetter = $filter('uppercase')(lowercaseLetter);
                                    this.letterList.push(uppercaseLetter);
                                }
                            }
                        }
                        this.letterList.sort();
                        return this;
                    },

                    /**
                     * @description 火车票项目除了字母索引，还有"当前"，"历史", "热门"3个中文索引
                     * @returns {train} 链式调用
                     */
                    getAnchorWord: function () {
                        this.anchorWord = this.otherLetters.concat(this.letterList);
                        this.anchorWord.splice(0, 1);
                        return this;
                    },

                    /**
                     * @description 取得城市列表数据
                     * @param requestData
                     * @returns {train}
                     */
                    getCityList: function (requestData) {
                        this.cityList = requestData.data;
                        return this;
                    },

                    /**
                     * @description 为指令$scope绑定将要在指令模版中渲染的数据
                     * @param SCController 指令Controller
                     * @returns {train} 链式调用
                     */
                    bindControllerData: function (SCController) {

                        SCController.cityList = this.cityList;
                        SCController.letterList = this.letterList;
                        SCController.anchorWord = this.anchorWord;
                        SCController.hasOtherAnchor = this.hasOtherAnchor;
                        SCController.currentCity = this.currentCity;
                        SCController.inputPlaceholder = '输入城市名或拼音';
                        SCController.curPosition = '当前定位城市区域';
                        SCController.historyOptions = '历史选择城市';
                        return this;
                    },

                    /**
                     * @description 更新用户选择的历史城市、省份信息
                     *              重复选择的城市，将不会历史选择数组中
                     *
                     * @param cityObj 用户选择的城市对象
                     * @param SCController 指令Controller
                     * @returns {train} 链式调用
                     */
                    updateHistorySelected: function (cityObj, SCController) {
                        SCController.updateHistorySelected(cityObj, this);
                        localStorage.setItem('currentCity', this.currentCity);
                        return this;
                    },

                    /**
                     * @description 首先进行火车票数据初始化,调用内部的方法，构造城市列表数据，首字母数据，快速索引数据，最后为指令模版绑定数据
                     *              火车票数据初始化完毕后，调用指令controller的初始化方法，完成视图初始化。
                     * @param SCController 指令controller
                     * @param requestData 请求回来的城市数据
                     */
                    init: function (SCController, requestData) {
                        this.getCityList(requestData)
                            .getCityFirstLetter()
                            .getAnchorWord()
                            .bindControllerData(SCController);
                        SCController.init();
                        SCController.bindIndexEvent(this.anchorWord);
                    }
                }
            }($window, angular);


            flight = function ($window, angular) {
                return {
                    letterList: [],
                    anchorWord: ['pt', 'CURRENT', 'HISTORY', 'HOT'],
                    hasOtherAnchor: true,
                    cityList: null,
                    currentCity: null,
                    hotCitys: null,
                    historySelectedList: [],

                    getCityFirstLetter: function () {
                        var cityList = this.cityList;
                        if (angular.isArray(cityList)) {
                            var len = cityList.length,
                                i = 0,
                                letterList = [];
                            if (!len) return;
                            for (; i < len; i++) {
                                letterList.push(cityList[i]['firstLetter']);
                            }

                            var l = letterList.length,
                                j = 0;
                            for (; j < l; j++) {
                                if (j === 0 || this.letterList.indexOf(letterList[j]) === -1) {
                                    this.letterList.push(letterList[j]);
                                }
                            }
                            this.letterList.sort();
                        }
                        return this;
                    },

                    getCityList: function (requestData) {
                        this.cityList = requestData.data.allCitys;
                        return this;
                    },

                    getCurrentCity: function (requestData) {
                        this.currentCity = requestData.data.currentCity.name;
                        return this;
                    },

                    getHotCity: function(requestData) {
                        this.hotCitys = requestData.data.hotCitys;
                        return this;
                    },

                    getAnchorWord: function () {
                        this.anchorWord = this.anchorWord.concat(this.letterList);
                        this.anchorWord.splice(0, 1);
                        return this;
                    },

                    bindControllerData: function (SCController) {
                        SCController.letterList = this.letterList;
                        SCController.anchorWord = this.anchorWord;
                        SCController.hasOtherAnchor = this.hasOtherAnchor;
                        SCController.cityList = this.cityList;
                        SCController.currentCity = this.currentCity;
                        SCController.hotCitys = this.hotCitys;
                        SCController.inputPlaceholder = '输入城市名或拼音';
                        SCController.curPosition = '当前定位城市区域';
                        SCController.historyOptions = '历史选择城市';
                        return this;
                    },

                    updateHistorySelected: function (cityObj, SCController) {
                        SCController.updateHistorySelected(cityObj, this);
                        return this;
                    },

                    init: function (SCController, requestData) {
                        flight.getCityList(requestData)
                            .getCurrentCity(requestData)
                            .getHotCity(requestData)
                            .getCityFirstLetter()
                            .getAnchorWord()
                            .bindControllerData(SCController);

                        SCController.init();
                        SCController.bindIndexEvent(this.anchorWord);
                    }
                }
            }($window, angular);

            /**
             * @description 签证省份单例对象，各方法与其他单例对象类似
             */
            visaProvince = function ($window, angular) {
                return {
                    letterList: [],
                    anchorWord: null,
                    provinceList: null,
                    historySelectedList: [],
                    currentCity: {
                        station_name: '上海'
                    },

                    getProvinceFirstLetter: function () {
                        if (!angular.isArray(this.provinceList)) return;
                        var provinceList = this.provinceList,
                            len = provinceList.length,
                            provinceObj,
                            pinyin,
                            uppercaseLetter,
                            letterArr = [],
                            i = 0;
                        for (; i < len; i++) {
                            provinceObj = provinceList[i];
                            pinyin = provinceObj['pinyin'];
                            letterArr.push(pinyin[0]);
                        }
                        var l = letterArr.length,
                            j = 0;

                        for (; j < l; j++) {
                            if (j === 0 || letterArr[j - 1] !== letterArr[j]) {
                                uppercaseLetter = $filter('uppercase')(letterArr[j]);
                                this.letterList.push(uppercaseLetter);
                            }
                            provinceObj = provinceList[j];
                            provinceObj.firstletter = $filter('uppercase')(letterArr[j]);
                            this.letterList.sort();
                        }
                        return this;
                    },

                    getProvinceList: function (requestData) {
                        this.provinceList = requestData.data;
                        return this;
                    },

                    getAnchorWord: function () {
                        this.anchorWord = this.letterList;
                        return this;
                    },

                    bindControllerData: function (SCController) {
                        var historySelectedList = localStorage.getItem('historySelectedList');
                        SCController.provinceList = this.provinceList;
                        SCController.letterList = this.letterList;
                        SCController.anchorWord = this.anchorWord;
                        SCController.currentCity = this.currentCity.station_name;
                        SCController.inputPlaceholder = '输入省份或自治区，直辖市';
                        SCController.curPosition = '当前定位区域';
                        SCController.historyOptions = '历史选择';
                        if (historySelectedList && historySelectedList.length > 0) {
                            SCController.historySelectedList = historySelectedList;
                        }
                        return this;
                    },

                    /**
                     * @description 构造中文搜索需要的数据对象
                     */
                    setSearchData: function () {
                        var provinceList = this.provinceList,
                            cnLetterObj = {},
                            cnFirstLetter = '';
                        angular.forEach(provinceList, function (elem, index) {
                            cnFirstLetter = elem['station_name'].substr(0, 1);
                            cnLetterObj[cnFirstLetter] = elem['pinyin'].substr(0, 1);
                        });
                        dataManager.setData('cnLetterObj', cnLetterObj);
                        return this;
                    },

                    updateHistorySelected: function (cityObj, SCController) {
                        SCController.updateHistorySelected(cityObj, this);
                        return this;
                    },

                    init: function (SCController, requestData) {
                        this.getProvinceList(requestData)
                            //.setSearchData()
                            .getProvinceFirstLetter()
                            .getAnchorWord()
                            .bindControllerData(SCController);
                        SCController.init();
                        SCController.bindIndexEvent(this.anchorWord);
                    }
                }
            }($window, angular);


            /**
             * @description 更新历史选择localStorage，如果新选择的城市名已经在localStorage中存在，则交换两者的位置。
             * @param cityObj 选择的城市对象
             * @param singleObj 火车，飞机，签证单例对象
             */
            self.updateHistorySelected = function(cityObj, singleObj) {
                if (angular.isObject(cityObj)) {
                    var storage = $window.localStorage;
                    var historyList = angular.fromJson(storage.getItem('historySelectedList'));
                    if (historyList && historyList.length > 0) {
                        var len = historyList.length,
                            i = 0;
                        for (; i < len; i++) {
                            var historyObj = historyList[i];
                            if (angular.equals(historyObj ,cityObj)) {
                                var temp = historyList[0];
                                historyList[0] = historyObj;
                                historyList[i] = temp;
                                storage.setItem('historySelectedList', angular.toJson(historyList));
                                return ;
                            }
                        }
                    }
                    singleObj.historySelectedList.unshift(cityObj);
                    if (singleObj.historySelectedList.length > 6) {
                        singleObj.historySelectedList.length = 6;
                    }
                    storage.setItem('historySelectedList', angular.toJson(singleObj.historySelectedList));
                }

                var historySelectedList = singleObj.historySelectedList;
                if (historySelectedList && historySelectedList.length > 0) {
                    self.historySelectedList = historySelectedList;
                }
            };

            /**
             * @description 选择城市事件处理
             * @param {Object} cityObj 用户选择的城市对象
             * @param {String} sctType 选择的城市类型，当前
             */
            self.selectCity = function (cityObj, sctType) {
                var sctCityObj;
                    switch (type) {
                        case 'visa-province':
                            if(!sctType) {
                                visaProvince.updateHistorySelected(cityObj, self);
                                sctCityObj = cityObj;
                            } else {
                                sctCityObj = {
                                    station_name: cityObj
                                }
                            }
                            break;
                        case 'train':
                            if(!sctType) {
                                train.updateHistorySelected(cityObj, self);
                            } else {
                                sctCityObj = {
                                    cityname: cityObj
                                }
                            }
                            break;
                        case 'flight':
                            if(!sctType) {
                                flight.updateHistorySelected(cityObj, self);
                            } else {
                                sctCityObj = {
                                    name: cityObj
                                }
                            }
                            break;
                        default:
                            break;
                    }


                $scope.$emit('setCityName', sctCityObj);
                self.close();
            };

            /**
             * @description 绑定字母索引触摸事件
             * @param anchorWord
             */
            self.bindIndexEvent = function (anchorWord) {
                var awLen = anchorWord.length,
                    whichAnchor = {};
                $letterList.on('touchstart', function (e) {
                    var target = e.target;
                    if (target.nodeName.toLocaleUpperCase() === 'A') {
                        var li = target.parentNode,
                            anchor = li.dataset.name;
                        self.setAnchor(anchor, true);
                    }
                    $cityContainer.off();
                    $cityContainer.on('touchstart', function (e) {
                        e.preventDefault();
                        return false;
                    });
                    $cityContainer.on('touchmove', function (e) {
                        e.preventDefault();
                        return false;
                    });
                });

                $letterList.on('touchmove', function (e) {
                    var iH = self.itemHeight,
                        iPt = self.itemPt,
                        tcYFixed = 10,
                        tcY,
                        hdH = headerClientHeight,
                        i = 0;
                    if (e.originalEvent) {
                        tcY = e.originalEvent.changedTouches[0].clientY - tcYFixed;
                    } else if (e.changedTouches) {
                        tcY = e.changedTouches[0].clientY - tcYFixed;
                    }

                    for (; i < awLen; i++) {
                        if (i === 0) {
                            whichAnchor[anchorWord[i]] = (tcY <= i * iH + iPt + hdH);
                            continue;
                        }
                        whichAnchor[anchorWord[i]] = (tcY > (iPt + hdH + (i - 1) * iH) && tcY <= (i * iH + iPt + hdH));
                    }

                    for (var k in whichAnchor) {
                        if (whichAnchor[k]) {
                            self.setAnchor(k, true);
                            break;
                        }
                    }
                });
            };

            $letterList.on('touchend', function (e) {
                $cityContainer.off();
            });

            self.requestData();

        },
        controllerAs: 'SelectCityController'
    }
}]).filter('searchLetterFilter', ['$filter', function ($filter) {
    var enLetterReg = /[a-zA-Z]/;
        //reg = /^[\u4E00-\u9FA5]+$/;
    return function (letterStr, searchText) {
        if (angular.isString(searchText) && searchText.length > 0) {
            if (enLetterReg.test(searchText[0])) {
                return $filter('uppercase')(searchText[0]);
            } else {
                return $filter('uppercase')(letterStr);
                //return $filter('uppercase')(cnLetterObj[searchText[0]]);
            }
        } else {
            return $filter('uppercase')(letterStr);
        }
    }
}]).filter('searchCityListFilter', ['$filter', function ($filter) {
    return function (cityList, searchText, letter) {
        var cityListFiltered = [];
            //reg = /^[\u4E00-\u9FA5]+$/;
        if (angular.isArray(cityList) && cityList.length > 0) {
            angular.forEach(cityList, function (elem, index) {
                if (elem['firstletter'] === $filter('uppercase')(letter)) {
                    if (angular.isString(searchText) && searchText.length > 0) {
                        if (elem['pinyin'].indexOf(searchText) !== -1) {
                            cityListFiltered.push(elem);
                        } else {
                            cityListFiltered.push(elem);
                        }
                    } else {
                        cityListFiltered.push(elem);
                    }
                }
            });
            return cityListFiltered;
        }
    }
}]);