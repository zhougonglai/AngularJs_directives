/**
 * Created by dulin on 2015/4/13.
 */


myAppDirectives
    .directive('dpVisa', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                dateConfig: '='
            },
            templateUrl: './templates/directive/datePickerVisa.tpl.html',
            controller: 'DPVisaController',
            controllerAs: 'DPVisaController'
        }
    })
    .controller('DPVisaController', ['$scope', '$element', '$http', '$location', '$log', 'Ajax', function ($scope, $element, $http, $location, $log, Ajax) {

        var self = this,
            serverDate = '',
            visaDate = '',
            visaDateStr = '',
            daysOfMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            chineseDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        self.dateList = [];
        self.renderMonthCount = 6;
        var getVisaGroupDateUrl = $scope.dateConfig.url,
            postData = $scope.dateConfig.postData,
            nextStepCallback = $scope.dateConfig.nextStepCallBack;


        self.init = function () {
            //测试系统时间
            self.show = true;
            self.count = $scope.count = 1;
            self.startDateArr = self.getDateArr(serverDate);
            self.visaDateArr = self.getDateArr(visaDate);
            self.setDatePickerData();
        };

        /**
         * @description "下一步"点击事件，用户自定义
         */
        self.nextStep = function () {
            if (!self.dateArr) {
                alert('请选择游玩日期');
                return;
            }
            self.emitEvent();
            if (angular.isFunction(nextStepCallback)) {
                nextStepCallback();
            }
        };

        /**
         * @description 减少份数点击事件
         */
        self.countIncrease = function () {
            $scope.count++;
        };

        /**
         * @description 增加份数点击事件
         */
        self.countDecrease = function () {
            if ($scope.count > 1) {
                $scope.count--;
            }
        };

        /**
         * @description 获取服务器当前日期，用于日期控件初始化
         */
        self.getServerDate = function () {
            var getDateUrl = $location.absUrl();
            var serverDatePromise = Ajax.get({
                url: getDateUrl
            });
            var datePromise = Ajax.post({
                url: getVisaGroupDateUrl,
                data: postData
            });

            serverDatePromise.then(function (obj) {
                serverDate = obj.headers('date');
                datePromise.then(function (obj) {
                    if (obj) {
                        visaDateStr = obj.data.data.list[0]['specDate'];
                        visaDate = self.rebuildServerDate(visaDateStr);
                        self.init();
                    }
                });
            });
        };

        /**
         * @description 重构服务器起始日期
         * @param startDateStr 起始日期，如['2015', '4', '15']
         * @returns {Date} 返回起始日期
         */
        self.rebuildServerDate = function (startDateStr) {
            var startDateArr = startDateStr.split('-'),
                yearStr = startDateArr[0],
                monthStr = startDateArr[1],
                dateStr = startDateArr[2],
                m = parseInt(monthStr, 10),
                d = parseInt(dateStr, 10),
                y = parseInt(yearStr, 10);
            return new Date(y, m - 1, d);
        };

        /**
         * @description 重构签证日期数据结构
         * @param data 签证日期数据
         * @returns {Array} 返回日期数组,结构为['2015-04-14', '2015-04-15', ...];
         */
        //self.rebuildData = function(data) {
        //    var dateList = data.data.list,
        //        len = dateList.length,
        //        dateObj,
        //        newDateList = [];
        //    if(len) {
        //        for(var i = 0; i < len; i++) {
        //            dateObj = dateList[i];
        //            newDateList.push(dateObj['specDate']);
        //        }
        //    }
        //    return newDateList;
        //};

        /**
         * @description 隐藏日期控件
         */
        self.close = function () {
            self.show = !self.show;
        };

        /**
         * @description 获取日期年，月，日
         * @returns {*[]} 返回日期年,月,日为元素的数组
         */
        self.getDateArr = function (someDate) {
            var startDate = new Date(someDate);
            var date = startDate.getDate(),
                month = startDate.getMonth() + 1,
                year = startDate.getFullYear();
            $log.info(year, month, date);
            return [year, month, date];
        };

        /**
         * @description 获取结束日期年，月，日
         * @returns {*[]} 返回结束日期年，月，日为元素的数组
         */
        //self.getEndDate = function() {
        //    return self.getDateAdd(self.startDateArr, 'm', 5);
        //};

        /**
         * @description 获取几年，几个月，几天以后的日期
         * @param dateArr 起始日期数组，包含年，月，日，星期元素，例如[2015, 1, 31, 3]
         * @param dateType 'y'，获取几年以后的日期; 'm'，获取几个月以后的日期; 'd': 获取几天以后的日期
         * @param num 多少num以后的日期
         * @returns {*[]} 新的日期数组[2015, 7, 1, 3];
         */
        self.getDateAdd = function (dateArr, dateType, num) {
            if (!dateArr || !dateType) return;
            var addNum = 1,
                newDateMills,
                newDate,
                type = dateType;
            var year = dateArr[0],
                month = dateArr[1] - 1,
                date = dateArr[2];

            if (angular.isNumber(num)) {
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
            return [newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate(), self.getChineseDay(newDate)];
        };

        /**
         * @description 判断是否是闰年
         * @param month 月份
         * @param year 年份
         * @returns {number} 如果是闰年并且是2月，返回28；不是闰年，返回这个月对应的天数
         */
        self.isLeapYear = function (month, year) {
            return (month === 2) && ((year % 4 === 0 && year % 100 === 0) || year % 400 === 0) ? 28 : daysOfMonth[month];
        };

        /**
         * @description 获取渲染的月份数
         * @returns {number} 渲染的月份数
         */
        self.getRenderMonthCount = function () {
            var stM = self.startDateArr[1],
                stY = self.startDateArr[0],
                edM = self.endDateArr[1],
                edY = self.endDateArr[0];
            return (edY - stY) * 12 + (edM - stM) + 1;
        };

        /**
         * @description 构造日期控件每个月数据
         */
        self.setDatePickerData = function () {
            var i = 0,
                isToday = 0,
                isUsable = false,
                curYear = self.startDateArr[0],
                curMonth = self.startDateArr[1],
                curDate = self.startDateArr[2],
                visaDate = self.visaDateArr[2],
                visaMonth = self.visaDateArr[1],
                visaYear = self.visaDateArr[0];
            for (; i < self.renderMonthCount; i++) {

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

                if (curMonth > 12) {
                    curMonth = 1;
                    curYear++;
                }
                self.dateList[i] = {
                    year: curYear,
                    month: curMonth
                };
                curMonth++;

                self.dateList[i].dateInfo = [];
                for (var j = 0; j < firstDay + dateCount; j++) {
                    var isHighLight = false,
                        isSelected = false;

                    if (j < firstDay) {
                        self.dateList[i].dateInfo[j] = {
                            renderDate: '',
                            date: '',
                            isUsable: isUsable,
                            isHighLight: isHighLight,
                            isSelected: isSelected
                        };
                    } else {
                        var renderDate = date.getDate(),
                            renderMonth = date.getMonth() + 1,
                            renderYear = date.getFullYear(),
                            renderDay = date.getDay();
                        //是否是"今天"
                        if (renderDate === curDate && renderMonth === self.startDateArr[1] && renderYear === self.startDateArr[0]) {
                            isToday = 1;
                        }
                        //是否是"可选日期"
                        if (renderDate === visaDate && renderMonth === visaMonth && renderYear === visaYear) {
                            isUsable = true;
                        }

                        if (renderDay === 0 || renderDay === 6) {
                            isHighLight = true;
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
                                //isSelected = true;
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
                            isHighLight: isHighLight,
                            isSelected: isSelected
                        };

                        date.setDate(date.getDate() + 1);
                    }
                }
                for (var k = 0; k < (6 - lastDay); k++) {
                    self.dateList[i].dateInfo[j + k] = {
                        renderDate: '',
                        date: '',
                        isUsable: isUsable,
                        isHighLight: isHighLight,
                        isSelected: isSelected
                    }
                }
            }
        };

        /**
         * @description 日期转换为字符串，格式为'2015-04-14'
         * @param date 日期
         * @returns {string} 字符串日期
         */
        self.dateStringify = function (date) {
            var y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate();
            var zeroStr = '0',
                yStr,
                mStr,
                dStr;

            yStr = '' + y;
            if (m < 10) {
                mStr = zeroStr + m;
            } else {
                mStr = '' + m;
            }
            if (d < 10) {
                dStr = zeroStr + d;
            } else {
                dStr = '' + d;
            }
            return yStr + '-' + mStr + '-' + dStr;
        };

        /**
         * @description 获取中文星期数
         * @param date 日期
         * @returns {string} 中文星期数
         */
        self.getChineseDay = function (date) {
            return chineseDays[date.getDay()];
        };

        /**
         * @description 构造向父级作用域发送的数据，数据包含用户选择的日期和份数
         */
        self.emitEvent = function () {
            var emitData = {
                dateArr: self.dateArr,
                count: $scope.count
            };
            $scope.$emit('onSelectDate', emitData);
        };

        /**
         * @description 用户选择日期事件，向指令父作用域发送'onSelectDate'事件，并传送选择的日期数组
         * @param dateInfo 用户点击的日期对象
         */
        self.selectDate = function (e, dateInfo) {
            var isUsable = dateInfo.isUsable;
            if (!isUsable) return false;
            var $dateCells = $element.find('section').children().find('span'),
                $target = angular.element(e.target);
            if (e.target.nodeName.toUpperCase() === 'SPAN') {
                if (!$target.hasClass('selected')) {
                    $dateCells.removeClass('selected');
                    $target.addClass('selected');
                }
            }
            self.dateArr = dateInfo.date;
        };
        /**
         * @description 获取日期对应星期几，每个月的1号在视图中开始渲染的位置
         * @param month 月份
         * @param year 年份
         * @param isLastDay 是否获取月份最后一天星期
         * @returns {number} 返回日期对应的星期几
         */
        self.getDateDay = function (month, year, isLastDay) {
            var d;
            if (isLastDay) {
                d = new Date(year, month, 0)
            } else {
                d = new Date(year, month - 1, 1);
            }
            return d.getDay();
        };

        self.getServerDate();
    }]);