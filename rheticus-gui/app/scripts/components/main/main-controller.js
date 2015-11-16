'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('MainCtrl',['$rootScope','$scope','$http','olData','configuration',function ($rootScope,$scope,$http,olData,configuration) {
		angular.extend($scope,{ //scope variables
			//basemap list
			"baselayers" : configuration.maps.baselayers,
			//barritteri datasets
			"overlays" : [
				configuration.maps.overlays.barritteri.heatmap,
				configuration.maps.overlays.barritteri.view
			],
			"psQueryLayer": configuration.maps.overlays.barritteri.query,
			//from root scope
			"center": $rootScope.center,
			//OpenLayers Default Events
			"olDefaults" : {
				"events" : { 
					"map" : ["moveend", "click"],
					"layers" : ["click"]
				},
				"interactions" : {
					"mouseWheelZoom": true
				}
			},
			//Openlayers controls
			"controls" : [
				{"name" : 'zoom' , "active" : true},
				{"name" : 'rotate' , "active" : true},
				{"name" : 'zoomtoextent' , "active" : false},
				{"name" : 'zoomslider' , "active" : true},
				{"name":  'scaleline' , "active" : true},
				{"name" : 'attribution' , "active" : false},
				{"name" : 'fullscreen' , "active" : true}/*,
				{"name" : 'mousePosition' , active:true},
				{"name" : 'layerSwitcher' , active:true}*/
			],
			//Openlayers view
			"view" : {},
			//OpenLayers Sentinel Dataset query
			//sentinel: configuration.maps.overlays.sentinel,
			//OpenLayers Marker for PS query
			marker: {}
		});

		/**
		 * datasets watcher for adjusting CQL_FILTER view source parameter
		 */
		$scope.$watch("datasets", function (datasets) {
			var selected = [];
			for (var key in datasets) {
				if (datasets[key].selected){
					selected.push("dataset_id='" + datasets[key].name + "'");
				}
			}
			var cql = selected.join(' OR ');
			if (cql) {
				cql = "("+cql+") AND ";
				cql += "(abs_4(average_speed)>="+$scope.speedModel.split(";")[0]+" AND abs_4(average_speed)<="+$scope.speedModel.split(";")[1]+")";
				$scope.overlays[1].source.params.CQL_FILTER = cql;
			} else {
				delete $scope.overlays[1].source.params.CQL_FILTER;
			}
		}, true);

		/**
		 * speedModel watcher for adjusting CQL_FILTER view source parameter
		 */
		$scope.$watch("speedModel", function (speedModel) {
			//console.log("watcher: "+speedModel);
			var cql = $scope.overlays[1].source.params.CQL_FILTER;
			if (cql) {
				cql = cql.split("(abs_4(average_speed)>=")[0];
				cql += "(abs_4(average_speed)>="+speedModel.split(";")[0]+" AND abs_4(average_speed)<="+speedModel.split(";")[1]+")";
				$scope.overlays[1].source.params.CQL_FILTER = cql;
			}
		});

		olData.getMap().then(function (map) {
			var that = $scope;
			map.on("singleclick", function (evt) {
				$scope.marker = {};
				if ($scope.shouldShowDetails()){ //proceed with getFeatureInfo request
					var viewResolution = map.getView().getResolution();
					var wms = new ol.source.TileWMS($scope.psQueryLayer.source);
					var url = wms.getGetFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:3857",{
						"INFO_FORMAT" : "application/json",
						"FEATURE_COUNT" : 20,
						"CQL_FILTER" : $scope.overlays[1].source.params.CQL_FILTER
					});
					$http.get(url).success(function (response) {
						that.psTrendsData = {
							"point" : ol.proj.toLonLat(evt.coordinate, "EPSG:3857"),
							"features" : (response.features && (response.features.length>0)) ? response.features : null
						};
					});
				} else {
					console.log("getFeatureInfo request disabled!");
				}
/*
				var wmsSentinel = new ol.source.TileWMS($scope.sentinel.view.source);
				var urlSentinel = wmsSentinel.getGetFeatureInfoUrl(
					evt.coordinate, viewResolution, 'EPSG:3857', {
					INFO_FORMAT: 'application/json',
					FEATURE_COUNT: 1000
				});
				//GET DATASETS AND RELATIVE SENTINEL1 FEATURES
				var datasetList = [];
				$http.get(urlSentinel).success(function (response) {
					if (response.features && (response.features.length > 0)) {
						for (var i = 0; i < response.features.length; i++) {
							if (response.features[i].properties){

								for (var key in response.features[i].properties) {
									
									if (getIndexByAttributeValue(datasetList,"id",response.features[i].properties.datasetId)==-1){
										datasetList.push({
											"id"	: response.features[i].properties.datasetId
											"bbox"	: {
												"left"	: response.features[i].geometry.coordinates
												"bottom": 
												"right"	:
												"top"	:
											}
											response.features[i].properties.datasetId
										});
									} else {
										//add 
									}
									
									//console.log(response.features[i].properties[key]);
								}
							
							}
						}
					} else {
						console.log("no sentinel data features for selected point!");
					}
				});
*/
		});
	});
}]);