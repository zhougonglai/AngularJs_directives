/**
 * Created by dulin on 2015/4/17.
 */
myAppServices.factory('ngInfo', ['Ajax', function(Ajax) {

    var ngVersionUrl = './jsonData/ngVersion.json';

    return {
        getNgVersion: function() {
            return Ajax.post({
                url: ngVersionUrl
            });
        }
    }
}]);

myAppServices.factory('dataManager', ['$log', function($log) {
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
                return dataCache[dataName] || {};
            }
        },
        removeData: function(dataName) {
            if(dataCache[dataName]) {
                dataCache[dataName] = null;
            }
        }
    }
}]);

myAppServices.factory('Ajax', ['$log', '$q', '$http', function($log, $q, $http) {
    return {
        post: function(options) {
            var deferred = $q.defer();
            var url = options.url,
                data = options.data;
            $http.post(url, data).success(function(data, status, headers) {
                if(data) {
                    deferred.resolve({
                        data: data,
                        status: status,
                        headers: headers
                    });
                }

            }).error(function(data, status, headers) {
                deferred.reject(data);
            });
            return deferred.promise;
        },

        get: function(options) {
            var deferred = $q.defer();
            var url = options.url;
            $http.get(url).success(function(data, status, headers) {
                if(data) {
                    deferred.resolve({
                        data: data,
                        status: status,
                        headers: headers
                    });
                }
            }).error(function(data, status, headers) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}]);

