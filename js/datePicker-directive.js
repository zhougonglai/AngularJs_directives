/**
 * Created by dulin on 2015/4/13.
 */


var datePickerDirective = angular.module('datePickerDirective',[]);

datePickerDirective
    .constant('datePickerConfig',{})
    .directive('datePicker', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {

            },
            templateUrl: './templates/datePicker.tpl.html',
            controller: 'DatePickerController',
            controllerAs: 'DPController'
        }
    })
    .controller('DatePickerController', ['$scope', '$element', '$http', '$location','$log', function($scope, $element, $http, $location, $log) {

        var self = this,
            serverDate = '',
            daysOfMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            chineseDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        self.dateList = [];
        self.renderMonthCount = 6;

        self.init = function() {
            //测试系统时间
            self.show = true;
            serverDate = new Date();
            self.startDateArr = self.getStartDate();
            //self.endDateArr = self.getEndDate();
            //self.renderMonthCount = self.getRenderMonthCount();
            self.setDatePickerData();
        };

        /**
         * @description 获取服务器当前日期，用于日期控件初始化
         */
        self.getServerDate = function() {
            var getDateUrl = $location.absUrl();
            var promise = $http({
                method:'GET',
                url: getDateUrl
            });
            promise.success(function(data, status, headers) {
                serverDate = headers('date');
                self.init();
            });
            promise.error(function(data, status, headers) {

            });
        };

        /**
         * @description 隐藏日期控件
         */
        self.close = function() {
            self.show = !self.show;
        };

        /**
         * @description 获取当前日期年，月，日
         * @returns {*[]} 返回当前日期年,月,日为元素的数组
         */
        self.getStartDate = function() {
            var startDate = new Date(serverDate);
            var date = startDate.getDate(),
                month = startDate.getMonth() + 1,
                year = startDate.getFullYear();
            $log.info(year,month,date);
            return [year, month, date];
        };

        /**
         * @description 获取结束日期年，月，日
         * @returns {*[]} 返回结束日期年，月，日为元素的数组
         */
        self.getEndDate = function() {
            var startDateArr = self.getStartDate();
            return self.getDateAdd(startDateArr, 'm', 5);
        };

        /**
         * @description 获取几年，几个月，几天以后的日期
         * @param dateArr 起始日期数组，包含年，月，日，星期元素，例如[2015, 1, 31, 3]
         * @param dateType 'y'，获取几年以后的日期; 'm'，获取几个月以后的日期; 'd': 获取几天以后的日期
         * @param num 多少num以后的日期
         * @returns {*[]} 新的日期数组[2015, 7, 1, 3];
         */
        self.getDateAdd = function(dateArr, dateType, num) {
            if(!dateArr || !dateType) return;
            var addNum = 1,
                newDateMills,
                newDate,
                type = dateType;
            var year = dateArr[0],
                month = dateArr[1] - 1,
                date = dateArr[2];

            if(angular.isNumber(num)) {
                addNum = num;
            }
            switch (type) {
                case 'd':
                    newDateMills = new Date().setDate(date + addNum);
                    break;
                case 'm':
                    newDateMills = new Date().setMonth(month + addNum);
                    break;
                case 'y':
                    newDateMills = new Date().setFullYear(year + addNum);
                    break;
                default:
                    break;
            }
            newDate = new Date(newDateMills);
            return [newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate(), newDate.getDay()];
        };

        /**
         * @description 判断是否是闰年
         * @param month 月份
         * @param year 年份
         * @returns {number} 如果是闰年并且是2月，返回28；不是闰年，返回这个月对应的天数
         */
        self.isLeapYear = function(month, year) {
            return (month === 2) && ((year % 4 === 0 && year % 100 === 0) || year % 400 === 0) ? 28 : daysOfMonth[month];
        };

        /**
         * @description 获取渲染的月份数
         * @returns {number} 渲染的月份数
         */
        self.getRenderMonthCount = function() {
            var stM = self.startDateArr[1],
                stY = self.startDateArr[0],
                edM = self.endDateArr[1],
                edY = self.endDateArr[0];
            return (edY - stY) * 12 + (edM - stM) + 1;
        };

        /**
         * @description 构造日期控件每个月数据
         */
        self.setDatePickerData = function() {
            var i = 0,
                isUsable = false,
                isToday = 0,

                curYear = self.startDateArr[0],
                curMonth = self.startDateArr[1],
                curDate = self.startDateArr[2];
            for(; i < self.renderMonthCount; i++) {

                //每个月的总天数dateCount
                //每个月1号开始的位置firstDay
                //每个月最后一天结束的位置lastDay
                var dateCount = self.isLeapYear(curMonth, curYear),
                    firstDay = self.getDateDay(curMonth, curYear),
                    lastDay = self.getDateDay(curMonth, curYear, true);
                //$log.info(lastDay);

                var date = new Date();
                date.setDate(1);
                date.setMonth(curMonth - 1);
                date.setFullYear(curYear);

                if(curMonth > 12) {
                    curMonth = 1;
                    curYear ++;
                }
                self.dateList[i] = {
                    year: curYear,
                    month: curMonth
                };
                curMonth ++;

                self.dateList[i].dateInfo = [];
                for(var j = 0; j < firstDay + dateCount; j ++) {
                    var isHighLight = false;
                    if(j < firstDay) {
                        self.dateList[i].dateInfo[j] = {
                            renderDate: '',
                            date: '',
                            isUsable: false,
                            isHighLight: isHighLight
                        };
                    } else {
                        var renderDate = date.getDate();
                        if(renderDate === curDate && date.getMonth() + 1 === self.startDateArr[1] && date.getFullYear() === self.startDateArr[0]) {
                            isUsable = true;
                            isToday = 1;
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
                                break;
                            case 3:
                                renderDate = '后天';
                                isToday++;
                                isHighLight = true;
                                break;
                            default:
                                break;
                        }

                        self.dateList[i].dateInfo[j] = {
                            renderDate: renderDate,
                            date: [curYear, curMonth - 1, date.getDate(), self.getChineseDay(date)],
                            isUsable: isUsable,
                            isHighLight:  isHighLight
                        };

                        date.setDate(date.getDate() + 1);
                    }
                }
                for(var k = 0; k < (6 - lastDay); k++) {
                    self.dateList[i].dateInfo[j + k] = {
                        renderDate: '',
                        date: '',
                        isUsable: false,
                        isHighLight: isHighLight
                    }
                }
            }
        };

        /**
         * @description 获取中文星期数
         * @param date 日期
         * @returns {string} 中文星期数
         */
        self.getChineseDay = function(date) {
            return chineseDays[date.getDay()];
        };

        /**
         * @description 用户选择日期事件，向指令父作用域发送'onSelectDate'事件，并传送选择的日期数组
         * @param dateArr 日期数组
         */
        self.selectDate = function(dateArr) {
            $scope.$emit('onSelectDate', dateArr);
        };
        /**
         * @description 获取日期对应星期几，每个月的1号在视图中开始渲染的位置
         * @param month 月份
         * @param year 年份
         * @param isLastDay 是否获取月份最后一天星期
         * @returns {number} 返回日期对应的星期几
         */
        self.getDateDay = function(month, year, isLastDay) {
            var d;
            if(isLastDay) {
                d = new Date(year, month, 0)
            } else {
                d = new Date(year, month - 1, 1);
            }
            return d.getDay();
        };

        //self.getServerDate();
        self.init();
    }]);