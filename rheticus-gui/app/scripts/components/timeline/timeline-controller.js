'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:TimelineCtrl
 * @description
 * # TimelineCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('TimelineCtrl', ['$scope','configuration', function ($scope,configuration) {
		angular.extend($scope,{
			"options" : { // Chart options
				"chart" : {
					"type" : "scatterChart",
					"x" : function(d){return d.x;},
					"y" : function(d){return d.y;},
					"showValues" : true,
					"color" : d3.scale.category20().range(),
					"xAxis" : {
						"axisLabel" : "Date",
						"tickFormat" : function(d) {
						return d3.time.format('%x')(new Date(d))
					},
					"yAxis" : {
						"axisLabel" : "Dataset"/*,
						"axisLabelDistance" : 35,
						"tickFormat" : function(d){
							return d3.format(',.1f')(d);
						}*/
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
					"showDistY" : true,
					"tooltipContent" : function(key) {
						return "<h3>" + key + "</h3>";
					},
					"scatter" : {
						"onlyCircles" : true
					},
					/*"valueFormat" : function(d){
						return d3.format(',.1f')(d);
					},*/
					"transitionDuration" : 250,
					//"rotateLabels" : 50,
					"showMaxMin" : false
					}
				},
				"title" : {
					enable : true,
					html : "<b>Sentinel 1 Datasets</b>"
				},
				"subtitle" : {
					"enable" : false
				},
				"caption" : {
					"enable" : false
				}
			},
			//"data" : [], // Chart data
			"data" : [
				{
					"key" : "Sentinel" ,
					"bar" : true,
					"values" : [ {x: 1136005200000 , y:1 , label:"sentinel1"} , { x:1138683600000 , y:1,label:"sentinel1" }, { x:1141102800000 , y:1,label:"sentinel1"}]
				},
				{
					"key" : "Sentinel2" ,
					"bar" : true,
					"values" : [ {x: 1136005200000 , y:2 , label:"sentinel2"} , { x:1138683600000 , y:2,label:"sentinel2"}, {x:1141102800000 , y:2,label:"sentinel2"}]
				}
			],
			"show_timeline" : false, // dialog box closure
			"datasetIdAttribute" : configuration.timeSlider.attributes.datasetIdentifier
		});

		/**
		 * showTimeline hides this view
		 */
		angular.extend($scope,{
			"showTimeline" : function (show){
				$scope.show_timeline = show;
			},
			/**
			 * Parameters:
			 * list - {Object}
			 * attribute - {String}
			 * idValue - {String}
			 * 
			 * Returns:
			 * {Integer} - Position in list
			 */
			"getIndexByAttributeValue" : function(list,attribute,idValue) {
				if (list!=null){
					for (var i=0; i<list.length; i++){
						if (eval("list[i]."+attribute)==idValue)
							return i;
					}
				}
				return(-1);
			},
			/**
			 * Parameters:
			 * coords - Array<{Object}>
			 * 
			 * Returns:
			 * {Object} - Bounding Box Coordinates
			 */
			"boundingBoxAroundPolyCoords" : function(coords) {
				var xAll = [], yAll = [];
				for (var i=0; i<coords[0].length; i++) {
					xAll.push(coords[0][i][1]);
					yAll.push(coords[0][i][0]);
				}
				xAll = xAll.sort(function (a,b) { return a - b });
				yAll = yAll.sort(function (a,b) { return a - b });
				return({
					"left" : xAll[0],
					"bottom" : yAll[0],
					"right" : xAll[xAll.length-1],
					"top" : yAll[yAll.length-1]
				});
			},
			/**
			 * Parameters:
			 * coords - {Object}
			 * 
			 * Returns:
			 * {Object} - Bounding Box Coordinates
			 */
			"updateDatasetBoundingBox" : function(current,feature) {
				return {
					"left" : (feature.left<current.left) ? feature.left : current.left,
					"bottom" : (feature.bottom<current.bottom) ? feature.bottom : current.bottom,
					"right" : (feature.right>current.right) ? feature.right : current.right,
					"top" : (feature.top>current.top) ? feature.top : current.top
				};
			}
		});

		/**
		 * ps watcher for rendering chart line data
		 */
		$scope.$watch("timeline", function (timeline) {
			if ((timeline!=null) && (timeline.features!=null) && (timeline.features.length)) {
				var datasetList = [];
				for (var i=0; i<timeline.features.length; i++) {
					if (timeline.features[i].properties){
						var featureData = [];
						for (var key in timeline.features[i].properties) {
							var datasetValue = "";
							try {
								eval("datasetValue = response.features[i].properties."+datasetIdAttribute);
								if (datasetValue!=""){ // dataset exists
									var index = $scope.getIndexByAttributeValue(datasetList,"id",datasetValue);
									if (index==-1){ // add new dataset
										datasetList.push({
											"id" : datasetValue,
											"bbox" : $scope.boundingBoxAroundPolyCoords(timeline.features[i].geometry.coordinates),
											"features" : [timeline.features[i]]
										});
										console.log("[timeline-controller] adding dataset id = '"+datasetList[datasetList.length-1].id+"'");
										console.log("[timeline-controller] adding dataset bbox = '"+datasetList[datasetList.length-1].bbox+"'");
									} else { // update bbox of existing dataset
										datasetList[index].bbox = $scope.updateDatasetBoundingBox(datasetList[index].bbox,$scope.boundingBoxAroundPolyCoords(timeline.features[i].geometry.coordinates));
										datasetList[index].features.push(timeline.features[i]);
										console.log("[timeline-controller] updating dataset id = '"+datasetList[index].id+"'");
										console.log("[timeline-controller] updating dataset bbox = '"+datasetList[index].bbox+"'");
									}
								}
							} catch (e) {
								console.log("[timeline-controller] EXCEPTION : '"+datasetIdAttribute+"' attribute doesn't exists!");
							}
						}
					}
				}
				
				if (datasetList.length>0){
					//Line chart data should be sent as an array of series objects.                
					var chartData = []; //Data is represented as an array of {x,y} pairs.
					/*chartData.push({
						"values" : featureData, //values - represents the array of {x,y} data points
						"key" : ps.features[i].properties["code"]
					});*/
					$scope.data = chartData;
					if(!$scope.$$phase) {
						$scope.$apply();
					}
					$scope.showTimeline(true);
				}
			} else {
				$scope.showTimeline(false);
				return false;
			}
		});
	}]);