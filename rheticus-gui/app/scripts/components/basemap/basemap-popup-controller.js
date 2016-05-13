'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:BasemapPopoupCtrl
 * @description
 * # BasemapPopoupCtrl
 * Basemap Popoup Controller for rheticus project
 */
angular.module('rheticus')
	.controller('BasemapPopoupCtrl',['$scope','configuration',function($scope,configuration){
		var self = this;
		angular.extend(self,{
			"view_osm" : false, // overlay visibility
			"view_sbm" : true, // overlay visibility
		});
		angular.extend(self,{

			"changeBaseLayerOSM": function() {
					//console.log("attivo OpenStreetMap");
					self.view_osm=true;
					self.view_sbm=false;
					$scope.getBaselayers()[0].active=true;
					$scope.getBaselayers()[1].active=false;
					$scope.getBaselayers()[2].active=false;
			},
			"changeBaseLayerSBM": function() {
					//console.log("attivo SATELLITE");
					$scope.getActiveBaselayer().active=false;
					self.view_osm=false;
					self.view_sbm=true;
					if($scope.center.zoom>12 ){
						$scope.getBaselayers()[1].active=true;
					}else {
						$scope.getBaselayers()[1].active=false;
						$scope.getBaselayers()[2].active=true;
					}
			}
		});

		//update satellite map when zoom change
		$scope.$watch("center.zoom", function (zoom) {
			//console.log($scope.getActiveBaselayer());
			//console.log(zoom);
			if (zoom>configuration.map.basemap.zoom){
				$scope.getActiveBaselayer().active=false;
				$scope.getBaselayers()[1].active=true;
			} else {
				$scope.getBaselayers()[1].active=false;
				$scope.getBaselayers()[2].active=true;
			}
		});

	}]);
