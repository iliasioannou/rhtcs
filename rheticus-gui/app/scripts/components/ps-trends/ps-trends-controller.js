'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:PsTrendsCtrl
 * @description
 * # PsTrendsCtrlf
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('PsTrendsCtrl',['$rootScope','$scope','configuration','$http',function($rootScope,$scope,configuration,$http){

		var self = this; //this controller

		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */
		angular.extend(self,{

			"options" : { // PS Line chart options
				"chart" : {
					"type" : "lineChart",
					"margin": {
						"top": 30,
						"right": 60,
						"bottom": 50,
						"left": 70
					},
					"x" : function (d) {return d.x;},
					"y" : function (d) {return d.y;},
					"showValues" : true,
					"color" : d3.scale.category20().range(), // jshint ignore:line
					"xAxis" : {
						"axisLabel" : "Date",
						"tickFormat" : function (d) {
							return d3.time.format("%d/%m/%Y")(new Date(d)); // jshint ignore:line
						}
					},
					"yAxis": {
						"axisLabel" : "Displacement (mm)",
						"tickFormat" : function (d) {
							return d3.format(".02f")(d); // jshint ignore:line
						},
						"axisLabelDistance" : -10
					},
					"zoom" : {
						"enabled" : true,
						"scaleExtent" : [1,10],
						"useFixedDomain" : false,
						"useNiceScale" : true,
						"horizontalOff" : true,
						"verticalOff" : true/*,
						"unzoomEventType" : "dblclick.zoom"*/
					},
					"useInteractiveGuideline" : true,
					"noData" : "Loading...",
					"showLegend" : false,
				},
				"title" : {
					enable : true,
					html : ""
				},
				"subtitle" : {
					"enable" : false
				},
				"caption" : {
					"enable" : false
				}
			},
			"data" : [], // PS line chart data
			"psDetails" : [], // PS feature details
			"show_trends" : false, // dialog box closure
			"showPsTrends" : function (show){ // showPsTrends hides this view and deletes OLs marker
				self.show_trends = show;
				$rootScope.markerVisibility = show;
				if (!show){
					self.data = [];
					self.psDetails = [];
				}
			}
		});

		$scope.$on("setPsTrendsClosure",function(e){ // jshint ignore:line
			if (self.show_trends) {
				self.showPsTrends(false);
			}
		});

		/**
		 * WATCHERS
		 */
		// ps watcher for rendering chart line data
		$scope.$watch("ps",function(ps){
			if ((ps!==null) && (ps.features!==null) && (ps.features.length>0)) {
				self.showPsTrends(
					generateChartData(ps,"MRF-PR-EOP-PRO-096_BARRITTERI")
				);
			} else {
				self.showPsTrends(false);
			}
		});

		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var datasetIdKey = $scope.getOverlayMetadata("ps").custom.datasetid;
		var psIdKey = $scope.getOverlayMetadata("ps").custom.psid;

		var getMeasures = function (datasetid,psid){
			var ret = [];
			var measureUrl = $scope.getOverlayMetadata("ps").custom.measureUrl;
			var dateKey = $scope.getOverlayMetadata("ps").custom.date;
			var measureKey = $scope.getOverlayMetadata("ps").custom.measure;
			var url = measureUrl.replace(datasetIdKey,datasetid).replace(psIdKey,psid);
			$http.get(url)
				.success(function (measures) { //if request is successful
					if ((measures!==null) && measures.length>0){
						for (var i=0; i<measures.length; i++) {
							var measureDate = new Date(eval("measures[i]."+dateKey+";")); // jshint ignore:line
							if (measureDate instanceof Date) {
								ret.push({
									"x" : measureDate,
									"y" : eval("measures[i]."+measureKey+";") // jshint ignore:line
								});
							}
						}
					}
				})
				.error(function(){ //.error(function(data,status,headers,config){ //if request is not successful
					console.log("[ps-trends-controller] getMeasures :: ERROR");
				});
			return ret;
		};
		/**
		 * Parameters:
		 * features - {Object}
		 *
		 * Returns:
		 */
		var generateChartData = function(ps,datasetId){
			var res = false;
			try {
				var chartData = []; // Data is represented as an array of {x,y} pairs.
				var tableInfo = []; // PS details
				self.options.title.html = "<b>Trend spostamenti PS ID<b><br>[LAT: "+Math.round(ps.point[1]*10000)/10000+"; LON: "+Math.round(ps.point[0]*10000)/10000+"]";
				for (var i=0; i<ps.features.length; i++) {
					if (ps.features[i].properties){
						var datasetId = eval("ps.features[i].properties."+datasetIdKey+";"); // jshint ignore:line
						var psId = eval("ps.features[i].properties."+psIdKey+";"); // jshint ignore:line
						chartData.push({
							"key" : ps.features[i].id,
							"values" : getMeasures(datasetId,psId) // values - represents the array of {x,y} data points
						});
						var featureInfo = {};
						for (var key in ps.features[i].properties) {
							eval("featureInfo." + key + " = ps.features[\"" + i + "\"].properties." + key + ";"); // jshint ignore:line
						}
						tableInfo.push(featureInfo);
					}
				}

				// add weather data getWeather(datasetId); TODO
				var station ;
				var values = [];
				if (datasetId==="MRF-PR-EOP-PRO-096_BARRITTERI") {
				    station = configuration.aoi[0].station;
				} else {
					station = configuration.aoi[1].station;
				}
				$http.get(configuration.weatherAPI.url+station+"/measures?type=RAIN")
					.success(function (response) {
						for (i=0; i< response.length;i++) {
							values.push({
								"x" :  new Date(response[i].data),
								"y": response[i].measure
							});
						}
					})
					.error(function (response) { // jshint ignore:line
						//HTTP STATUS != 200
						//do nothing
					});
				chartData.push({
					"key" : "Precipitations",
					"values" : values,
					"classed" : "dashed"
				});
				//Line chart data should be sent as an array of series objects.
				self.data = chartData;
				self.psDetails = tableInfo;
				if(!$scope.$$phase) {
					$scope.$apply();
				}
				res = true;
			} catch (e) {
				console.log("[ps-trends-controller :: generateChartData] EXCEPTION : '"+e);
			} finally {
				// do nothing
				return(res);
			}
		};
		/*
		var getWeather = function(datasetId){

		};*/

		$scope.$on("angular-resizable.resizeEnd", function (event, args) { // jshint ignore:line
			$scope.rc.api.update();
			if(!$scope.$$phase) {
				$scope.$apply();
			}
/*
			$scope.events.unshift(event);
			$scope.size = args;
			if(args.width)
				$scope.dynamicSize.width = args.width;
			if(args.height)
				$scope.dynamicSize.height = args.height;
*/
        });
	}]);
