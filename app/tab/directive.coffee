myAppDirectives.directive('tab', ['$log', ($log)->
    return {
        restrict: 'EA'
        transclude: true
        replace: true
        scope: {
            tabConfig: '='
        }
        template: '''
                    <div class="g-tab-ctn">
                        <div class="g-tab-tt">
                            <div class="m-tab-tt" ng-repeat="tabTitleObj in tabTitleList" style="width: {{100 / tabNum}}%">
                                <button ng-class="{selected: activeTab === tabTitleObj.index}" ng-click="tabTitleClickHandler(tabTitleObj)">
                                    <i>{{tabTitleObj.title}}</i>
                                </button>
                            </div>
                        </div>
                        <div class="g-tab-content-ctn" ng-transclude>

                        </div>
                    </div>
                    '''
        link: (scope, element, attrs)->

            tabConfig = scope.tabConfig
            tabTitleList = tabConfig.titleList
            scope.tabNum = tabTitleList.length
            scope.activeTab = 0
            scope.tabTitleList = []

            for elem, i in tabTitleList
                scope.tabTitleList.push({
                    index: i
                    title: elem
                })

            scope.tabTitleClickHandler = (tabTitleObj)->
                scope.activeTab = tabTitleObj.index
                scope.$emit('tabClickEvent', {
                    index: tabTitleObj.index
                })
                return


            return
    }
])

