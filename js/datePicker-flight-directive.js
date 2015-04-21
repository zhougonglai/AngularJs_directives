'use strict';

var datePickerFlight = angular.module('datePicker.flight', []);

datePickerFlight
    .directive('datePicker', function () {
        return {
            restrict: "EA",
            templateUrl: "./templates/datePicker-flight.tpl.html",
            replace: true,
            transclude: true,
            scope: {
                dpConfig: '=dpConfig'
            },
            require: ['datePicker'],
            controller: 'DatePickerController',
            controllerAs: 'DPController'
        }
    }).controller('DatePickerController', ['$scope', '$element', '$http', '$log', function ($scope, $element, $http, $log) {

        var self = this,
            weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            monthDay = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            beginDateArr,
            endDateArr,
            beginDateStr,
            endDateStr,
            renderEndDateArr,
            renderMonthCount = 12,
            requestUrl = $scope.dpConfig.url;

        self.dateArray = [];
        self.goTripDateArr = null;
        self.backTripDateArr = null;

        self.init = function () {
            //默认隐藏日期控件
            self.open = true;
            //请求服务器数据,得到90天日期价格
            self.requestData();
            //当前日期
            beginDateArr = self.getBeginDate();
            beginDateStr = self.getFormatDate(beginDateArr);
            //当前日期+90天=结束日期
            endDateArr = self.getEndDate();
            endDateStr = self.getFormatDate(endDateArr);
            //渲染的结束日期(渲染12个月的日期)
            renderEndDateArr = self.getRenderEndDate();
            //渲染日期
            self.renderDate();
        };


        self.requestData = function () {
            var promise = $http({
                method: 'POST',
                url: requestUrl,
                params: {
                    startDate: beginDateStr,
                    endDate: endDateStr
                }
            });
            promise.success(function(data, status, headers) {

            });
            promise.error(function(data, status, headers){

            });
        };

        $scope.$on('openGoTripDatePicker', function(e, data) {
            self.openDatePicker(e, data);
        });

        $scope.$on('openBackTripDatePicker', function(e, data) {
            self.openDatePicker(e, data);
        });

        /**
         * @description 打开去程，返程日期控件公共函数
         * @param e
         * @param data 由父级controller传递过来的数据
         */
        self.openDatePicker = function(e, data) {
            self.open = !self.open;
            if(data) {
                self.dateType = data.dateType;
            }
            self.init();
        };

        /**
         * @description 隐藏日期控件
         */
        self.closeDatePicker = function () {
            self.open = !self.open;
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
            var newDate = new Date(),
                year,
                month,
                date,
                day;
            if (angular.isUndefined(dateObj)) {
                year = newDate.getFullYear();
                month = newDate.getMonth() + 1;
                date = newDate.getDate();
                day = weekDay[newDate.getDay()];
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
         * @description 渲染日期控件
         */
        self.renderDate = function() {
            var eachYear = beginDateArr[0],
                eachMonth = beginDateArr[1],
                d = new Date(),
                startIndex,
                isToday = 0,
                renderDateCount,
                renderDate,
                numberDate,
                eachMonthLastDateIndex,
                isHighLight,
                isSelected,
                goTripDateArr,
                backTripDateArr,
                isUsable = false;

            goTripDateArr = self.goTripDateArr || beginDateArr;
            backTripDateArr = self.backTripDateArr || self.getBackDateInfo();

            for(var i = 0; i < renderMonthCount; i++) {
                if(eachMonth > 12) {
                    eachMonth = 1;
                    eachYear ++;
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

                for(var j = 0; j < renderDateCount; j++) {
                    isHighLight = isSelected = false;

                    if(j < startIndex) {
                        self.dateArray[i].dateObj[j] = {
                            isUsable: isUsable,
                            renderDate: '',
                            date: ''
                        }
                    } else {
                        renderDate = numberDate = d.getDate();
                        if(eachYear === beginDateArr[0] && eachMonth === beginDateArr[1] && numberDate === beginDateArr[2]) {
                            isToday = 1;
                            isUsable = true;
                        }

                        if(self.isSelectBackTrip()) {
                            var result = self.dateCompare([eachYear, eachMonth, numberDate], goTripDateArr);
                            isUsable = result === -1;
                            isSelected = eachYear === backTripDateArr[0] && eachMonth === backTripDateArr[1] && numberDate === backTripDateArr[2];
                        } else if(self.hasGoTripDateInfo()){
                            isSelected = eachYear === goTripDateArr[0] && eachMonth === goTripDateArr[1] && numberDate === goTripDateArr[2];
                        }

                        switch (isToday) {
                            case 1:
                                renderDate = '今天';
                                isToday++;
                                isHighLight = true;
                                break;
                            case 2:
                                renderDate = '明天';
                                isToday++;
                                isHighLight = true;
                                if(!self.hasGoTripDateInfo()) {
                                    isSelected = true;
                                }
                                break;
                            case 3:
                                renderDate = '后天';
                                isToday++;
                                isHighLight = true;
                                break;
                            default:
                                break;
                        }

                        self.dateArray[i].dateObj[j] = {
                            isUsable: isUsable,
                            renderDate: renderDate,
                            dateArr: [eachYear, eachMonth, numberDate, d.getDay()],
                            cnDay: weekDay[d.getDay()],
                            dateFormat: self.getFormatDate(eachYear, eachMonth, numberDate),
                            isHighLight: isHighLight,
                            isSelected: isSelected
                        };
                        d.setDate(d.getDate() + 1);
                    }

                }
                eachMonth ++;
                eachMonthLastDateIndex = self.getDateIndex(eachYear, eachMonth - 1, 0);
                for(var k = 0; k < (6 - eachMonthLastDateIndex); k++) {
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
        self.dateCompare = function(date, anotherDate) {
            var dateMs,
                anotherDateMs;
            if(angular.isArray(date)) {
                dateMs = self.dateArrToMs(date);
            }
            if(angular.isArray(anotherDate)) {
                anotherDateMs = self.dateArrToMs(anotherDate);
            }
            if(dateMs === anotherDateMs) {
                return 0;
            }
            return dateMs < anotherDateMs ? 1 : -1;
        };

        self.dateArrToMs = function(dateArr) {
            var date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
            return date.getTime();
        };

        /**
         * @description 用户是否选择了去程日期，默认值不算选择
         *              默认日期为明天，第一次打开日期控件将会设置明天为选中状态，
         *              如果用户选择了去程日期，以后再打开日期控件，则将用户选择的去程日期设为选中状态
         * @returns {boolean|*}
         */
        self.hasGoTripDateInfo = function() {
            return angular.isArray(self.goTripDateArr);
        };

        /**
         * @description 判断用户是选择去程日期还是返程日期
         * @returns {boolean}
         */
        self.isSelectBackTrip = function() {
            return self.dateType === 'backTrip';
        };

        /**
         * @description 格式化日期，格式为: '2015-04-09'
         * @param y 年
         * @param m 月
         * @param d 日
         * @returns {string}
         */
        self.getFormatDate = function(y, m, d) {
            var mFormat,
                dateFormat;
            if(arguments.length === 3) {
                if(m < 10) {
                    mFormat = '0' + m;
                } else {
                    mFormat = m;
                }
                if(d < 10) {
                    dateFormat = '0' + d;
                } else {
                    dateFormat = d;
                }
                return y + '-' + mFormat + '-' + dateFormat;
            }
            if(arguments.length === 1 && angular.isArray(y)) {
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
        self.selectDate = function(dateObj, e) {
            if(!dateObj.isUsable) return;
            var target = e.target,
                $targetDate = angular.element(target),
                selectedClassName = 'selected',
                $dateBody = $element.find('article'),
                $allDate = $dateBody.find('span');

            if(target.nodeName.toLocaleUpperCase() === 'SPAN') {
                if($targetDate.hasClass(selectedClassName)) return ;
                $allDate.removeClass(selectedClassName);
                $targetDate.addClass(selectedClassName);
            }
            self.emitSelectDateEvent(dateObj);
        };

        /**
         * @description 存储用户选择的去程日期，再打开返程日期时，去程日期之前的不可用状态
         * @param dateObj 去程日期对象
         */
        self.saveGoTripDateInfo = function(goDateObj) {
            self.goTripDateArr = goDateObj.dateArr;
        };

        /**
         * @description 将选中的日期对象发送到父级作用域
         * @param dateObj 选中的日期对象
         */
        self.emitSelectDateEvent = function(dateObj) {
            var goDateObj,
                backDateObj,
                dateArr = null,
                dateFormat = null;
            if (self.isSelectBackTrip()) {
                dateArr = self.goTripDateArr || beginDateArr;
                dateFormat = self.getFormatDate(dateArr[0], dateArr[1], dateArr[2]);
                goDateObj = {
                    dateArr: dateArr,
                    dateFormat: dateFormat
                };
                backDateObj = dateObj;
            } else {
                goDateObj = dateObj;
                if(self.isGoDateOverBack(goDateObj)) {
                    dateArr = self.getBackDateInfo(goDateObj.dateArr).dateArr;
                } else {
                    dateArr = self.backTripDateArr || self.getBackDateInfo().dateArr;
                }
                dateFormat = self.getFormatDate(dateArr[0], dateArr[1], dateArr[2]);
                backDateObj = {
                    dateArr: dateArr,
                    dateFormat: dateFormat
                }
            }
            var data = {
                goDateInfo: goDateObj,
                backDateInfo: backDateObj
            };
            self.saveGoTripDateInfo(goDateObj);
            self.saveBackTripDateInfo(backDateObj);
            self.closeDatePicker();
            $scope.$emit('onSelectDate', data);
        };

        self.saveBackTripDateInfo = function(backDateObj) {
            self.backTripDateArr = backDateObj.dateArr;
        };

        self.isGoDateOverBack = function(dateObj) {
            var goDateArr = dateObj.dateArr,
                backDateArr = self.backTripDateArr || self.getBackDateInfo();

            var result = self.dateCompare(goDateArr, backDateArr);
            return result === -1 || result === 0;
        };


        /**
         * @description 根据去程日期，获取默认的返程日期，默认返程日期=去程日期+2天
         * @param goDateArr 去程日期数组
         * @returns {{}} 返程日期对象
         */
        self.getBackDateInfo = function(goDateArr) {
            var backDate = {};
            backDate.dateArr = self.getDate({
                dateArr: goDateArr || beginDateArr,
                addNum: 2
            });
            backDate.dateFormat = self.getFormatDate(backDate.dateArr[0], backDate.dateArr[1], backDate.dateArr[2]);
            return backDate;
        };

        /**
         * @description 获取日期的索引位置（通过对应的星期数来获取）
         */
        self.getDateIndex = function(y, m, d) {
            return new Date(y, m ,d).getDay();
        };


        self.fixIosStyle = function() {
            if (cm.isIosDevice()) {
                cm.$('.tt-header').css({'position': 'relative', 'top': '0'});
                cm.$('#container').css({'paddingTop': '0', 'top': '0', 'position': 'absolute'});
                cm.$('.addspace').css('background', '#d30775');
            }
        };

        /**
         * @description 判断是闰年还是平年
         * @param year
         * @param month
         * @returns {number} 返回闰年2月份天数，或者平年各个月份天数
         */
        self.getDaysInMonth = function (year, month) {
            return (month === 2 && (year % 4 === 0 && year % 100 === 0)) || year % 400 === 0 ? 28 : monthDay[month];
        };

    }]);
