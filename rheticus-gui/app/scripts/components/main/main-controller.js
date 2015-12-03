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
				//{"name" : 'zoom', "active" : true}, // TBC ...duplicate in view
				{"name" : 'rotate', "active" : true},
				{"name" : 'zoomtoextent', "active" : false},
				//{"name" : 'zoomslider', "active" : true},
				{"name" : 'scaleline', "active" : true},
				{"name" : 'attribution', "active" : false},
				{"name" : 'fullscreen', "active" : true}
			],
			"view" : {}, // Openlayers view
			"marker" : {} // OpenLayers Marker layer for PS query
		});

		angular.extend($scope,{ // scope functions
			"setMarker" : function(response) { // Marker and PS trends management
				$scope.marker = {
					"lat" : response.point[1],
					"lon" : response.point[0]/*,
					"label" : {
						"message" : "",
						"show" : true,
						"showOnMouseOver" : true
					},
					"style": {
						"image": {
							"icon": {
								"anchor" : [0.5, 1],
								"anchorXUnits" : "fraction",
								"anchorYUnits" : "fraction",
								"opacity" : 0.90,
								"src" : "./images/marker.png"
							}
						}
					}*/
				};
			},
			"getFeatureInfo" : function(map,coordinate,olLayerSource,featureCount,cqlFilter,resultObj,callback){
				var viewResolution = map.getView().getResolution();
				var wms = eval("new ol.source."+olLayerSource.type+"(olLayerSource);");
				var url = wms.getGetFeatureInfoUrl(coordinate,viewResolution,configuration.map.crs,{
					"INFO_FORMAT" : "application/json",
					"FEATURE_COUNT" : featureCount,
					"CQL_FILTER" : cqlFilter
				});	
				if (url) {
					var that = $scope;
					$http.get(url).success(function (response) {
						var obj = {
							"point" : ol.proj.toLonLat(coordinate,configuration.map.crs),
							"features" : (response.features && (response.features.length>0)) ? response.features : null
						};
						if (resultObj!=""){
							eval("that."+resultObj+" = obj;");
						}
						if (callback!=null){
							callback(obj);
						}
					});
				} else {
					console.log("[main-controller :: getFeatureInfo] URL undefined!");
				}
			},
			"setSpeedModelFilter" : function(speedModel){
				if ($rootScope.showDetails()){ //proceed with filtering
					var cql = "(abs_4(velocity)>="+speedModel.split(";")[0]+" AND abs_4(velocity)<="+speedModel.split(";")[1]+")";
					$rootScope.overlays[$rootScope.overlaysHashMap.ps].source.params.CQL_FILTER = cql;
				}
			},
			"getGetFeatureInfoOlLayerSource" : function(l){
				var queryUrl = eval("$rootScope.metadata[$rootScope.overlaysHashMap."+l.id+"].queryUrl;");
				var olLayer = null;
				if (queryUrl=="") {
					olLayer = l;
				} else {
					var queryType = eval("$rootScope.metadata[$scope.overlaysHashMap."+l.id+"].type;");
					switch(queryType) {
						case "ImageWMS":
							var querySourceType = eval("$rootScope.metadata[$rootScope.overlaysHashMap."+l.id+"].type;");
							var queryLayers = eval("$rootScope.metadata[$rootScope.overlaysHashMap."+l.id+"].custom.LAYERS;");
							olLayer = {
								"type" : querySourceType,
								"url" : queryUrl,
								"params" : {
									"LAYERS" : queryLayers
								}
							};
							break;
						case "RheticusApiRest":
						
							break;
						default:
							//do nothing
					}
				}
				return(olLayer);
			}
		});

		/**
		 * Switch PS layer
		 */
		$rootScope.$watch("center.zoom", function () {
			if ($rootScope.showDetails()){
				$scope.setSpeedModelFilter($rootScope.speedModel);
				$rootScope.overlays[$rootScope.overlaysHashMap.ps].source.params.LAYERS = $rootScope.metadata[$scope.overlaysHashMap.ps].custom.detail;
			} else {
				$rootScope.overlays[$rootScope.overlaysHashMap.ps].source.params.CQL_FILTER = null;
				$rootScope.overlays[$rootScope.overlaysHashMap.ps].source.params.LAYERS = $rootScope.metadata[$rootScope.overlaysHashMap.ps].custom.heatmap;
			}
		});
		
		/**
		 * Set new AOI
		 */
		$rootScope.$watch("aoi", function (aoi) {
			//TODO
		});

		/**
		 * speedModel watcher for adjusting CQL_FILTER view source parameter
		 */
		$rootScope.$watch("speedModel", function (speedModel) {
			$scope.setSpeedModelFilter(speedModel);
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
			map.on("singleclick", function (evt) {
				var point = ol.proj.toLonLat(evt.coordinate,configuration.map.crs);
				$rootScope.overlays.map(function(l) {
					if (l.active){
						switch(l.id) {
							case "iffi": //Progetto IFFI
								$scope.getFeatureInfo(
									map,
									evt.coordinate,
									l.source,
									20,
									null,
									"iffi",
									$scope.setMarker
								);
								break;
								
							case "sentinel": // Sentinel 1 Datatset and timeline management
								var startDate = (configuration.timeSlider.domain.start!="") ? configuration.timeSlider.domain.start : "2014-10-01T00:00:00Z"; // if empty string set on 01 Oct 2014
								var endDate = (configuration.timeSlider.domain.end!="") ? configuration.timeSlider.domain.end : d3.time.format("%Y-%m-%dT%H:%M:%SZ")(new Date()); // if empty string set on today's date
								$scope.getFeatureInfo(
									map,
									evt.coordinate,
									$scope.getGetFeatureInfoOlLayerSource(l),
									1000,
									"(("+configuration.timeSlider.attributes.CQL_FILTER.startDate+">="+startDate+") AND ("+configuration.timeSlider.attributes.CQL_FILTER.endDate+"<="+endDate+"))",
									"sentinel",
									$scope.setMarker
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
								break;
								
							case "ps":
								if ($rootScope.showDetails()){ //proceed with getFeatureInfo request
									$scope.getFeatureInfo(
										map,
										evt.coordinate,
										l.source,
										20,
										$scope.overlays[$scope.overlaysHashMap.ps].source.params.CQL_FILTER,
										"ps",
										$scope.setMarker
									);
								} else {
									// do nothing
									console.log("heatmap zoom level ... no features info to display!");
								}
								break;
								
							default:
								//do nothing
						}
						
					}
				});
			});
		});
		
	}]);