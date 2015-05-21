// Generated by CoffeeScript 1.9.2
(function() {
  myAppDirectives.directive('footer', [
    '$log', 'dataCache', '$http', function($log, dataCache, $http) {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: './templates/directive/footer.tpl.html',
        scope: {
          config: '='
        },
        link: function(scope, element, attrs) {
          var config, contentObjList, emitData, exportData, factoryData, guid, hideContent, promise, setBadge, setConditionTag, url;
          config = scope.config;
          url = config.url;
          scope.btnList = null;
          scope.btnNum = 0;
          scope.active = 0;
          scope.isMaskShow = false;
          scope.contentType = '';
          scope.conditionTags = [];
          scope.contentList = [];
          contentObjList = [];
          guid = '';
          exportData = null;
          promise = $http({
            method: 'POST',
            url: url
          });
          promise.success(function(data, status, headers) {
            scope.btnList = data;
            scope.btnNum = scope.btnList.length;
            factoryData();
          });
          promise.error(function(err) {
            alert('请求数据出错');
          });
          factoryData = function() {
            var btnObj, condition, i, j, k, l, leftItemObj, len, len1, len2, m, n, ref, ref1, ref2, ref3, ref4;
            ref = scope.btnList;
            for (i = l = 0, len = ref.length; l < len; i = ++l) {
              btnObj = ref[i];
              btnObj.active = i;
              btnObj.guid = (ref1 = Mock.Random.guid()) != null ? ref1 : new Date().getTime();
              if (btnObj.type === 'double') {
                ref2 = btnObj.content.list;
                for (j = m = 0, len1 = ref2.length; m < len1; j = ++m) {
                  leftItemObj = ref2[j];
                  leftItemObj.guid = (ref3 = Mock.Random.guid()) != null ? ref3 : new Date().getTime();
                  leftItemObj.hasCondition = false;
                  if (angular.isArray(leftItemObj.condition)) {
                    ref4 = leftItemObj.condition;
                    for (k = n = 0, len2 = ref4.length; n < len2; k = ++n) {
                      condition = ref4[k];
                      condition.active = k;
                    }
                  }
                }
              }
            }
          };
          scope.btnClickEventHandler = function(btnObj) {
            var contentObj, doubleItem, i, l, len, ref;
            scope.contentType = btnObj.type;
            guid = btnObj.guid;
            switch (scope.contentType) {
              case 'single':
                scope.singleItemActive = dataCache.get('singleItemActive' + guid) || 0;
                scope.contents = btnObj.content;
                break;
              case 'double':
                doubleItem = dataCache.get('doubleItem' + guid);
                if (doubleItem != null) {
                  scope.doubleItemActive = doubleItem.doubleLeftItem.active;
                  scope.conditionItemActive = doubleItem.conditionItemActive;
                } else {
                  scope.doubleItemActive = 0;
                  scope.conditionItemActive = 0;
                }
                scope.contents = btnObj.content.list;
                break;
              default:
                break;
            }
            ref = scope.contents;
            for (i = l = 0, len = ref.length; l < len; i = ++l) {
              contentObj = ref[i];
              contentObj.active = i;
            }
            if (scope.active === btnObj.active) {
              scope.isMaskShow = !scope.isMaskShow;
            } else {
              scope.isMaskShow = true;
            }
            scope.active = btnObj.active;
          };
          scope.maskClickEventHandler = function() {
            hideContent();
          };
          scope.singleTypeClickEventHandler = function(contentObj, e) {
            e.stopPropagation();
            scope.singleItemActive = contentObj.active;
            dataCache.put('singleItemActive' + guid, contentObj.active);
            emitData(contentObj);
          };
          scope.doubleTypeLeftListClickEventHandler = function(contentObj, e) {
            e.stopPropagation();
            scope.doubleItemActive = contentObj.active;
            dataCache.put('doubleLeftItem' + contentObj.guid, contentObj);
            scope.conditionItemActive = dataCache.get('conditionItemActive' + contentObj.guid) || 0;
          };
          scope.doubleTypeRightListClickEventHandler = function(contentObj, condition, e) {
            var elem, i, l, len, ref;
            e.stopPropagation();
            scope.conditionItemActive = condition.active;
            dataCache.put('conditionItemActive' + contentObj.guid, condition.active);
            contentObjList.push(contentObj);
            dataCache.put('doubleItem' + guid, {
              doubleLeftItem: contentObj,
              conditionItemActive: condition.active
            });
            ref = contentObj.condition;
            for (i = l = 0, len = ref.length; l < len; i = ++l) {
              elem = ref[i];
              if (elem.code !== '') {
                contentObj.conditionCode = elem.code.slice(0, elem.code.indexOf('='));
              }
            }
            condition.parent = contentObj;
            setConditionTag(contentObj, condition);
          };
          setConditionTag = function(contentObj, condition) {
            var code, codeIndex, codeList, conditionCode, conditionIndex, elem, i, index, l, len, ref;
            codeList = [];
            if (scope.conditionTags.length > 0) {
              conditionIndex = scope.conditionTags.indexOf(condition);
              if (conditionIndex !== -1) {
                return;
              } else {
                ref = scope.conditionTags;
                for (i = l = 0, len = ref.length; l < len; i = ++l) {
                  elem = ref[i];
                  code = elem.code.slice(0, elem.code.indexOf('='));
                  codeList.push(code);
                }
                if (condition.code !== '') {
                  conditionCode = condition.code.slice(0, condition.code.indexOf('='));
                  codeIndex = codeList.indexOf(conditionCode);
                  if (codeIndex === -1) {
                    scope.conditionTags.push(condition);
                  } else {
                    scope.conditionTags[codeIndex] = condition;
                  }
                } else {
                  conditionCode = contentObj.conditionCode;
                  index = codeList.indexOf(conditionCode);
                  scope.conditionTags.splice(index, 1);
                  contentObj.hasCondition = false;
                }
              }
            } else {
              if (condition.code !== '') {
                scope.conditionTags.push(condition);
              } else {
                return;
              }
            }
            setBadge();
            exportData = {
              leftItem: contentObj,
              rightItem: scope.conditionTags
            };
          };
          setBadge = function() {
            var condition, contentObj, i, l, len, ref;
            ref = scope.conditionTags;
            for (i = l = 0, len = ref.length; l < len; i = ++l) {
              condition = ref[i];
              contentObj = condition.parent;
              contentObj.hasCondition = true;
            }
          };
          scope.emptyHandler = function(e) {
            var contentObj, i, l, len;
            e.stopPropagation();
            scope.conditionTags.length = 0;
            scope.conditionItemActive = 0;
            dataCache.remove('doubleItem' + guid);
            for (i = l = 0, len = contentObjList.length; l < len; i = ++l) {
              contentObj = contentObjList[i];
              dataCache.put('conditionItemActive' + contentObj.guid, 0);
              contentObj.hasCondition = false;
            }
          };
          scope.removeConditionTagHandler = function(condition, e) {
            var conditionIndex, contentObj;
            e.stopPropagation();
            conditionIndex = scope.conditionTags.indexOf(condition);
            scope.conditionTags.splice(conditionIndex, 1);
            contentObj = condition.parent;
            dataCache.put('conditionItemActive' + contentObj.guid, 0);
            contentObj.hasCondition = false;
            scope.conditionItemActive = 0;
            condition.parent = null;
          };
          scope.stopPropagation = function(e) {
            e.stopPropagation();
          };
          scope.cancelHandler = function() {
            hideContent();
          };
          hideContent = function() {
            scope.isMaskShow = false;
          };
          scope.confirmHandler = function() {
            emitData(exportData);
            hideContent();
          };
          emitData = function(data) {
            scope.$emit('selectCondition', data);
          };
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=directive.js.map
