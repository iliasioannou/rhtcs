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
				//configuration.layers.overlays.ps.heatmap,
				configuration.layers.overlays.ps.view,
				configuration.layers.overlays.iffi.view
			],
			"tipLabel" : 'Base Map',
			"psQueryLayer" : configuration.layers.overlays.ps.query, // PS query overlay layer
			"sentinelQueryLayer" : configuration.layers.overlays.sentinel.query, // Sentinel query overlay layer
			//"sentinelView" : configuration.layers.overlays.sentinel.query, //TODO: To Be Comment ... only for test!
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
				//{"name" : 'zoom', "active" : true}, // ?? ..duplicate in view
				{"name" : 'rotate', "active" : true},
				{"name" : 'zoomtoextent', "active" : false},
				//{"name" : 'zoomslider', "active" : true},
				{"name" : 'scaleline', "active" : true},
				{"name" : 'attribution', "active" : false},
				{"name" : 'fullscreen', "active" : true}
			],
			"view" : {}, // Openlayers view
			"sentinelGeoJson" : {}, // OpenLayers Sentinel Dataset query overlay layer
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
		$rootScope.$watch("aoi", function (area) {
			/*var selected = [];
			for (var key in area) {
				if (area[key].selected){
					selected.push("dataset_id='" + area[key].name + "'");
				}
			}
			var cql = selected.join(' OR ');*/
			var cql = "";
			/*if (cql) {
				cql = "("+cql+") AND ";*/
				cql += "(abs_4(velocity)>="+$rootScope.speedModel.split(";")[0]+" AND abs_4(velocity)<="+$rootScope.speedModel.split(";")[1]+")";
				$scope.overlays[1].source.params.CQL_FILTER = cql;
			/*} else {
				delete $scope.overlays[1].source.params.CQL_FILTER;
			}*/
		}, true);

		/**
		 * speedModel watcher for adjusting CQL_FILTER view source parameter
		 */
		$rootScope.$watch("speedModel", function (speedModel) {
			var cql = $scope.overlays[1].source.params.CQL_FILTER;
			if (cql) {
				cql = cql.split("(abs_4(velocity)>=")[0];
				cql += "(abs_4(velocity)>="+speedModel.split(";")[0]+" AND abs_4(velocity)<="+speedModel.split(";")[1]+")";
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
				$scope.sentinelGeoJson = {};
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
				//STUB - START
				/*var that = $scope;
				$http.get("stub/FeatureCollection.json").success(function (response) {
					that.timeline = {
						"point" : point,
						"features" : (response.features && (response.features.length>0)) ? response.features : null
					};
				});*/
				//STUB - END
			});
		});
	}]);