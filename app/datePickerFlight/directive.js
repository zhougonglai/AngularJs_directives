myAppDirectives
    .directive('dpFlight', function () {
        return {
            restrict: "EA",
            templateUrl: "./templates/directive/datePickerFlight.tpl.html",
            replace: true,
            transclude: true,
            scope: {
                dpConfig: '=dpConfig'
            },
            require: ['dpFlight'],
            controller: 'DPFlightController',
            controllerAs: 'DPFlightController'
        }
    }).controller('DPFlightController', ['$scope', '$element', '$http', '$log', '$cacheFactory', function ($scope, $element, $http, $log, $cacheFactory) {

        var self = this,
            weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            monthDay = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            beginDateArr,
            endDateArr,
            beginDateStr,
            endDateStr,
            renderEndDateArr,
            renderMonthCount,
            datePriceList,
            serverTime,
            isInit = true,
            backDateStep = 2,
            dateObjList = [],
            requestUrl = $scope.dpConfig.url;

        var cnText = {
            goTripTitle: '去程日期选择',
            backTripTitle: '返程日期选择',
            goDatePriceTitle: '低价日历（去程）',
            backDatePriceTitle: '低价日历（返程）'
        };

        self.goTripDateArr = null;
        self.backTripDateArr = null;
        self.dateType = null;
        self.renderType = null;
        self.title = '';
        self.initDateObj = null;
        self.lastPriceDateObj = null;

        if (Mock.Random) {
            var dataTemplate = {
                'code|1-10': 1,
                'data|30': [
                    {
                        'deptDate': '@DATE',
                        'flightNO': 'MH370',
                        'seatCode|4': '1',
                        'parPrice|100-2000': 100
                    }
                ]
            };

            var MockData = Mock.mock(dataTemplate);
        }


        self.init = function (isOpen) {
            self.dateArray = [];

            //请求服务器数据,得到90天日期价格
            if (isInit) {
                var promise = self.requestData();
                promise.success(function () {
                    self.initialize(isOpen);
                });
            } else {
                self.initialize(isOpen);
            }
        };

        self.initialize = function (isOpen) {
            //当前日期
            beginDateArr = self.getBeginDate();
            beginDateStr = self.getFormatDate(beginDateArr);
            //当前日期+90天=结束日期
            endDateArr = self.getEndDate();
            endDateStr = self.getFormatDate(endDateArr);
            //初始化页面显示的日期（明天）
            renderMonthCount = self.getRenderMonthCount();
            //渲染的结束日期(渲染12个月的日期)
            renderEndDateArr = self.getRenderEndDate();
            //设置日期控件头部文字
            self.setTitle();
            //渲染日期
            self.renderDate();
            if (isInit) {
                self.initDate();
            } else {
                self.open = isOpen;
            }
        };

        /**
         * @description 初始化页面日期，始终为明天，刷新页面才执行，以后再进入日期控件，不在执行
         */
        self.initDate = function () {
            $log.info('初始化日期');
            self.emitSelectDateEvent(self.initDateObj);
            //默认隐藏日期控件
            self.open = false;
        };

        /**
         * @description 设置日期控件头部文字
         */
        self.setTitle = function () {
            var dateType = self.dateType,
                renderType = self.renderType;
            if (!renderType) {
                if (dateType === 'goTrip') {
                    self.title = cnText.goTripTitle;
                }
                if (dateType === 'backTrip') {
                    self.title = cnText.backTripTitle;
                }
            } else if (renderType === 'goDatePrice') {
                self.title = cnText.goDatePriceTitle;
            } else if (renderType === 'backDatePrice') {
                self.title = cnText.backDatePriceTitle;
            }
        };

        /**
         * @description 根据dateType和renderType来设置日期控件要渲染的月份数量
         *              如果用户打开的是“去程日期”或者“返程日期”，则渲染12个月
         *              如果用户打开的是“低价日历”，则渲染有价格的天数所在的月份
         * @returns {*} 渲染的月份数量
         */
        self.getRenderMonthCount = function () {
            var dateType = self.dateType,
                renderType = self.renderType;

            if (isInit || ((dateType === 'goTrip' || dateType === 'backTrip') && !renderType)) {
                renderMonthCount = 13;
            }
            if (renderType) {
                renderMonthCount = (endDateArr[0] - beginDateArr[0]) * 12 + (endDateArr[1] - beginDateArr[1]) + 1;
            }
            return renderMonthCount;
        };


        /**
         * @description 访问价格日期接口，取得价格日期数据
         * @returns {*}
         */
        self.requestData = function () {
            var promise = $http({
                method: 'POST',
                url: requestUrl,
                params: {
                    startDate: beginDateStr,
                    endDate: endDateStr
                },
                cache: true
            });
            promise.success(function (data, status, headers) {
                if (data.data) {
                    datePriceList = data.data;
                } else if (MockData) {
                    datePriceList = MockData.data;
                }

                serverTime = headers('date');
            });
            promise.error(function (data, status, headers) {

            });
            return promise;
        };

        $scope.$on('openGoTripDatePicker', function (e, data) {
            self.openDatePicker(e, data, true);
            self.renderType = null;
        });

        $scope.$on('openBackTripDatePicker', function (e, data) {
            self.openDatePicker(e, data, true);
            self.renderType = null;
        });

        $scope.$on('openGoDatePricePicker', function (e, data) {
            self.openDatePicker(e, data, true);
        });

        $scope.$on('openBackDatePricePicker', function (e, data) {
            self.openDatePicker(e, data, true);
        });

        $scope.$on('prevDay', function (e, data) {
            $log.info('前一天');
            self.openDatePicker(e, data, false);
            if (self.dateType === 'goTrip') {
                self.goTripPrevDay();
            }
            if (self.dateType === 'backTrip') {
                self.backTripPrevDay();
            }

        });

        $scope.$on('nextDay', function (e, data) {
            $log.info('后一天');
            self.openDatePicker(e, data, false);
            if (self.dateType === 'goTrip') {
                self.goTripNextDay();
            }
            if (self.dateType === 'backTrip') {
                self.backTripNextDay();
            }
        });

        //去程-前一天
        self.goTripPrevDay = function () {
            var goDateInfo = self.getStorageGoDateInfo(),
                goDateObj = goDateInfo.curDateObj,
                goDateArr = goDateObj.dateArr,
                isToday,
                preDateObj;
            isToday = !self.dateCompare(beginDateArr, goDateArr);
            if (isToday) {
                return;
            }
            preDateObj = self.getPrevDateObj(goDateObj);
            self.emitSelectDateEvent(preDateObj);
        };

        //去程-后一天
        self.goTripNextDay = function () {
            var goDateInfo = self.getStorageGoDateInfo(),
                goDateObj = goDateInfo.curDateObj,
                goDateArr = goDateObj.dateArr,
                lastPriceDateObj = self.lastPriceDateObj,
                isLastPriceDay,
                nextDateObj;
            isLastPriceDay = !self.dateCompare(goDateArr, lastPriceDateObj.dateArr);
            if (isLastPriceDay) {
                return;
            }
            nextDateObj = self.getNextDateObj(goDateObj);
            self.emitSelectDateEvent(nextDateObj);
        };

        //返程-前一天
        self.backTripPrevDay = function () {
            var backDateInfo = self.getStorageBackDateInfo(),
                goDateInfo = self.getStorageGoDateInfo(),
                backDateObj = backDateInfo.curDateObj,
                goDateObj = goDateInfo.curDateObj,
                isEqualGoDate,
                preDateObj;
            isEqualGoDate = backDateObj.index === (goDateObj.index + 1);
            if (isEqualGoDate) {
                return;
            }
            preDateObj = self.getPrevDateObj(backDateObj);
            self.emitSelectDateEvent(preDateObj);
        };

        //返程-后一天
        self.backTripNextDay = function () {
            var backDateInfo = self.getStorageBackDateInfo(),
                backDateObj = backDateInfo.curDateObj,
                isEqualLastPriceDay,
                lastPriceDateObj = self.lastPriceDateObj,
                nextDateObj;
            isEqualLastPriceDay = !self.dateCompare(backDateObj.dateArr, lastPriceDateObj.dateArr);
            if (isEqualLastPriceDay) {
                return;
            }

            nextDateObj = self.getNextDateObj(backDateObj);
            self.emitSelectDateEvent(nextDateObj);
        };

        /**
         * @description 打开去程，返程日期控件公共函数
         * @param e
         * @param data 由父级controller传递过来的数据
         * @param isOpen 是否打开，前一天，后一天的事件不打开日期控件
         */
        self.openDatePicker = function (e, data, isOpen) {
            self.open = isOpen;
            if (angular.isObject(data)) {
                if (angular.isString(data.dateType)) {
                    self.dateType = data.dateType;
                }
                if (angular.isString(data.renderType)) {
                    self.renderType = data.renderType;
                }
            }
            self.init(isOpen);
        };

        /**
         * @description 隐藏日期控件
         */
        self.closeDatePicker = function () {
            self.open = false;
            isInit = false;
            $scope.$emit('closeDatePicker', {});
        };

        /**
         * @description 不传参：获取当前日期
         *              传参：获取传入日期加若干年或月或日以后的日期
         *
         * @param dateObj 参数格式：
         *                      {
     *                          dateArr: [年，月，日，星期],
     *                          addType: 'd',
     *                          addNum: 10,
     *                          isBreak: false
     *                      }
         *                参数说明：
         *                  dateArr: 传入的日期数组，作为起始日期
         *                  addType: 'd', date上加多少; 'm': month上加多少; 'y': year上加多少
         *                  addNum: 加多少年或月或日
         *                  isBreak: 是否贯穿，可以同时加任意年月日
         *
         * @returns {*} 返回起始日期加若干年或月或日以后的日期
         */
        self.getDate = function (dateObj) {
            var newDate = new Date(serverTime),
                year,
                month,
                date,
                day;
            if (angular.isUndefined(dateObj)) {
                year = newDate.getFullYear();
                month = newDate.getMonth() + 1;
                date = newDate.getDate();
                day = newDate.getDay();
                return [year, month, date, day];
            }
            if (angular.isObject(dateObj)) {
                var addType = dateObj.addType || 'd',
                    dateArr = dateObj.dateArr,
                    addNum = dateObj.addNum || 1,
                    isBreak = dateObj.isBreak || true,
                    newDateAdded,
                    newDateAddedMs,
                    yearAdded,
                    monthAdded,
                    dateAdded,
                    dayAdded;
                year = dateArr[0];
                month = dateArr[1] - 1;
                date = dateArr[2];
                newDate = new Date(year, month, date);
                switch (addType) {
                    case 'd':
                        newDateAddedMs = newDate.setDate(date + addNum);
                        break;
                    case 'm':
                        newDateAddedMs = newDate.setMonth(month + addNum);
                        break;
                    case 'y':
                        newDateAddedMs = newDate.setFullYear(year + addNum);
                        break;
                    default :
                        break;
                }
                newDateAdded = new Date(newDateAddedMs);
                dateAdded = newDateAdded.getDate();
                monthAdded = newDateAdded.getMonth() + 1;
                yearAdded = newDateAdded.getFullYear();
                dayAdded = newDateAdded.getDay();
                return [yearAdded, monthAdded, dateAdded, dayAdded];
            }
        };

        /**
         * @description 获取当前日期，也是日期控件开始渲染的日期所在月，服务器请求参数之一
         * @returns {number|*}  返回当前日期
         */
        self.getBeginDate = function () {
            return self.getDate();
        };

        /**
         * @description 获取当前日期+90天以后的结束日期，服务器请求参数之一
         * @returns {number|*}
         */
        self.getEndDate = function () {
            return self.getDate({
                dateArr: beginDateArr,
                addNum: 30
            });
        };

        /**
         * @description 获取日期控件渲染的结束日期，渲染12个月的日期
         */
        self.getRenderEndDate = function () {
            return self.getDate({
                dateArr: beginDateArr,
                addType: 'y'
            });
        };

        /**
         * @description 渲染日期控件，机票价格
         *              通过dateType判断，即可以渲染去程日期视图，也可以渲染返程日期视图，并做相应的样式调整。
         *
         */
        self.renderDate = function () {
            var eachYear = beginDateArr[0],
                eachMonth = beginDateArr[1],
                d = new Date(),
                startIndex,
                isToday = 0,
                renderDateCount,
                renderDate,
                renderDateArr,
                numberDate,
                eachMonthLastDateIndex,
                isHighLight,
                isSelected,
                goTripDateArr,
                backTripDateArr,
                isUsable = false,
                priceList = angular.copy(datePriceList),
                priceObj,
                price,
                cnDay,
                index = 0,
                isTomorrow = false,
                renderType = self.renderType,
                isHasPrice = false;

            if (!isInit) {
                goTripDateArr = self.initDateObj.dateArr;
                backTripDateArr = self.getStorageBackDateInfo().curDateObj.dateArr;
            }

            for (var i = 0; i < renderMonthCount; i++) {
                if (eachMonth > 12) {
                    eachMonth = 1;
                    eachYear++;
                }

                self.dateArray[i] = {
                    year: eachYear,
                    month: eachMonth
                };

                d.setDate(1);
                d.setMonth(eachMonth - 1);
                d.setFullYear(eachYear);
                self.dateArray[i].dateObj = [];

                startIndex = self.getDateIndex(eachYear, eachMonth - 1, 1);
                renderDateCount = startIndex + self.getDaysInMonth(eachYear, eachMonth);

                for (var j = 0; j < renderDateCount; j++) {
                    isHighLight = isSelected = false;

                    if (j < startIndex) {
                        self.dateArray[i].dateObj[j] = {
                            isUsable: isUsable,
                            renderDate: '',
                            date: ''
                        }
                    } else {
                        renderDate = numberDate = d.getDate();
                        cnDay = weekDay[d.getDay()];
                        renderDateArr = [eachYear, eachMonth, numberDate];
                        if (!self.dateCompare(renderDateArr, beginDateArr)) {
                            isToday = 1;
                            isUsable = true;
                            isHasPrice = true;
                            var t = 0;
                        }

                        if(eachYear === beginDateArr[0] + 1 && eachMonth === beginDateArr[1] && renderDate === beginDateArr[2]) {
                            isUsable = false;
                        }

                        //计算渲染日期对应的价格的开始位置
                        if (isHasPrice) {
                            priceObj = priceList[t];
                            if (priceObj && priceObj.parPrice) {
                                price = priceObj.parPrice;
                            } else {
                                isHasPrice = false;
                                self.lastPriceDateObj = self.dateArray[i].dateObj[j - 1];
                                if (renderType) {
                                    isUsable = false;
                                }
                            }
                            t++;
                        }

                        /*
                         如果用户打开的是返程日期选择，若当前渲染的日期比去程日期大，则该日期可用；
                         如果当前渲染的日期等于去程日期，则该日期为选中状态;

                         如果用户打开的是去程日期，并且用户选择过去程日期，若当前渲染日期等于去程日期，则该日期为选中状态
                         */
                        if (self.isSelectBackTrip()) {
                            var result = self.dateCompare(renderDateArr, goTripDateArr) === -1;
                            if (renderType) {
                                isUsable = result && isHasPrice;
                            } else {
                                isUsable = result;
                            }
                            isSelected = !self.dateCompare(renderDateArr, backTripDateArr) && isUsable;
                        } else {
                            isSelected = !self.dateCompare(renderDateArr, goTripDateArr);
                        }


                        switch (isToday) {
                            case 1:
                                cnDay = renderDate = '今天';
                                isToday++;
                                isHighLight = true;
                                break;
                            case 2:
                                cnDay = renderDate = '明天';
                                isToday++;
                                isHighLight = true;
                                isTomorrow = true;
                                break;
                            case 3:
                                cnDay = renderDate = '后天';
                                isToday++;
                                isHighLight = true;
                                break;
                            default:
                                break;
                        }

                        self.dateArray[i].dateObj[j] = {
                            isUsable: isUsable,
                            renderDate: renderDate,
                            dateArr: renderDateArr.concat([d.getDay()]),
                            cnDay: cnDay,
                            dateFormat: self.getFormatDate(renderDateArr),
                            isHighLight: isHighLight,
                            isSelected: isSelected,
                            isHasPrice: isHasPrice,
                            price: price,
                            dateArrIndex: i,
                            index: index++
                        };
                        dateObjList.push(self.dateArray[i].dateObj[j]);
                        d.setDate(d.getDate() + 1);
                        renderDateArr = null;
                        if (isInit && isTomorrow) {
                            var goDateInfo = self.getStorageGoDateInfo();
                            self.initDateObj = goDateInfo ? goDateInfo.curDateObj : self.dateArray[i].dateObj[j];
                            isTomorrow = null;
                        }

                    }

                }
                eachMonth++;
                eachMonthLastDateIndex = self.getDateIndex(eachYear, eachMonth - 1, 0);
                for (var k = 0; k < (6 - eachMonthLastDateIndex); k++) {
                    self.dateArray[i].dateObj[j + k] = {
                        isUsable: false,
                        renderDate: '',
                        date: ''
                    }
                }
            }
        };

        /**
         * @description 日期比较，通过转换为毫秒数来进行日期比较
         *              相等： 返回0
         *              前者小于后者： 返回1
         *              前者大于后者： 返回-1
         * @param date
         * @param anotherDate
         * @returns {number}
         */
        self.dateCompare = function (date, anotherDate) {
            var dateMs,
                anotherDateMs;
            if (angular.isArray(date)) {
                dateMs = self.dateArrToMs(date);
            }
            if (angular.isArray(anotherDate)) {
                anotherDateMs = self.dateArrToMs(anotherDate);
            }
            if (dateMs === anotherDateMs) {
                return 0;
            }
            return dateMs < anotherDateMs ? 1 : -1;
        };

        /**
         * @description 将日期转换为毫秒
         * @param dateArr 日期数组[2015, 4, 21]
         * @returns {number} 毫秒
         */
        self.dateArrToMs = function (dateArr) {
            var date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
            return date.getTime();
        };

        /**
         * @description 检查是否已经有去程日期缓存数据
         * @returns {boolean|*}
         */
        self.hasGoTripDateObj = function () {
            var goDateInfo = self.getStorageGoDateInfo(),
                goDateObj;
            if (angular.isObject(goDateInfo)) {
                goDateObj = goDateInfo.curDateObj;
                return angular.isObject(goDateObj);
            }
        };

        /**
         * @description 检查是否已经有返程日期缓存数据
         * @returns {boolean|*}
         */
        self.hasBackTripDateObj = function () {
            var backDateInfo = self.getStorageBackDateInfo(),
                backDateObj;
            if (angular.isObject(backDateInfo)) {
                backDateObj = backDateInfo.curDateObj;
            }
            return angular.isObject(backDateObj);
        };

        /**
         * @description 获取缓存中的去程日期信息（包含3天的日期对象）
         * @returns {*}
         */
        self.getStorageGoDateInfo = function () {
            var datePickerData = angular.fromJson(localStorage.getItem('datePickerData')),
                goDateInfo;
            if (angular.isObject(datePickerData)) {
                goDateInfo = datePickerData.goDateInfo;
                if (angular.isObject(goDateInfo)) {
                    return goDateInfo;
                }
            }
        };

        /**
         * @description 获取缓存中的返程日期信息（包含3天的日期对象）
         * @returns {*}
         */
        self.getStorageBackDateInfo = function () {
            var datePickerData = angular.fromJson(localStorage.getItem('datePickerData')),
                backDateInfo;
            if (angular.isObject(datePickerData)) {
                backDateInfo = datePickerData.backDateInfo;
                if (angular.isObject(backDateInfo)) {
                    return backDateInfo;
                }
            }
        };

        /**
         * @description 判断用户是选择去程日期还是返程日期
         * @returns {boolean}
         */
        self.isSelectBackTrip = function () {
            return self.dateType === 'backTrip';
        };

        /**
         * @description 格式化日期，格式为: '2015-04-09'
         * @param y 年
         * @param m 月
         * @param d 日
         * @returns {string}
         */
        self.getFormatDate = function (y, m, d) {
            var mFormat,
                dateFormat;
            if (arguments.length === 3) {
                if (m < 10) {
                    mFormat = '0' + m;
                } else {
                    mFormat = m;
                }
                if (d < 10) {
                    dateFormat = '0' + d;
                } else {
                    dateFormat = d;
                }
                return y + '-' + mFormat + '-' + dateFormat;
            }
            if (arguments.length === 1 && angular.isArray(y)) {
                var year = y[0],
                    month = y[1],
                    date = y[2];
                return self.getFormatDate(year, month, date);
            }
        };

        /**
         * @description 用户选择日期处理函数，添加选中样式，移除其他日期的选中样式，调用emitSelectDateEvent函数将选中的日期对象发送到父级作用域
         * @param dateObj
         * @param e
         */
        self.selectDate = function (dateObj, e) {
            if (!dateObj.isUsable) return;
            var target = e.target,
                $targetDate = angular.element(target),
                selectedClassName = 'selected',
                $dateBody = $element.find('article'),
                $allDate = $dateBody.find('span');

            if (target.nodeName.toLocaleUpperCase() === 'SPAN') {
                if ($targetDate.hasClass(selectedClassName)) return;
                $allDate.removeClass(selectedClassName);
                $targetDate.addClass(selectedClassName);
            }
            self.emitSelectDateEvent(dateObj);
        };


        /**
         * @description 将选中的日期对象发送到父级作用域，判断用户当前打开的是去程日期选择，还是返程日期选择
         *
         *              1.如果是返程日期选择self.isSelectedBackTrip()返回true,返程日期backDateObj为dateObj，
         *              若去程日期没有选择过，则去程日期为初始日期beginDateArr
         *              若去程日期选择过，则去程日期为缓存的去程日期self.goTripDateArr
         *
         *              2.如果是去程日期选择，去程日期对象goDateObj为用户选择的日期对象dateObj;
         *              若去程日期超过返程日期，返程日期为去程日期+2天self.getBackDateObj(goDateObj.dateArr).dateArr;
         *              若去程日期没有超过返程日期，并且返程日期选择过，则返程日期为缓存的返程日期self.backTripDateArr
         *              若去程日期没有超过返程日期，并且返程日期没有选择过，则返程日期为初始日期+2天self.getBackDateObj().dateArr;
         *
         *
         * @param dateObj 选中的日期对象
         */
        self.emitSelectDateEvent = function (dateObj) {
            var goDateObj,
                emitData,
                backDateObj,
                goDateInfo,
                backDateInfo;
            if (self.isSelectBackTrip()) {
                goDateInfo = self.getStorageGoDateInfo();
                if (angular.isObject(goDateInfo)) {
                    goDateObj = goDateInfo.curDateObj
                } else {
                    goDateObj = self.initDateObj;
                }
                backDateObj = dateObj;
            } else {
                goDateObj = dateObj;
                if (self.isGoDateOverBack(goDateObj)) {
                    backDateObj = self.getBackDateObj(goDateObj);
                } else {
                    backDateInfo = self.getStorageBackDateInfo();
                    if (angular.isObject(backDateInfo)) {
                        backDateObj = backDateInfo.curDateObj;
                    } else {
                        backDateObj = self.getBackDateObj();
                    }
                }
            }
            emitData = {
                goDateInfo: {
                    curDateObj: goDateObj,
                    preDateObj: self.getPrevDateObj(goDateObj),
                    nextDateObj: self.getNextDateObj(goDateObj)
                },
                backDateInfo: {
                    curDateObj: backDateObj,
                    preDateObj: self.getPrevDateObj(backDateObj),
                    nextDateObj: self.getNextDateObj(backDateObj)
                }
            };

            self.setDateObjCache(emitData);
            if (!isInit) {
                self.updateInitDateObj();
            }
            self.closeDatePicker();
            $scope.$emit('onSelectDate', emitData);
        };

        self.updateInitDateObj = function () {
            var goDateInfo = self.getStorageGoDateInfo();
            if (angular.isObject(goDateInfo)) {
                self.initDateObj = goDateInfo.curDateObj;
            }
        };

        /**
         * @description 获取日期对象的前一个日期对象
         * @param dateObj 日期对象
         * @returns {*} 前一个日期对象
         */
        self.getPrevDateObj = function (dateObj) {
            var curDateObjIndex = dateObj.index,
                prevDateObjIndex = curDateObjIndex - 1,
                prevDateObj;
            prevDateObj = self.getDateObjByIndex(prevDateObjIndex);
            return prevDateObj;
        };

        /**
         * @description 获取日期对象的下一个日期对象
         * @param dateObj 日期对象
         * @returns {*} 下一个日期对象
         */
        self.getNextDateObj = function (dateObj) {
            var curDateObjIndex = dateObj.index,
                nextDateObjIndex = curDateObjIndex + 1,
                nextDateObj;
            nextDateObj = self.getDateObjByIndex(nextDateObjIndex);
            return nextDateObj;
        };

        /**
         * @description 通过日期对象索引查找日期对象
         * @param index 日期对象索引
         * @returns {*} 查找到的日期对象
         */
        self.getDateObjByIndex = function (index) {
            var len = dateObjList.length,
                dateObj,
                queryIndex,
                i = 0;
            for (; i < len; i++) {
                dateObj = dateObjList[i];
                queryIndex = dateObj.index;
                if (angular.isNumber(queryIndex) && (index === queryIndex)) {
                    return dateObj;
                }
            }
        };

        /**
         * @description 在localStorage中和controller属性中缓存用户选择的去程日期、返程日期
         * @param emitData 向父级作用域发送的日期对象，包含去程（前一天，当前，后一天），返程（前一天，当前，后一天）
         */
        self.setDateObjCache = function (emitData) {
            self.emitData = emitData;

            localStorage.setItem('datePickerData', angular.toJson(emitData));
        };

        /**
         * @description 用户选择的去程日期是否超过了当前已存在的返程日期，如果超过，则设置返程日期为去程日期+ 2天
         * @param goDateObj 用户选择的去程日期对象
         * @returns {boolean} 若去程日期超过返程日期，返回true，否则为false
         */
        self.isGoDateOverBack = function (goDateObj) {
            var goDateIndex = goDateObj.index,
                backDateObj,
                backDateInfo,
                backDateIndex;
            if (self.hasBackTripDateObj()) {
                backDateInfo = self.getStorageBackDateInfo();
                backDateIndex = backDateInfo.curDateObj.index;
            } else {
                backDateObj = self.getBackDateObj();
                backDateIndex = backDateObj.index;
            }
            if (goDateIndex >= backDateIndex) {
                return true;
            }
        };

        /**
         * @description 根据去程日期，获取默认的返程日期，默认返程日期=去程日期+2天
         * @param goDateObj 去程日期对象
         * @returns {{}} 返程日期对象
         */
        self.getBackDateObj = function (goDateObj) {
            var dateObj = goDateObj || self.initDateObj,
                goDateIndex = dateObj.index,
                backDateIndex = goDateIndex + backDateStep,
                backDateObj;
            backDateObj = self.getDateObjByIndex(backDateIndex);
            return backDateObj;
        };

        /**
         * @description 获取日期的索引位置（通过对应的星期数来获取）
         */
        self.getDateIndex = function (y, m, d) {
            return new Date(y, m, d).getDay();
        };


        //self.fixIosStyle = function () {
        //    if (cm.isIosDevice()) {
        //        cm.$('.tt-header').css({'position': 'relative', 'top': '0'});
        //        cm.$('#container').css({'paddingTop': '0', 'top': '0', 'position': 'absolute'});
        //        cm.$('.addspace').css('background', '#d30775');
        //    }
        //};

        /**
         * @description 判断是闰年还是平年
         * @param year
         * @param month
         * @returns {number} 返回闰年2月份天数，或者平年各个月份天数
         */
        self.getDaysInMonth = function (year, month) {
            return (month === 2 && (year % 4 === 0 && year % 100 === 0)) || year % 400 === 0 ? 28 : monthDay[month];
        };

        if (isInit) {
            self.init();
        }

    }
    ])
;