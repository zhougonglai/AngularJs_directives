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
                btnObj.guid = Mock.Random.guid()


            scope.btnClickEventHandler = (btnObj)->
                scope.contentType = btnObj.type
                guid = btnObj.guid
                switch scope.contentType
                    when 'single'
                        scope.singleItemActive = dataCache.get('singleItemActive' + guid) or 0
                        scope.contents = btnObj.content
                    when 'double'
                        scope.doubleItemActive = dataCache.get('doubleItemActive' + guid) or 0
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
                return

            scope.doubleTypeLeftListClickEventHandler = (contentObj, e)->
                e.stopPropagation()
                scope.doubleItemActive = contentObj.active
                dataCache.put('doubleItemActive' + guid, contentObj.active)
                return
            return
    }
])