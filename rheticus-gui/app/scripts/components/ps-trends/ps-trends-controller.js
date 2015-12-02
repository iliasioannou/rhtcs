'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:PsTrendsCtrl
 * @description
 * # PsTrendsCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('PsTrendsCtrl',['$rootScope','$scope','$http','$q', function ($rootScope,$scope,$http,$q) {
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

		angular.extend($scope,{ //other variables
			"measureUrl" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].queryUrl,
			"datasetIdKey" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].custom.datasetid,
			"psIdKey" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].custom.psid,
			"dateKey" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].custom.date,
			"measureKey" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].custom.measure
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
			"getMeasures" : function (datasetid,psid){
				var deferred = $q.defer();
				var url = $scope.measureUrl.replace($scope.datasetIdKey,datasetid).replace($scope.psIdKey,psid);
				$http.get(url)
					.success(function (measures) { //if request is successful
						var ret = [];
						if ((measures!=null) && measures.length>0){
							for (var i=0; i<measures.length; i++) {
								var measureDate = new Date(eval("measures[i]."+$scope.dateKey+";"));
								if (measureDate instanceof Date) {
									ret.push({
										"x" : measureDate,
										"y" : eval("measures[i]."+$scope.measureKey+";")
									});
								}
							}
						}
						deferred.resolve(ret);
					})
					.error(function(data,status,headers,config){ //if request is not successful
						//reject the promise
						deferred.reject('ERROR');
					});
				return deferred.promise;
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
							var datasetId = eval("ps.features[i].properties."+$scope.datasetIdKey+";");
							var psId = eval("ps.features[i].properties."+$scope.psIdKey+";");
							chartData.push({
								"key" : ps.features[i].id,
								"values" : $scope.getMeasures(datasetId,psId) // values - represents the array of {x,y} data points
							});
							var featureInfo = {};
							for (var key in ps.features[i].properties) {
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