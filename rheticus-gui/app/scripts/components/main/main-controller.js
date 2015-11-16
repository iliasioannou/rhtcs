'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('MainCtrl',['$rootScope','$scope','$http','olData','configuration',
	function ($rootScope,$scope,$http,olData,configuration) {
		angular.extend($scope, {
			//scope variables
			//legends
			legendUrl: configuration.legends.density.url,
			legendTitle: configuration.legends.density.title,
			legendUom: configuration.legends.density.uom,
			//basemap list
			baselayers: configuration.maps.baselayers,
			//barritteri datasets
			overlays: configuration.maps.overlays.barritteri,
			//from root scope
			center: $rootScope.center,
			//OpenLayers Default Events
			olDefaults : {
				events : { 
					map : ['moveend', 'click'],
					layers : ['click']
				},
				interactions : {
					mouseWheelZoom: true
				},
				controls : {
					zoom : true,
					rotate : true,
					zoomtoextent : false,
					zoomslider : true,
					scaleline : true,
					attribution : false
				}
			},
			//Openlayers controls
			controls : [
				{name:'zoom',active:true},
				{name:'rotate',active:true},
				{name:'zoomtoextent',active:false},
				{name:'zoomslider',active:true},
				{name:'scaleline',active:true},
				{name:'attribution',active:false},
				{name:'fullscreen',active:true}
			],
			//Openlayers view -- TODO: Check if it's needed!
			view: {},
			//OpenLayers TileWMS for heatmap/ps exchange
			wms: {},
			//OpenLayers Marker for PS query
			marker: {},
			//OpenLayers Sentinel Dataset query
			//sentinel: configuration.maps.overlays.sentinel,
			// PS Line chart options
			graph_options: {
				chart: {
					type: 'lineChart',
					width: 650,
					margin: {
						top: 20,
						right: 20,
						bottom: 40,
						left: 55
					},
					x: function (d) {
						return d.x;
					},
					y: function (d) {
						return d.y;
					},
					useInteractiveGuideline: true,             
					xAxis: {
						axisLabel: 'Data',
						tickFormat: function (d) {
							return d3.time.format('%d/%m/%Y')(new Date(d));
						}
					},
					yAxis: {
						axisLabel: 'Spostamento (mm)',
						tickFormat: function (d) {
							return d3.format('.02f')(d);
						},
						axisLabelDistance: -10
					}
				},
				title: {
					enable: true,
					html: ''
				},
				subtitle: {
					enable: false            
				},
				caption: {
					enable: false
				}
			},
			// PS Line chart data
			data: [],
			// getFeatureInfoResponse
			getFeatureInfoResponse: [],
			//dialog box closure
			show_trends: false
		});

		$scope.$watch("center.zoom", function (zoom) {
			console.log("center.zoom: "+zoom);
			//WMS visibility heatmap/ps
			$scope.wms = $scope.shouldShowDetails() ? $scope.overlays.view : $scope.overlays.heatmap;
			console.log($scope.wms.source);
			//legend visibility heatmap/ps
			$scope.legendUrl = configuration.legends[$scope.shouldShowDetails() ? 'ps' : 'density'].url;
			$scope.legendTitle = configuration.legends[$scope.shouldShowDetails() ? 'ps' : 'density'].title;
			$scope.legendUom = configuration.legends[$scope.shouldShowDetails() ? 'ps' : 'density'].uom;
		});

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
				$scope.overlays.view.source.params.CQL_FILTER = cql;
			} else {
				delete $scope.overlays.view.source.params.CQL_FILTER;
			}
		}, true);

		$scope.$watch("speedModel", function (speedModel) {
			console.log("watcher: "+speedModel);
			var cql = $scope.overlays.view.source.params.CQL_FILTER;
			if (cql) {
				cql = cql.split("(abs_4(average_speed)>=")[0];
				cql += "(abs_4(average_speed)>="+speedModel.split(";")[0]+" AND abs_4(average_speed)<="+speedModel.split(";")[1]+")";
				$scope.overlays.view.source.params.CQL_FILTER = cql;
			}
		});

		var that = $scope;
		olData.getMap().then(function (map) {
			map.on('singleclick', function (evt) {
				$scope.marker = {};
				if ($scope.wms.source==$scope.overlays.view.source){
					//proceed with getFeatureInfo request
					var viewResolution = map.getView().getResolution();
					var wmsSource = new ol.source.TileWMS($scope.overlays.query.source);
					var url = wmsSource.getGetFeatureInfoUrl(
						evt.coordinate, viewResolution, 'EPSG:3857', 
						{
							INFO_FORMAT: 'application/json',
							FEATURE_COUNT: 20,
							CQL_FILTER: $scope.overlays.view.source.params.CQL_FILTER
						}
					);

					$http.get(url).success(function (response) {
						var point = ol.proj.toLonLat(evt.coordinate, 'EPSG:3857');

						//TODO: check if this snippet is still needed!
						if ($scope.autocenter) {
							$scope.center.lat = point[1];
							$scope.center.lon = point[0];
							if ($scope.autozoom) {
								$scope.center.zoom = 20;
							}
						}
						//end snippet

						//For IE :: creating "startsWith" method for String Class
						if (typeof String.prototype.startsWith != 'function') {
							String.prototype.startsWith = function (str) {
								return this.slice(0, str.length) == str;
							};
						}
						if (typeof String.prototype.splice != 'function') {
							String.prototype.splice = function (idx, rem, s) {
								return this.slice(0, idx) + s + this.slice(idx + Math.abs(rem));
							};
						}

						var chartData = [];
						var infoResponse = [];
						//Data is represented as an array of {x,y} pairs.                     
						that.show_trends= true;
						if (response.features && (response.features.length > 0)) {
							
							$scope.graph_options.title.html = "<b>Trend spostamenti PS ID<b><br>[LAT: "+Math.round(point[1]*10000)/10000+"; LON: "+Math.round(point[0]*10000)/10000+"]";

							var autoColor = {
								colors: d3.scale.category20(),
								index: 0,
								getColor: function () {
									return this.colors(this.index++)
								}
							};

							for (var i = 0; i < response.features.length; i++) {
								var featureData = [];
								var featureInfo = {};
								for (var key in response.features[i].properties) {
									if (key.startsWith("dl")) {
										var FeatureDate = new Date(key.replace("dl", "").splice(6, 0, "/").splice(4, 0, "/"));
										if (FeatureDate instanceof Date) {
											featureData.push({
												x: FeatureDate,
												y: response.features[i].properties[key]
											});
										}
									}
									eval("featureInfo." + key + "=response.features[\"" + i + "\"].properties." + key + ";");
								}
								chartData.push({
									values: featureData, //values - represents the array of {x,y} data points
									key: response.features[i].properties["code"], //key  - the name of the series (PS CODE)
									color: autoColor.getColor() //'#ff7f0e' //color - optional: choose your own line color.
								});

								infoResponse.push(featureInfo);
								$scope.marker = {
									lat: point[1],
									lon: point[0],
									label: response.features[0].properties.code
								};

							}
						} else {
							$scope.show_trends = false;
						}

						//Line chart data should be sent as an array of series objects.                
						$scope.data = chartData;
						$scope.getFeatureInfoResponse = infoResponse;

						if(!that.$$phase) {
							that.$apply();
						}
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