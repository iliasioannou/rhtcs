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
			"graph_options" : { // PS Line chart options
				"chart" : {
					"type" : "lineChart",
					"x" : function (d) {return d.x;},
					"y" : function (d) {return d.y;},
					"showValues" : true,
					"color" : d3.scale.category20().range(),
					"xAxis" : {
						"axisLabel" : "Data",
						"tickFormat" : function (d) {
							return d3.time.format("%d/%m/%Y")(new Date(d));
						}
					},
					"yAxis": {
						"axisLabel" : "Spostamento (mm)",
						"tickFormat" : function (d) {
							return d3.format(".02f")(d);
						},
						"axisLabelDistance" : -10
					},
					"zoom" : {
						"enabled" : true,
						"scaleExtent" : [1,10],
						"useFixedDomain" : false,
						"useNiceScale" : false,
						"horizontalOff" : false,
						"verticalOff" : true,
						"unzoomEventType" : "dblclick.zoom"
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
			"chartData" : [], // PS line chart data
			"tableInfo" : [], // PS feature details
			"show_trends" : false // dialog box closure
		});

		/**
		 * showTrends hides this view and deletes OLs marker
		 */
		angular.extend($scope,{
			"showTrends" : function (show){
				$scope.show_trends = show;
				$rootScope.marker = show;
			}
		});
		
		/**
		 * ps watcher for rendering chart line data
		 */
		$scope.$watch("ps", function (ps) {
			if ((ps!=null) && (ps.features!=null) && (ps.features.length>0)) {
				var chartData = []; //Data is represented as an array of {x,y} pairs.
				var tableInfo = [];
				$scope.graph_options.title.html = "<b>Trend spostamenti PS ID<b><br>[LAT: "+Math.round(ps.point[1]*10000)/10000+"; LON: "+Math.round(ps.point[0]*10000)/10000+"]";
				for (var i=0; i<ps.features.length; i++) {
					if (ps.features[i].properties){
						var featureData = [],
							featureInfo = {};
						for (var key in ps.features[i].properties) {
							if (key.startsWith("dl")) {
								var FeatureDate = new Date(key.replace("dl", "").splice(6, 0, "/").splice(4, 0, "/"));
								if (FeatureDate instanceof Date) {
									featureData.push({
										"x" : FeatureDate,
										"y" : ps.features[i].properties[key]
									});
								}
							}
							eval("featureInfo." + key + " = ps.features[\"" + i + "\"].properties." + key + ";");
						}
						chartData.push({
							"values" : featureData, //values - represents the array of {x,y} data points
							"key" : ps.features[i].properties["code"]
						});
						tableInfo.push(featureInfo);
					}
				}
				//Line chart data should be sent as an array of series objects.                
				$scope.chartData = chartData;
				$scope.tableInfo = tableInfo;
				if(!$scope.$$phase) {
					$scope.$apply();
				}
				$scope.showTrends(true);
			} else {
				$scope.showTrends(false);
				return false;
			}
		});
	}]);