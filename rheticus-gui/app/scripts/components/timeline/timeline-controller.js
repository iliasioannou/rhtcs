'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:TimelineCtrl
 * @description
 * # TimelineCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('TimelineCtrl', ['$scope', function($scope){
		angular.extend($scope,{
			"options" : { // Chart options
				"chart" : {
					"type" : "scatterChart",
					"x" : function(d){return d[0];},
					"y" : function(d){return d[1]/100000;},
					"showValues" : true,
					"color" : d3.scale.category20().range(),
					"xAxis" : {
						"axisLabel" : 'X Axis',
						"tickFormat" : function(d) {
						return d3.time.format('%x')(new Date(d))
					},
					"yAxis" : {
						"axisLabel" : 'Y Axis',
						"axisLabelDistance" : 35,
						"tickFormat" : function(d){
							return d3.format(',.1f')(d);
						}
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
					
					"showDistX" : true,
					//"showDistY" : true,
					"tooltipContent" : function(key) {
						return "<h3>" + key + "</h3>";
					},
					"scatter" : {
						"onlyCircles" : true
					},
					"valueFormat" : function(d){
						return d3.format(',.1f')(d);
					},
					"transitionDuration" : 250,
					"rotateLabels" : 50,
					"showMaxMin" : false
					}
				}
			},
			"data" : [], // Chart data
			/*
			[{
				"key" : "Sentinel" ,
				"bar" : true,
				"values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
			}]
			*/
			"show_timeline" : false // dialog box closure
		});

		/**
		 * showTimeline hides this view
		 */
		angular.extend($scope,{
			"showTimeline" : function (show){
				$scope.show_timeline = show;
			}
		});

		/**
		 * ps watcher for rendering chart line data
		 */
		$scope.$watch("timeline", function (timeline) {
			if (timeline!=null){
				//For IE :: creating "startsWith" and "splice" methods for String Class - START
				if (typeof String.prototype.startsWith != "function") {
					String.prototype.startsWith = function (str) {
						return this.slice(0, str.length) == str;
					};
				}
				if (typeof String.prototype.splice != "function") {
					String.prototype.splice = function (idx, rem, s) {
						return this.slice(0, idx) + s + this.slice(idx + Math.abs(rem));
					};
				}
				//For IE :: creating "startsWith" and "splice" methods for String Class - END

				var chartData = []; //Data is represented as an array of {x,y} pairs.
				var autoColor = {
					"colors" : d3.scale.category20(),
					"index" : 0,
					"getColor" : function () {
						return this.colors(this.index++)
					}
				};
				$scope.showTimeline(true);
				if (timeline.features!=null) {

/*
					$scope.graph_options.title.html = "<b>Trend spostamenti PS ID<b><br>[LAT: "+Math.round(ps.point[1]*10000)/10000+"; LON: "+Math.round(ps.point[0]*10000)/10000+"]";
					for (var i=0; i<ps.features.length; i++) {
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
							"key" : ps.features[i].properties["code"], //key  - the name of the series (PS CODE)
							"color" : autoColor.getColor() //color - optional: choose your own line color.
						});
						tableInfo.push(featureInfo);
					}
*/
/*
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
				} else {
					$scope.showTimeline(false);
				}
				//Line chart data should be sent as an array of series objects.                
				$scope.data = chartData;
				if(!$scope.$$phase) {
					$scope.$apply();
				}
			}
		});
	}]);