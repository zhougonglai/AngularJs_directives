myAppDirectives.directive('tabset', ['$log', ($log)->
	{
		restrict: 'EA'
		replace: true
		transclude: true
		template: '''
					<article class="g-tabset-container" ng-transclude>

					</article>
					'''
		scope: {}
		link: (scope, element, attrs) ->
			return
	}
]).directive('tab', ['$log', ($log)->
	{
		restrict: 'EA'
		replace: true
		transclude: true
		template: '''
					<section class="g-tab-container">
						<h4 class="g-tab-title">{{heading}}</h4>
						<div ng-transclude></div>
					</section>
					'''
		scope: {
			heading: '@'
		}
		link: (scope, element, attrs) ->
			return
	}
])