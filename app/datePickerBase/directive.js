'use strict';

myAppDirectives
    .directive('dpBase', function () {
        return {
            restrict: "EA",
            templateUrl: "./templates/directive/datePickerBase.tpl.html",
            replace: true,
            transclude: true,
            scope: {
                dpConfig: '=dpConfig'
            },
            require: ['dpBase'],
            controller: 'DPBaseController',
            controllerAs: 'DPBaseController'
        }
    }).controller('DPBaseController', ['$scope', '$element', function ($scope, $element) {
        var self = this,
            weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            monthDay = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            beginDateArr,
            endDateArr,
            renderEndDateArr,
            renderMonthCount = 12;

        self.dateArray = [];

        self.init = function () {
            //默认隐藏日期控件
            self.open = true;
            //请求服务器数据,得到90天日期价格
            self.requestData();
            //当前日期
            beginDateArr = self.getBeginDate();
            //当前日期+90天=结束日期
            endDateArr = self.getEndDate();
            //渲染的结束日期(渲染12个月的日期)
            renderEndDateArr = self.getRenderEndDate();

            self.renderDate();
        };


        self.requestData = function () {

        };

        /**
         * @description 隐藏日期控件
         */
        self.closeDatePicker = function () {
            self.open = !self.open;
            self.scope.$emit('closeDatePicker');
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
                addNum: 90
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
        self.renderDate = function () {
            var eachYear = beginDateArr[0],
                eachMonth = beginDateArr[1],
                eachDate = beginDateArr[2],
                d = new Date(),
                startIndex,
                isToday = 0,
                renderDateCount,
                renderDate,
                eachMonthLastDateIndex,
                isHighLight,
                isSelected,
                isUsable = false;

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
                        renderDate = d.getDate();
                        if (eachYear === beginDateArr[0] && eachMonth === beginDateArr[1] && renderDate === beginDateArr[2]) {
                            isToday = 1;
                            isUsable = true;
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
                                isHighLight = isSelected = true;
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
                            date: [eachYear, eachMonth, d.getDate(), d.getDay(), weekDay[d.getDay()]],
                            isHighLight: isHighLight,
                            isSelected: isSelected
                        };
                        d.setDate(d.getDate() + 1);
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
         * @description 用户选择日期处理函数，添加选中样式，移除其他日期的选中样式，调用emitSelectDateEvent函数将选中的日期对象发送到父级作用域
         * @param dateObj
         * @param e
         */
        self.selectDate = function (dateObj, e) {
            if (!dateObj.isUsable) return;
            var target = e.target,
                $targetDate = angular.element(target),
                selectedClassName = 'selected',
                $targetDateParent = $targetDate.parent(),
                $allDate = $targetDateParent.children();

            if (target.nodeName.toLocaleUpperCase() === 'SPAN') {
                if ($targetDate.hasClass(selectedClassName)) return;
                $allDate.removeClass(selectedClassName);
                $targetDate.addClass(selectedClassName);
            }
            self.emitSelectDateEvent(dateObj);
        };

        /**
         * @description 将选中的日期对象发送到父级作用域
         * @param dateObj 选中的日期对象
         */
        self.emitSelectDateEvent = function (dateObj) {
            //self.closeDatePicker();
            $scope.$emit('onSelectDate', dateObj);
        };


        /**
         * @description 获取日期的索引位置（通过对应的星期数来获取）
         */
        self.getDateIndex = function (y, m, d) {
            return new Date(y, m, d).getDay();
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

        self.init();
    }]);
