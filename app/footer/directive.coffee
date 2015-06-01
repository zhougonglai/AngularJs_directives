myAppDirectives.directive('foot', ['$log','dataCache','$http', ($log, dataCache, $http)->
    {
        restrict: 'EA'
        replace: true
        transclude: true
        templateUrl: './templates/directive/footer.tpl.html'
        scope: {
            config: '='
        }
        link: (scope, element, attrs) ->

            config = scope.config
            url = config.url
            scope.btnList = null
            scope.btnNum = 0
            scope.active = 0
            scope.isMaskShow = false
            scope.contentType = ''
            scope.conditionTags = []
            scope.contentList = []
            contentObjList = []
            guid = ''
            exportData = null

            promise = $http({
                method: 'POST'
                url: url
            })

            promise.success((data, status, headers)->
                scope.btnList = data
                scope.btnNum = scope.btnList.length
                factoryData()
                return
            )
            promise.error((err) ->
                alert('请求数据出错')
                return
            )

            factoryData = ->
                for btnObj, i in scope.btnList
                    btnObj.active = i
                    btnObj.guid = Mock.Random.guid() ? new Date().getTime()
                    if btnObj.type is 'double'
                        for leftItemObj, j in btnObj.content.list
                            leftItemObj.guid = Mock.Random.guid() ? new Date().getTime()
                            leftItemObj.hasCondition = false
                            if angular.isArray leftItemObj.condition
                                for condition, k in leftItemObj.condition
                                    condition.active = k
                return


            scope.btnClickEventHandler = (btnObj)->
                scope.contentType = btnObj.type
                guid = btnObj.guid
                switch scope.contentType
                    when 'single'
                        scope.singleItemActive = dataCache.get('singleItemActive' + guid) or 0
                        scope.contents = btnObj.content
                    when 'double'
                        doubleItem = dataCache.get('doubleItem' + guid)
                        if doubleItem?
                            scope.doubleItemActive = doubleItem.doubleLeftItem.active
                            scope.conditionItemActive = doubleItem.conditionItemActive
                        else
                            scope.doubleItemActive = 0
                            scope.conditionItemActive = 0
                        scope.contents = btnObj.content.list
                    else
                        break;
                for contentObj, i in scope.contents
                    contentObj.active = i

                if scope.active is btnObj.active
                    scope.isMaskShow = not scope.isMaskShow
                else
                    scope.isMaskShow = true
                scope.active = btnObj.active
                return

            scope.maskClickEventHandler = ->
                hideContent()
                return

            scope.singleTypeClickEventHandler = (contentObj, e)->
                e.stopPropagation()
                scope.singleItemActive = contentObj.active
                dataCache.put('singleItemActive' + guid, contentObj.active)
                emitData(contentObj)
                return

            scope.doubleTypeLeftListClickEventHandler = (contentObj, e)->
                e.stopPropagation()
                scope.doubleItemActive = contentObj.active
                dataCache.put('doubleLeftItem' + contentObj.guid, contentObj)
                scope.conditionItemActive = dataCache.get('conditionItemActive' + contentObj.guid) or 0
                return

            scope.doubleTypeRightListClickEventHandler = (contentObj, condition, e) ->
                e.stopPropagation()
                scope.conditionItemActive = condition.active
                dataCache.put('conditionItemActive' + contentObj.guid, condition.active)
                contentObjList.push(contentObj)
                dataCache.put('doubleItem' + guid, {
                    doubleLeftItem: contentObj
                    conditionItemActive: condition.active
                })

                for elem, i in contentObj.condition
                    if elem.code isnt ''
                        contentObj.conditionCode = elem.code.slice(0, elem.code.indexOf('='))
                condition.parent = contentObj
                setConditionTag(contentObj, condition)
                return

            setConditionTag = (contentObj, condition)->
                codeList = []
                if scope.conditionTags.length > 0
                    conditionIndex = scope.conditionTags.indexOf(condition)
                    if conditionIndex isnt -1
                        return
                    else
                        for elem, i in scope.conditionTags
                            code = elem.code.slice(0, elem.code.indexOf('='))
                            codeList.push(code)

                        if condition.code isnt ''
                            conditionCode = condition.code.slice(0, condition.code.indexOf('='))
                            codeIndex = codeList.indexOf(conditionCode)
                            if  codeIndex is -1
                                scope.conditionTags.push(condition)
                            else
                                scope.conditionTags[codeIndex] = condition
                        else
                            conditionCode = contentObj.conditionCode
                            index = codeList.indexOf(conditionCode)
                            scope.conditionTags.splice(index, 1)
                            contentObj.hasCondition = false;

                else
                    if condition.code isnt ''
                        scope.conditionTags.push(condition)
                    else
                        return

                setBadge()

                exportData = {
                    leftItem: contentObj
                    rightItem: scope.conditionTags
                }
                return

            setBadge = ->
                for condition, i in scope.conditionTags
                    contentObj = condition.parent
                    contentObj.hasCondition = true
                return

            scope.emptyHandler = (e)->
                e.stopPropagation()
                scope.conditionTags.length = 0
                scope.conditionItemActive = 0
                dataCache.remove('doubleItem' + guid)
                for contentObj, i in contentObjList
                    dataCache.put('conditionItemActive' + contentObj.guid, 0)
                    contentObj.hasCondition = false
                return

            scope.removeConditionTagHandler = (condition, e) ->
                e.stopPropagation()
                conditionIndex = scope.conditionTags.indexOf(condition)
                scope.conditionTags.splice(conditionIndex, 1)
                contentObj = condition.parent
                dataCache.put('conditionItemActive' + contentObj.guid, 0)
                contentObj.hasCondition = false
                scope.conditionItemActive = 0
                condition.parent = null;
                return

            scope.stopPropagation = (e)->
                e.stopPropagation()
                return
            scope.cancelHandler = ->
                hideContent()
                return
            hideContent = ->
                scope.isMaskShow = false
                return

            scope.confirmHandler = ->
                emitData(exportData)
                hideContent()
                return

            emitData = (data)->
                scope.$emit('selectCondition', data)
                return
            return
    }
])