myAppDirectives.directive('footer', ['$log','dataCache', ($log, dataCache)->
    {
        restrict: 'A'
        replace: true
        transclude: true
        templateUrl: './templates/directive/footer.tpl.html'
        scope: {
            config: '='
        }
        link: (scope, element, attrs) ->

            config = scope.config
            scope.btnList = config.btnList
            scope.btnNum = scope.btnList.length
            scope.active = 0
            scope.isMaskShow = false
            scope.contentType = ''
            guid = ''

            for btnObj, i in scope.btnList
                btnObj.active = i
                btnObj.guid = Mock.Random.guid() ? new Date().getTime()
                if btnObj.type is 'double'
                    for leftItemObj, j in btnObj.content.list
                        leftItemObj.guid = Mock.Random.guid() ? new Date().getTime()
                        if angular.isArray leftItemObj.condition
                            for condition, k in leftItemObj.condition
                                condition.active = k

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
                scope.isMaskShow = false
                return

            scope.singleTypeClickEventHandler = (contentObj, e)->
                e.stopPropagation()
                scope.singleItemActive = contentObj.active
                dataCache.put('singleItemActive' + guid, contentObj.active)
                scope.$emit('singleTypeSelectEvent', contentObj)
                return

            scope.doubleTypeLeftListClickEventHandler = (contentObj, e)->
                e.stopPropagation()
                scope.doubleItemActive = contentObj.active
                dataCache.put('doubleLeftItem' + contentObj.guid, contentObj)
                scope.conditionItemActive = dataCache.get('conditionItemActive' + contentObj.guid) or 0

                scope.$emit('doubleTypeSelectEvent', contentObj)
                return

            scope.doubleTypeRightListClickEventHandler = (contentObj, condition, e) ->
                e.stopPropagation()
                scope.conditionItemActive = condition.active
                dataCache.put('conditionItemActive' + contentObj.guid, condition.active)
                dataCache.put('doubleItem' + guid, {
                    doubleLeftItem: contentObj
                    conditionItemActive: condition.active
                })
                return
            return
    }
])