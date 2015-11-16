'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:PsTrendsCtrl
 * @description
 * # PsTrendsCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('PsTrendsCtrl',['$scope','configuration',function ($scope,configuration) {
		angular.extend($scope,{
			// PS Line chart options
			"graph_options" : {
				"chart" : {
					"type" : "lineChart",
					"width" : 650,
					"margin" : {
						"top" : 20,
						"right" : 20,
						"bottom" : 40,
						"left" : 55
					},
					"x" : function (d) {
						return d.x;
					},
					"y" : function (d) {
						return d.y;
					},
					"useInteractiveGuideline" : true,
					"xAxis" : {
						"axisLabel" : 'Data',
						"tickFormat" : function (d) {
							return d3.time.format('%d/%m/%Y')(new Date(d));
						}
					},
					"yAxis": {
						"axisLabel" : 'Spostamento (mm)',
						"tickFormat" : function (d) {
							return d3.format('.02f')(d);
						},
						"axisLabelDistance" : -10
					}
				},
				"title": {
					enable:true,html : ""
				},
				"subtitle" : {
					"enable" : false
				},
				"caption" : {
					"enable":false
				}
			},
			// PS line chart data
			"chartData" : [],
			// PS feature details
			"tableInfo" : [],
			//dialog box closure
			"show_trends" : false
		});

		/**
		 * psTrendsData watcher for rendering chart line data
		 */
		$scope.$watch("psTrendsData",function (psTrendsData) {
			//For IE :: creating "startsWith" and "splice" methods for String Class - START
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
			//For IE :: creating "startsWith" and "splice" methods for String Class - END

			var chartData = []; //Data is represented as an array of {x,y} pairs.
			var tableInfo = [];
			var autoColor = {
				"colors" : d3.scale.category20(),
				"index" : 0,
				"getColor" : function () {
					return this.colors(this.index++)
				}
			};
			$scope.show_trends = true;
			if (psTrendsData.features!=null) {
				$scope.graph_options.title.html = "<b>Trend spostamenti PS ID<b><br>[LAT: "+Math.round(psTrendsData.point[1]*10000)/10000+"; LON: "+Math.round(psTrendsData.point[0]*10000)/10000+"]";
				for (var i=0; i<psTrendsData.features.length; i++) {
					var featureData = [];
					var featureInfo = {};
					for (var key in psTrendsData.features[i].properties) {
						if (key.startsWith("dl")) {
							var FeatureDate = new Date(key.replace("dl", "").splice(6, 0, "/").splice(4, 0, "/"));
							if (FeatureDate instanceof Date) {
								featureData.push({
									"x" : FeatureDate,
									"y" : psTrendsData.features[i].properties[key]
								});
							}
						}
						eval("featureInfo." + key + " = psTrendsData.features[\"" + i + "\"].properties." + key + ";");
					}
					chartData.push({
						"values" : featureData, //values - represents the array of {x,y} data points
						"key" : psTrendsData.features[i].properties["code"], //key  - the name of the series (PS CODE)
						"color" : autoColor.getColor() //color - optional: choose your own line color.
					});
					tableInfo.push(featureInfo);
					$scope.marker = {
						"lat" : psTrendsData.point[1],
						"lon" : psTrendsData.point[0],
						"label" : psTrendsData.features[0].properties.code
					};
				}
			} else {
				$scope.show_trends = false;
			}
			//Line chart data should be sent as an array of series objects.                
			$scope.chartData = chartData;
			$scope.tableInfo = tableInfo;
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		});
	}]);