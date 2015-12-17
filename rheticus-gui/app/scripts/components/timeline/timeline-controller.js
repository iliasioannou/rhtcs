'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:TimelineCtrl
 * @description
 * # TimelineCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('TimelineCtrl',['$rootScope','$scope','configuration','ArrayService',function($rootScope,$scope,configuration,ArrayService){
		
		var self = this; //this controller

		/**
		 * PUBLIC VARIABLES AND METHODS
		 */
		var showTimeline = function (show){
			self.show_timeline = show;
			$rootScope.markerVisibility = show;
			if (!show){
				self.data = [];
			}
		};
		
		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */		
		angular.extend(self,{
			"options" : { // Chart options
				"chart" : {
					"showLegend": false,
					"type" : "scatterChart",
					"x" : function(d){
						return d.x;
					},
					"y" : function(d){
						return d.y;
					},
					"showValues" : true,
					"color" : d3.scale.category20().range(),
					"xAxis" : {
						"axisLabel" : "Date",
						"tickFormat" : function (d) {
							return d3.time.format("%d/%m/%Y")(new Date(d));
						}
					},
					"yAxis" : {
						"axisLabel" : "Dataset",
						"axisLabelDistance" : -5/*,
						"tickFormat" : function (y) {
							var scale = d3.scale.ordinal()
								.domain(["A","B","C","D","E","F","G","H"])
								.rangePoints([0,8],1);
							return scale(y);
						}*/
					},
					"zoom" : {
						"enabled" : true,
						"scaleExtent" : [1,5],
						"useFixedDomain" : false,
						"useNiceScale" : true,
						"horizontalOff" : false,
						"verticalOff" : true/*,
						"unzoomEventType" : "dblclick.zoom"*/
					},
					"showDistX" : true,
					"showDistY" : true,
					"useInteractiveGuideline" : true,
					"interactive" : true,
					"tooltips" : true,
					//"tooltipContent" : function(key, x, y, e, graph){
					"tooltipContent" : function(key, x, y){
						return '<h3>' + key + '</h3>' + '<p>' +  y + ' on ' + x + '</p>';
					},
					"scatter" : {
						"onlyCircles" : true
					},
					/*"valueFormat" : function(d){
						return d3.format(',.1f')(d);
					},*/
					"transitionDuration" : 250,
					//"rotateLabels" : 50,
					"showMaxMin" : false/*,
					"noData" : "I'm sorry ... No Data Available."*/
				},
				"title" : {
					enable : true,
					html : "<b>Sentinel 1 Datasets Identifier</b>"
				},
				"subtitle" : {
					"enable" : false
				},
				"caption" : {
					"enable" : false
				}
			},
			"config" : {
				"visible": true, // default: true
				"extended": false, // default: false
				"disabled": false, // default: false
				"autorefresh": true, // default: true
				"refreshDataOnly": true, // default: true
				"deepWatchOptions": true, // default: true
				"deepWatchData": false, // default: false
				"deepWatchConfig": true, // default: true
				"debounce": 10 // default: 10
			},
			"events" : {},
			"data" : [], // Chart data
			"show_timeline" : false, // dialog box closure
			"showTimeline" : showTimeline,
			"toolTipContentFunction" : function(){
				//return function(key, x, y, e, graph) {
				return function(key, x, y) {
					return  'Super New Tooltip' +
						'<h1>' + key + '</h1>' +
						'<p>' +  y + ' at ' + x + '</p>';
				};
			}
		});

		/**
		 * WATCHERS
		 */	
		// ps watcher for rendering chart line data
		$scope.$watch("sentinel",function(timeline) {
			if ((timeline!==null) && (timeline.features!==null) && (timeline.features.length)) {
				var datasetList = normalizeDatasetList(timeline);
				showTimeline(
					generateChartData(datasetList)
				);
			} else {
				showTimeline(false);
			}
		});

		/**
		 * PRIVATE VARIABLES AND METHODS
		 */
		/**
		 * Parameters:
		 * coords - Array<{Object}>
		 * 
		 * Returns:
		 * {Object} - Bounding Box Coordinates
		 */
		var boundingBoxAroundPolyCoords = function(coords) {
			var res = null;
			try {
				if ((coords!==null) && (coords.length>0)){
					var xAll = [], yAll = [];
					for (var i=0; i<coords[0].length; i++) {
						xAll.push(coords[0][i][1]);
						yAll.push(coords[0][i][0]);
					}
					xAll = xAll.sort(function (a,b) { 
						return a - b; 
					});
					yAll = yAll.sort(function (a,b) {
						return a - b; 
					});
					res = {
						"left" : xAll[0],
						"bottom" : yAll[0],
						"right" : xAll[xAll.length-1],
						"top" : yAll[yAll.length-1]
					};
				}
			} catch (e) {
				console.log("[timeline-controller :: boundingBoxAroundPolyCoords] EXCEPTION : '"+e);
			} finally {
				return(res);
			}
		};
		/**
		 * Parameters:
		 * current - {Object}
		 * feature - {Object}
		 * 
		 * Returns:
		 * {Object} - Bounding Box Coordinates
		 */
		var updateDatasetBoundingBox = function(current,feature) {
			if ((current!==null) && (feature!==null)){
				return {
					"left" : (feature.left<current.left) ? feature.left : current.left,
					"bottom" : (feature.bottom<current.bottom) ? feature.bottom : current.bottom,
					"right" : (feature.right>current.right) ? feature.right : current.right,
					"top" : (feature.top>current.top) ? feature.top : current.top
				};
			}
		};
		/**
		 * Parameters:
		 * timeline - {Object}
		 * 
		 * Returns:
		 * Array<{Object}> - Dataset list
		 */
		var normalizeDatasetList = function(timeline){
			var datasetIdAttribute = configuration.timeSlider.attributes.datasetIdentifier;
			var datasetList = [];
			try {
				for (var i=0; i<timeline.features.length; i++) {
					if (timeline.features[i].properties){
						//for (var key in timeline.features[i].properties) {
							var datasetValue = "";
							try {
								eval("datasetValue = timeline.features[i].properties."+datasetIdAttribute); // jshint ignore:line
								if (datasetValue!==""){ // dataset exists
									var index = ArrayService.getIndexByAttributeValue(datasetList,"id",datasetValue);
									if (index===-1){ // add new dataset
										datasetList.push({
											"id" : datasetValue,
											"bbox" : boundingBoxAroundPolyCoords(timeline.features[i].geometry.coordinates),
											"features" : [timeline.features[i]]
										});
									} else { // update bbox of existing dataset
										datasetList[index].bbox = updateDatasetBoundingBox(datasetList[index].bbox,boundingBoxAroundPolyCoords(timeline.features[i].geometry.coordinates));
										datasetList[index].features.push(timeline.features[i]);
									}
								}
							} catch (e) {
								console.log("[timeline-controller :: normalizeDatasetList] EXCEPTION : '"+datasetIdAttribute+"' attribute doesn't exists!");
							} finally {
								// do nothing ... continue parsing other features!
							}
						//}
					}
				}
			} catch (e) {
				console.log("[timeline-controller :: normalizeDatasetList] EXCEPTION : '"+e);
				datasetList = []; // this empties the list if dirty
			} finally {
				return(datasetList);
			}
		};
		/**
		 * Parameters:
		 * 
		 * Returns:
		 */
		var generateChartData = function(datasetList){
			var res = false;
			try {
				if ((datasetList!==null) && (datasetList.length>0)){
					//Line chart data should be sent as an array of series objects.                
					var chartData = []; //Data is represented as an array of {x,y} pairs.
					for (var i=0; i<datasetList.length; i++) {
						try {
							var imageryList = []; // necessary to filter unique imagery ID 
							chartData.push({
								"key" : datasetList[i].id, // dataset ID value
								"values" : [] // values - represents the array of {x,y} data points
							});
							for (var j=0; j<datasetList[i].features.length; j++) {
								try {
									var featureStartTime = new Date(datasetList[i].features[j].properties.startTime);
									if ((featureStartTime instanceof Date) && (ArrayService.getIndexByAttributeValue(imageryList,"",datasetList[i].features[j].id)===-1) ) {
										imageryList.push(datasetList[i].features[j].id);
										chartData[i].values.push({
											"x" : featureStartTime,
											"y" : i,
											"label" : datasetList[i].features[j].id,
											"size" : 5,
											"shape" : "square"
										});
									}
								} catch (e) {
									console.log("[timeline-controller :: generateChartData] EXCEPTION parsing S1 startTime: "+e);
								} finally {
									// do nothing and continue
								}
							}
							chartData[chartData.length-1].key += " ("+imageryList.length+")";
						} catch (e) {
							console.log("[timeline-controller :: generateChartData] EXCEPTION adding data to chart: "+e);
						} finally {
							// do nothing and continue
						}
					}
					$scope.api.refresh();
					$scope.api.updateWithData(chartData);
					res = true;
				}
			} catch (e) {
				console.log("[ps-trends-controller :: generateChartData] EXCEPTION : '"+e);
			} finally {
				return(res);
			}
		};
/*
		$scope.$on('tooltipShow.directive', function(angularEvent, event){
			angularEvent.targetScope.$parent.event = event;
			angularEvent.targetScope.$parent.$digest();
		});
*/
	}]);