// Generated by CoffeeScript 1.9.2
(function() {
  myAppControllers.controller('IController', [
    '$scope', '$log', function($scope, $log) {
      $scope.footerConfig = {
        url: './jsonData/customCondition.json'
      };
      $scope.$on('selectCondition', function(e, data) {
        $log.info(data);
      });
    }
  ]);

}).call(this);

//# sourceMappingURL=controller.js.map
