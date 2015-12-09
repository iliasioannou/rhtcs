'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:GeocoderCtrl
 * @description
 * # GeocoderCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('GeocoderCtrl',['$rootScope','$scope','$http','configuration', function ($rootScope,$scope,$http,configuration) {
		//controller variables
		this.geoCtrl= "geocoder";
		
		this.getShow = function(){
			console.log($scope.activeController===this.geoCtrl);
			return $scope.getController(this.geoCtrl);
		};
		this.setShow = function(){
			$scope.setController(this.geoCtrl);
		};
		
		this.results = {};
		this.location = "";
		this.searchLocation = function(){
			if(this.location.length>2){
				this.location = this.location.replace('/[^a-zA-Z0-9]/g','+');
				var that = this;
				$http.get(configuration.geocoder.url+this.location+configuration.geocoder.params)
					.success(function (response) {
						that.results = response;
					});
			} else {
				this.results = {};
			}			
		};
		
		this.getLocation = function(index){			
			var jsonLocation = this.results[index];			
			$rootScope.center.lon = parseFloat(jsonLocation.lon);
            $rootScope.center.lat = parseFloat(jsonLocation.lat);
			this.searching = false;			//hide search after delection
			this.results = {};
			this.location = "";
		};
		
		
	}]);