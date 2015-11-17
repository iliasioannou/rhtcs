'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('MainCtrl',['$rootScope','$scope','$http','olData','configuration', function ($rootScope,$scope,$http,olData,configuration) {
		angular.extend($scope,{ // scope variables
			"baselayers" : configuration.layers.baselayers, // basemap list
			"overlays" : [ // barritteri overlay datasets
				configuration.layers.overlays.barritteri.heatmap,
				configuration.layers.overlays.barritteri.view
			],
			"psQueryLayer" : configuration.layers.overlays.barritteri.query, // PS query overlay layer
			"sentinelQueryLayer" : configuration.layers.overlays.sentinel.query, // Sentinel query overlay layer
			"center" : $rootScope.center, // OpenLayers Center zoom
			"olDefaults" : { // OpenLayers Default Events
				"events" : { 
					"map" : ["moveend", "click"],
					"layers" : ["click"]
				},
				"interactions" : {
					"mouseWheelZoom" : true
				}
			},
			"controls" : [ // Openlayers controls
				{"name" : 'zoom', "active" : true},
				{"name" : 'rotate', "active" : true},
				{"name" : 'zoomtoextent', "active" : false},
				{"name" : 'zoomslider', "active" : true},
				{"name" : 'scaleline', "active" : true},
				{"name" : 'attribution', "active" : false},
				{"name" : 'fullscreen', "active" : true}
			],
			"view" : {}, // Openlayers view
			"sentinel" : {}, // OpenLayers Sentinel Dataset query overlay layer
			"marker" : {} // OpenLayers Marker layer for PS query
		});

		angular.extend($scope,{ // scope functions
			"getFeatureInfo" : function(map,coordinate,queryLayer,featureCount,cqlFilter,entity,callback){
				var viewResolution = map.getView().getResolution();
				var wms = new ol.source.TileWMS(queryLayer);
				var url = wms.getGetFeatureInfoUrl(coordinate,viewResolution,configuration.map.crs,{
					"INFO_FORMAT" : "application/json",
					"FEATURE_COUNT" : featureCount,
					"CQL_FILTER" : cqlFilter
				});
				var that = $scope;
				$http.get(url).success(function (response) {
					var obj = {
						"point" : ol.proj.toLonLat(coordinate,configuration.map.crs),
						"features" : (response.features && (response.features.length>0)) ? response.features : null
					};
					eval("that."+entity+" = obj;");
					if (callback!=null){
						callback();
					}
				});
			}
		});

		/**
		 * datasets watcher for adjusting CQL_FILTER view source parameter
		 */
		$rootScope.$watch("datasets", function (datasets) {
			//console.log("main controller - datasets watcher : "+datasets);
			var selected = [];
			for (var key in datasets) {
				if (datasets[key].selected){
					selected.push("dataset_id='" + datasets[key].name + "'");
				}
			}
			var cql = selected.join(' OR ');
			if (cql) {
				cql = "("+cql+") AND ";
				cql += "(abs_4(average_speed)>="+$rootScope.speedModel.split(";")[0]+" AND abs_4(average_speed)<="+$rootScope.speedModel.split(";")[1]+")";
				$scope.overlays[1].source.params.CQL_FILTER = cql;
			} else {
				delete $scope.overlays[1].source.params.CQL_FILTER;
			}
		}, true);

		/**
		 * speedModel watcher for adjusting CQL_FILTER view source parameter
		 */
		$rootScope.$watch("speedModel", function (speedModel) {
			var cql = $scope.overlays[1].source.params.CQL_FILTER;
			if (cql) {
				cql = cql.split("(abs_4(average_speed)>=")[0];
				cql += "(abs_4(average_speed)>="+speedModel.split(";")[0]+" AND abs_4(average_speed)<="+speedModel.split(";")[1]+")";
				$scope.overlays[1].source.params.CQL_FILTER = cql;
			}
		});

		/**
		 * delete marker when status changes to false
		 */
		$rootScope.$watch("marker", function (marker) {
			if (!marker){
				$scope.marker = {};	
			}
		});

		olData.getMap().then(function (map) {
			//var that = $scope;
			map.on("singleclick", function (evt) {
				var point = ol.proj.toLonLat(evt.coordinate,configuration.map.crs);
				// Marker and PS trends management
				var setMarker = function(){
					$scope.marker = {
						"lat" : point[1],
						"lon" : point[0]
					};
				};
				$scope.marker = {};
				if ($scope.showDetails()){ //proceed with getFeatureInfo request
					$scope.getFeatureInfo(
						map,
						evt.coordinate,
						$scope.psQueryLayer.source,
						20,
						$scope.overlays[1].source.params.CQL_FILTER,
						"ps",
						setMarker
					);
				}
				// Sentinel 1 Datatset and timeline management
				$scope.sentinel = {};
				var startDate = (configuration.timeSlider.domain.start!="") ? configuration.timeSlider.domain.start : "2014-10-01T00:00:00Z"; // if empty string set on 01 Oct 2014
				var endDate = (configuration.timeSlider.domain.end!="") ? configuration.timeSlider.domain.end : d3.time.format("%Y-%m-%dT%H:%M:%SZ")(new Date()); // if empty string set on today's date
				$scope.getFeatureInfo(
					map,
					evt.coordinate,
					$scope.sentinelQueryLayer.source,
					1000,
					"(("+configuration.timeSlider.attributes.CQL_FILTER.startDate+">="+startDate+") AND ("+configuration.timeSlider.attributes.CQL_FILTER.endDate+"<="+endDate+"))",
					"timeline",
					null
				);
			});
		});
	}]);