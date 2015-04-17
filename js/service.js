/**
 * Created by dulin on 2015/4/17.
 */

var serviceModule = angular.module('services', []);

serviceModule.factory('dataManager', ['$log', function($log) {
    var dataCache = {};
    return {
        setData: function(dataName, data) {
            if(angular.isString(dataName) && data) {
                this.removeData(dataName);
                dataCache[dataName] = data;
            }
        },
        getData: function(dataName) {
            if(angular.isString(dataName)) {
                return dataCache[dataName];
            }
        },
        removeData: function(dataName) {
            if(dataCache[dataName]) {
                dataCache[dataName] = null;
            }
        }
    }
}]);

serviceModule.factory('Ajax', ['$log', function($log) {
    return {
        
    }
}]);