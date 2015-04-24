angular.module('templates-main', ['../templates/datePicker-base.tpl.html', '../templates/datePicker-flight.tpl.html', '../templates/datePicker.tpl.html', '../templates/rollerPicker.tpl.html', '../templates/selectCity.tpl.html']);

angular.module("../templates/datePicker-base.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../templates/datePicker-base.tpl.html",
    "<div class=\"g-dp-ctn\" ng-show=\"DPController.open\">\n" +
    "    <header class=\"g-dp-hd\">\n" +
    "        <span class=\"u-back-btn\" ng-click=\"DPController.closeDatePicker()\"></span>\n" +
    "        选择日期\n" +
    "    </header>\n" +
    "    <article class=\"g-dp-bd\">\n" +
    "        <section class=\"m-dp-date\" ng-repeat=\"date in DPController.dateArray\">\n" +
    "            <p>{{date.year}}年{{date.month}}月</p>\n" +
    "            <div class=\"m-dp-day\">\n" +
    "                <div>日</div>\n" +
    "                <div>一</div>\n" +
    "                <div>二</div>\n" +
    "                <div>三</div>\n" +
    "                <div>四</div>\n" +
    "                <div>五</div>\n" +
    "                <div>六</div>\n" +
    "            </div>\n" +
    "            <div>\n" +
    "                <span ng-click=\"DPController.selectDate(dateInfo, $event)\"\n" +
    "                      ng-class=\"{usable: dateInfo.isUsable, highLight: dateInfo.isHighLight, selected: dateInfo.isSelected}\"\n" +
    "                      ng-repeat=\"dateInfo in date.dateObj\">\n" +
    "                    {{dateInfo.renderDate}}\n" +
    "                    <!--<i>&#165</i>-->\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </section>\n" +
    "    </article>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../templates/datePicker-flight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../templates/datePicker-flight.tpl.html",
    "<div class=\"g-dp-ctn\" ng-show=\"DPController.open\">\n" +
    "    <header class=\"g-dp-hd\">\n" +
    "        <span class=\"u-back-btn\" ng-click=\"DPController.closeDatePicker()\"></span>\n" +
    "        {{DPController.title}}\n" +
    "    </header>\n" +
    "    <article class=\"g-dp-bd\">\n" +
    "        <div class=\"m-dp-day\">\n" +
    "            <div>日</div>\n" +
    "            <div>一</div>\n" +
    "            <div>二</div>\n" +
    "            <div>三</div>\n" +
    "            <div>四</div>\n" +
    "            <div>五</div>\n" +
    "            <div>六</div>\n" +
    "        </div>\n" +
    "        <section class=\"m-dp-date\" ng-repeat=\"date in DPController.dateArray\">\n" +
    "            <p>{{date.year}}年{{date.month}}月</p>\n" +
    "            <div>\n" +
    "                <span ng-click=\"DPController.selectDate(dateInfo, $event)\"\n" +
    "                      ng-class=\"{usable: dateInfo.isUsable, highLight: dateInfo.isHighLight, selected: dateInfo.isSelected, hasPrice: dateInfo.isHasPrice}\"\n" +
    "                      ng-repeat=\"dateInfo in date.dateObj\">\n" +
    "                    {{dateInfo.renderDate}}\n" +
    "\n" +
    "                    <i ng-if=\"dateInfo.isHasPrice && dateInfo.isUsable\">&#165{{dateInfo.price}}</i>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </section>\n" +
    "    </article>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../templates/datePicker.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../templates/datePicker.tpl.html",
    "<div class=\"g-dp-ctn\" ng-show=\"DPController.show\">\n" +
    "    <header class=\"g-dp-hd\">\n" +
    "        <div class=\"u-dp-bk\" ng-click=\"DPController.close()\">\n" +
    "            <a class=\"u-dp-bk-icon\"></a>\n" +
    "        </div>\n" +
    "        <h1 class=\"u-dp-tt\">选择游玩日期和分数</h1>\n" +
    "    </header>\n" +
    "    <article class=\"g-dp-bd\">\n" +
    "        <section class=\"m-dp-bd\" ng-repeat=\"date in DPController.dateList\">\n" +
    "            <h2 class=\"u-dp-bd-tt\">{{date.year}}年{{date.month}}月</h2>\n" +
    "            <table class=\"m-dp-bd-day\">\n" +
    "                <thead>\n" +
    "                    <tr>\n" +
    "                        <td>日</td>\n" +
    "                        <td>一</td>\n" +
    "                        <td>二</td>\n" +
    "                        <td>三</td>\n" +
    "                        <td>四</td>\n" +
    "                        <td>五</td>\n" +
    "                        <td>六</td>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "            </table>\n" +
    "            <div class=\"m-dp-bd-date\">\n" +
    "                <span ng-repeat=\"dateInfo in date.dateInfo\"\n" +
    "                      ng-class=\"{unUsable: !dateInfo.isUsable, highLight: dateInfo.isHighLight, selected: dateInfo.isSelected}\"\n" +
    "                      ng-click=\"DPController.selectDate($event, dateInfo)\">\n" +
    "                    {{dateInfo.renderDate}}\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </section>\n" +
    "    </article>\n" +
    "    <footer class=\"g-dp-ft\">\n" +
    "        <div class=\"m-dp-ft-l\">\n" +
    "            <span class=\"u-dp-ft-count-text\">份数</span>\n" +
    "            <div class=\"m-dp-ft-count\">\n" +
    "                <a class=\"u-dp-ft-count-minus\" ng-click=\"DPController.countDecrease()\">-</a>\n" +
    "                <p class=\"u-dp-ft-count\">{{count}}</p>\n" +
    "                <a class=\"u-dp-ft-count-plus\" ng-click=\"DPController.countIncrease()\">+</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"m-dp-ft-r\">\n" +
    "            <a class=\"u-dp-next-btn\" ng-click=\"DPController.nextStep()\">下一步</a>\n" +
    "        </div>\n" +
    "    </footer>\n" +
    "</div>");
}]);

angular.module("../templates/rollerPicker.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../templates/rollerPicker.tpl.html",
    "<div>\n" +
    "    hello world\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("../templates/selectCity.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../templates/selectCity.tpl.html",
    "<div class=\"g-city-sct-container\" ng-show=\"SelectCityController.open\">\n" +
    "    <div class=\"g-city-sct-hd\">\n" +
    "        <a class=\"u-back-btn\" ng-click=\"SelectCityController.close()\">取消</a>\n" +
    "        <input id=\"j-city-srh\" class=\"u-city-srh\" type=\"search\" placeholder=\"{{SelectCityController.inputPlaceholder}}\"\n" +
    "               ng-model=\"search\"/>\n" +
    "    </div>\n" +
    "    <div class=\"g-city-sct-bd\">\n" +
    "        <ul class=\"city-list\">\n" +
    "            <li id=\"CURRENT\" ng-if=\"!search\">\n" +
    "                <h4 class=\"u-city-sct-cur-hd\">{{SelectCityController.curPosition}}</h4>\n" +
    "                <div class=\"m-city-scr-cur\">\n" +
    "                    <div>\n" +
    "                        <a ng-click=\"SelectCityController.selectCity(SelectCityController.currentCity, 'currentCity')\">{{SelectCityController.currentCity}}</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li id=\"HISTORY\" ng-if=\"SelectCityController.historySelectedList && !search\">\n" +
    "                <h4 class=\"u-city-sct-hty-hd\">{{SelectCityController.historyOptions}}</h4>\n" +
    "                <div class=\"m-city-scr-hty\">\n" +
    "                    <div ng-repeat=\"item in SelectCityController.historySelectedList\">\n" +
    "                        <a ng-click=\"SelectCityController.selectCity(item)\" ng-if=\"SelectCityController.type === 'train'\">{{item.cityname}}</a>\n" +
    "                        <a ng-click=\"SelectCityController.selectCity(item)\" ng-if=\"SelectCityController.type === 'flight'\">{{item.name}}</a>\n" +
    "                        <a ng-click=\"SelectCityController.selectCity(item)\" ng-if=\"SelectCityController.type === 'visa-province'\">{{item.station_name}}</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li id=\"HOT\" ng-if=\"(SelectCityController.type === 'train' || SelectCityController.type === 'flight') && !search\">\n" +
    "                <h4 class=\"u-city-sct-hot-hd\">热门城市</h4>\n" +
    "                <div class=\"m-city-scr-hot\">\n" +
    "                    <div ng-if=\"SelectCityController.type === 'train'\"\n" +
    "                         ng-repeat=\"city in SelectCityController.cityList | filter: {ishot: 'Y'}\">\n" +
    "                        <a ng-click=\"SelectCityController.selectCity(city)\">{{city.cityname}}</a>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"SelectCityController.type === 'flight'\"\n" +
    "                         ng-repeat=\"city in SelectCityController.hotCitys\">\n" +
    "                        <a ng-click=\"SelectCityController.selectCity(city)\">{{city.name}}</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li id=\"{{letter}}\" ng-repeat=\"letter in SelectCityController.letterList | searchLetterFilter: search\" >\n" +
    "                <h4>{{letter}}</h4>\n" +
    "                <ul class=\"m-city-list\">\n" +
    "                    <li ng-if=\"SelectCityController.type === 'train'\"\n" +
    "                        ng-repeat=\"city in SelectCityController.cityList | filter: {firstletter: letter}\"\n" +
    "                        ng-click=\"SelectCityController.selectCity(city)\">\n" +
    "                        {{city.cityname}}\n" +
    "                    </li>\n" +
    "                    <li ng-if=\"SelectCityController.type === 'flight'\"\n" +
    "                        ng-repeat=\"city in SelectCityController.cityList | filter:  {firstLetter: letter, pinYin: search} \"\n" +
    "                        ng-click=\"SelectCityController.selectCity(city)\">\n" +
    "                        {{city.name}}\n" +
    "                    </li>\n" +
    "                    <li ng-if=\"SelectCityController.type === 'visa-province'\"\n" +
    "                        ng-repeat=\"province in SelectCityController.provinceList | searchCityListFilter: search : letter\"\n" +
    "                        ng-click=\"SelectCityController.selectCity(province)\">\n" +
    "                        {{province.station_name}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <ul class=\"g-letter-list\">\n" +
    "        <li data-name=\"{{anchor}}\"\n" +
    "            ng-if=\"SelectCityController.hasOtherAnchor\"\n" +
    "            ng-repeat=\"anchor in SelectCityController.anchorWord track by $index\">\n" +
    "            <a ng-if=\"anchor === 'CURRENT'\">当前</a>\n" +
    "            <a ng-if=\"anchor === 'HISTORY'\">历史</a>\n" +
    "            <a ng-if=\"anchor === 'HOT'\">热门</a>\n" +
    "            <a ng-if=\"$index > 2\">{{anchor}}</a>\n" +
    "        </li>\n" +
    "        <li data-name=\"{{anchor}}\"\n" +
    "            ng-if=\"!SelectCityController.hasOtherAnchor\"\n" +
    "            ng-repeat=\"anchor in SelectCityController.anchorWord\">\n" +
    "            <a>{{anchor}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);
