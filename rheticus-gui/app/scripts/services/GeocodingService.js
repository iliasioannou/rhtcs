'use strict';

/**
 * @ngdoc function
 * @name rheticus.service:GeocodingService
 * @description
 * # GeocodingService
 * Geocoding Service for rheticus project
 */
angular.module('rheticus')
  .service('GeocodingService',['$http','configuration',function($http,configuration){
    /**
		 * Parameters:
		 * location - {String}
		 * callback - {Function}
     *
		 * Returns:
		 * Array<{Object}> - Result list
		 */
    this.geocode = function(location,callback){
      if (!((callback!==undefined) && (typeof callback==="function"))){
        return;
      }
      try {
        if (location.length>2){
          var sizeLocation=location.length;
          location = location.replace('/[^a-zA-Z0-9]/g','+');
          var url = configuration.geocoder.url+location+configuration.geocoder.params;
          $http.get(url)
            .success(function (response) {
							callback(response,sizeLocation);
            })
            .error(function (response) { // jshint ignore:line
              //HTTP STATUS != 200
              callback(null);
            });
        }
			} catch (e) {
				console.log("[GeocodingService :: geocode] EXCEPTION : '"+e);
        callback(null);
			} finally {
        //do nothing
			}
    };
    /**
		 * Parameters:
		 * coord - {Object}
		 * callback - {Function}
     *
		 * Returns:
		 * {String} - Address Message
		 */
    this.reverse = function(coord,callback){
      if (!((callback!==undefined) && (typeof callback==="function"))){
        return;
      }
      try {
        var url = configuration.geocoder.urlReverse+'lat='+coord.lat+'&lon='+coord.lon+configuration.geocoder.paramsReverse;
        $http.get(url)
          .success(function (response) {
            var result = "";
            var location = response.address.city || response.address.town || response.address.village || "";
            result = location+", "+response.address.state+', '+response.address.country;
            callback(result);
          })
          .error(function (response) { // jshint ignore:line
            //HTTP STATUS != 200
            callback("");
          });
			} catch (e) {
				console.log("[GeocodingService :: reverse] EXCEPTION : '"+e);
        callback("");
			} finally {
        //do nothing
			}
		};

  }]);
