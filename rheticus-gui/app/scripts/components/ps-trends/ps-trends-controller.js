'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:PsTrendsCtrl
 * @description
 * # PsTrendsCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('PsTrendsCtrl',['$rootScope','$scope','configuration', function ($rootScope,$scope,configuration) {
		angular.extend($scope,{
			"options" : { // PS Line chart options
				"chart" : {
					"type" : "lineChart",
					"x" : function (d) {return d.x;},
					"y" : function (d) {return d.y;},
					"showValues" : true,
					"color" : d3.scale.category20().range(),
					"xAxis" : {
						"axisLabel" : "Date",
						"tickFormat" : function (d) {
							return d3.time.format("%d/%m/%Y")(new Date(d));
						}
					},
					"yAxis": {
						"axisLabel" : "Displacement (mm)",
						"tickFormat" : function (d) {
							return d3.format(".02f")(d);
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
					"useInteractiveGuideline" : true
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
			"show_trends" : false // dialog box closure
		});

		/**
		 * showPsTrends hides this view and deletes OLs marker
		 */
		angular.extend($scope,{
			"showPsTrends" : function (show){
				$scope.show_trends = show;
				$rootScope.marker = show;
				if (!show){
					$scope.data = [];
					$scope.psDetails = [];
				}
			},
			/**
			 * Parameters:
			 * features - {Object}
			 * 
			 * Returns:
			 */
			"generateChartData" : function(ps){
				var res = false;
				try {
					var chartData = []; // Data is represented as an array of {x,y} pairs.
					var tableInfo = []; // PS details
					$scope.options.title.html = "<b>Trend spostamenti PS ID<b><br>[LAT: "+Math.round(ps.point[1]*10000)/10000+"; LON: "+Math.round(ps.point[0]*10000)/10000+"]";
					for (var i=0; i<ps.features.length; i++) {
						if (ps.features[i].properties){
							chartData.push({
								"key" : ps.features[i].properties["sensorid"],
								"values" : [] //values - represents the array of {x,y} data points
								
							});
							var featureInfo = {};
							for (var key in ps.features[i].properties) {
								if (key.startsWith("dl")) {
									var featureDate = new Date(key.replace("dl", "").splice(6, 0, "/").splice(4, 0, "/"));
									if (featureDate instanceof Date) {
										chartData[i].values.push({
											"x" : featureDate,
											"y" : ps.features[i].properties[key]
										});
									}
								}
								eval("featureInfo." + key + " = ps.features[\"" + i + "\"].properties." + key + ";");
							}
							tableInfo.push(featureInfo);
						}
					}
					//Line chart data should be sent as an array of series objects.                
					$scope.data = chartData;
					$scope.psDetails = tableInfo;
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
			}
		});
		
		/**
		 * ps watcher for rendering chart line data
		 */
		$scope.$watch("ps", function (ps) {
			if ((ps!=null) && (ps.features!=null) && (ps.features.length>0)) {
				$scope.showPsTrends(
					$scope.generateChartData(ps)
				);
			} else {
				$scope.showPsTrends(false);
			}
		});
	}]);