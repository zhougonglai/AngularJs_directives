// Generated by CoffeeScript 1.9.2
(function() {
  myAppDirectives.directive('tabset', [
    '$log', function($log) {
      return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<article class="g-tabset-container" ng-transclude>\n\n</article>',
        scope: {},
        link: function(scope, element, attrs) {}
      };
    }
  ]).directive('tab', [
    '$log', function($log) {
      return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<section class="g-tab-container">\n	<h4 class="g-tab-title">{{heading}}</h4>\n	<div ng-transclude></div>\n</section>',
        scope: {
          heading: '@'
        },
        link: function(scope, element, attrs) {}
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=directive.js.map
