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
					"showLegend": false,
					"type" : "scatterChart",
					"x" : function(d){return d.x;},
					"y" : function(d){return d.y;},
					"showValues" : true,
					"color" : d3.scale.category20().range(),
					"xAxis" : {
						"axisLabel" : "Date",
						"tickFormat" : function (d) {
							return d3.time.format("%x")(new Date(d));
						}
					},
					"yAxis" : {
						"axisLabel" : "Dataset",
						"axisLabelDistance" : -5,
						"tickFormat" : function (y) {
							var scale = d3.scale.ordinal()
								.domain(["A","B","C","D","E","F","G","H"])
								.rangePoints([0,8],1);
							return scale(y);
						}
					},
					"zoom" : {
						"enabled" : true,
						"scaleExtent" : [1,10],
						"useFixedDomain" : false,
						"useNiceScale" : false,
						"horizontalOff" : false,
						"verticalOff" : true/*,
						"unzoomEventType" : "dblclick.zoom"*/
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
					"showMaxMin" : false/*,
					"noData" : "I'm sorry ... No Data Available."*/
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
			"config" : {
				visible: true, // default: true
				extended: false, // default: false
				disabled: false, // default: false
				autorefresh: true, // default: true
				refreshDataOnly: true, // default: true
				deepWatchOptions: true, // default: true
				deepWatchData: false, // default: false
				deepWatchConfig: true, // default: true
				debounce: 10 // default: 10
			},
			"events" : {},
			"data" : [], // Chart data
			"show_timeline" : false, // dialog box closure
			"datasetIdAttribute" : configuration.timeSlider.attributes.datasetIdentifier,
			"datasetList" : [] // datasets
		});
/*
		$scope.$watch('data', function(data) {
			if (data.length>0){
				$scope.data = [
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
				];
				if(!$scope.$$phase) {
					$scope.$apply();
				}
			}
		});
		*/
		/**
		 * showTimeline hides this view
		 */
		angular.extend($scope,{
			/**
			 * Parameters:
			 * show - {boolean}
			 * 
			 * Returns:
			 */
			"showTimeline" : function (show){
				$scope.show_timeline = show;
				if (!show){
					$scope.data = [];
				}
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
				var res = -1;
				try {
					if ((list!=null) && (list.length>0)) {
						if (attribute!=""){
							for (var i=0; i<list.length; i++){
								if (eval("list[i]."+attribute)==idValue){
									res = i;
									break;
								}
							}
						} else {
							for (var i=0; i<list.length; i++){
								if (list[i]==idValue){
									res = i;
									break;
								}
							}
						}
					}
				} catch (e) {
					console.log("[timeline-controller :: getIndexByAttributeValue] EXCEPTION : '"+e);
				} finally {
					return(res);
				}
			},
			/**
			 * Parameters:
			 * coords - Array<{Object}>
			 * 
			 * Returns:
			 * {Object} - Bounding Box Coordinates
			 */
			"boundingBoxAroundPolyCoords" : function(coords) {
				var res = null;
				try {
					if ((coords!=null) && (coords.length>0)){
						var xAll = [], yAll = [];
						for (var i=0; i<coords[0].length; i++) {
							xAll.push(coords[0][i][1]);
							yAll.push(coords[0][i][0]);
						}
						xAll = xAll.sort(function (a,b) { return a - b });
						yAll = yAll.sort(function (a,b) { return a - b });
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
			},
			/**
			 * Parameters:
			 * current - {Object}
			 * feature - {Object}
			 * 
			 * Returns:
			 * {Object} - Bounding Box Coordinates
			 */
			"updateDatasetBoundingBox" : function(current,feature) {
				if ((current!=null) && (feature!=null)){
					return {
						"left" : (feature.left<current.left) ? feature.left : current.left,
						"bottom" : (feature.bottom<current.bottom) ? feature.bottom : current.bottom,
						"right" : (feature.right>current.right) ? feature.right : current.right,
						"top" : (feature.top>current.top) ? feature.top : current.top
					};
				}
			},
			/**
			 * Parameters:
			 * timeline - {Object}
			 * 
			 * Returns:
			 * Array<{Object}> - Dataset list
			 */
			"normalizeDatasetList" : function(timeline){
				var datasetList = [];
				try {
					for (var i=0; i<timeline.features.length; i++) {
						if (timeline.features[i].properties){
							var featureData = [];
							for (var key in timeline.features[i].properties) {
								var datasetValue = "";
								try {
									eval("datasetValue = timeline.features[i].properties."+$scope.datasetIdAttribute);
									if (datasetValue!=""){ // dataset exists
										var index = $scope.getIndexByAttributeValue(datasetList,"id",datasetValue);
										if (index==-1){ // add new dataset
											datasetList.push({
												"id" : datasetValue,
												"bbox" : $scope.boundingBoxAroundPolyCoords(timeline.features[i].geometry.coordinates),
												"features" : [timeline.features[i]]
											});
											//console.log("[timeline-controller] adding dataset id = '"+datasetList[datasetList.length-1].id+"'");
											//console.log("[timeline-controller] adding dataset bbox = '"+JSON.stringify(datasetList[datasetList.length-1].bbox)+"'");
										} else { // update bbox of existing dataset
											datasetList[index].bbox = $scope.updateDatasetBoundingBox(datasetList[index].bbox,$scope.boundingBoxAroundPolyCoords(timeline.features[i].geometry.coordinates));
											datasetList[index].features.push(timeline.features[i]);
											//console.log("[timeline-controller] updating dataset id = '"+datasetList[index].id+"'");
											//console.log("[timeline-controller] updating dataset bbox = '"+JSON.stringify(datasetList[index].bbox)+"'");
										}
									}
								} catch (e) {
									console.log("[timeline-controller :: normalizeDatasetList] EXCEPTION : '"+$scope.datasetIdAttribute+"' attribute doesn't exists!");
								} finally {
									// do nothing ... continue parsing other features!
								}
							}
						}
					}
				} catch (e) {
					console.log("[timeline-controller :: normalizeDatasetList] EXCEPTION : '"+e);
					datasetList = []; // this empties the list if dirty
				} finally {
					return(datasetList);
				}
			},
			/**
			 * Parameters:
			 * 
			 * Returns:
			 */
			"generateChartData" : function(){
				var res = false;
				try {
					if (($scope.datasetList!=null) && ($scope.datasetList.length>0)){
						//Line chart data should be sent as an array of series objects.                
						var chartData = []; //Data is represented as an array of {x,y} pairs.
						for (var i=0; i<$scope.datasetList.length; i++) {
							try {
								var imageryList = []; // necessary to filter unique imagery ID 
								chartData.push({
									"key" : $scope.datasetList[i].id, // dataset ID value
									"values" : [] // values - represents the array of {x,y} data points
								});
								for (var j=0; j<$scope.datasetList[i].features.length; j++) {
									try {
										var featureStartTime = new Date($scope.datasetList[i].features[j].properties.startTime);
										if ((featureStartTime instanceof Date) && ($scope.getIndexByAttributeValue(imageryList,"",$scope.datasetList[i].features[j].id)==-1) ) {
											imageryList.push($scope.datasetList[i].features[j].id);
											chartData[i].values.push({
												"x" : featureStartTime,
												"y" : i,
												"label" : $scope.datasetList[i].features[j].id,
												"size" : 3,
												"shape" : "circle"
											});
										}
									} catch (e) {
										console.log("[timeline-controller :: generateChartData] EXCEPTION parsing S1 startTime: "+e);
									} finally {
										// do nothing and continue
									}
								}
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
			}
		});

		/**
		 * ps watcher for rendering chart line data
		 */
		$scope.$watch("timeline", function (timeline) {
			if ((timeline!=null) && (timeline.features!=null) && (timeline.features.length)) {
				$scope.datasetList = $scope.normalizeDatasetList(timeline);
				$scope.showTimeline(
					$scope.generateChartData()
				);
			} else {
				$scope.showTimeline(false);
			}
		});
	}]);