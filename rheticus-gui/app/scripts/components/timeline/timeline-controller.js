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
			self.trendDataset = false;
			$rootScope.markerVisibility = show;
			$scope.setSentinelExtent([]);
			if (!show){
				self.data = [];
			}
		};
		
		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */		
		angular.extend(self,{
			
			"trendDataset" : false,
			"show_timeline" : false, // dialog box closure
			"showTimeline" : showTimeline,
			"data" : [],
			"tableData" :[],
			"dataTrend" : [],
			
			// Chart options
			"options" : { 
				"chart" : {
					"width" : 600,
					"height" : 200,
					"showLegend": false,
					"type" : "discreteBarChart",
					"x" : function(d){
						return d.label;
					},
					"y" : function(d){
						return parseInt(d.value);
					},
					"valueFormat": function(d){
						return d3.format(',.0f')(d);
					},
					"xAxis" : {
						"axisLabel" : "Dataset"
						
					},
					"yAxis" : {
						"axisLabel" : "Count",
						"axisLabelDistance" : -10
					},
					"showValues" : true,
					"discretebar": {
					  "dispatch": {
						"elementClick": function(e) //chartClick: function(e) {console.log("! chart Click !")},
							{
								self.trendDataset=true;		//change ng-show variable
								self.dataTrend=getTableData(e.data.features);
								self.tableData=e.data;	
							    var jsonExtent =  getExtentSuperMaster(e.data.features);
								$scope.setSentinelExtent(jsonExtent);
								$scope.$apply(); //update view			
							}
					  }
					},
					
					"useInteractiveGuideline" : false,
					"interactive" : true,
					"tooltip" : {
						enable : true,
						contentGenerator : function(d) {
											return '<p><b> ' + d.data.label + '</b> alias: <b>' + d.data.id + ' </b></p>' +
												'<p  style="text-align:left;">'+' Total products: '  +  d.data.value + '</p>'+
												'<p  style="text-align:left;">'+' Family name: '  +  d.data.features[0].properties.familyName + '</p>'+
												'<p  style="text-align:left;">'+' Pass: '  +  d.data.features[0].properties.pass + '</p>'+
												'<p  style="text-align:left;">'+' Swath: '  +  d.data.features[0].properties.swath + '</p>'+
												'<p  style="text-align:left;">'+' ProductType: '  +  d.data.features[0].properties.productType + '</p>'+
												'<p  style="text-align:left;">'+' ProductClass: '  +  d.data.features[0].properties.productClass + '</p>'+
												'<p  style="text-align:left;">'+' RelativeOrbitNumber: '  +  d.data.features[0].properties.relativeOrbitNumberTypeStart + '</p>'+
												'<p  style="text-align:left;">'+' TransmitterReceiverPolarisation: '  +  d.data.features[0].properties.transmitterReceiverPolarisation + '</p>';
										}
					},
					"transitionDuration" : 250,
					"noData" : "Sorry... no data found"
				},
				"title" : {
					enable : true,
					html : "<b>Sentinel 1 Datasets Identifier</b>"
				},
				
				
				
				
			},
			
			// Chart options
			"optionsTrend" : { 
				"chart" : {
							"showLegend": false,
							"type" : "lineChart",
							"x" : function(d){
								return d.x;
							},
							"y" : function(d){
								return d.y;
							},
							"xAxis": {
								"axisLabel": 'Acquisitions day',
								"tickFormat" : function (d) {
									return d3.time.format("%d/%m/%Y")(new Date(d));
								},
							},

							"yAxis": {
								"axisLabel": 'Count',
							},
							"noData" : "Loading",
							margin : {
								right: 50,
								left: 80
							},
							"width" : 320,
							"height" : 200,
							"showDistX" : true,
							"showDistY" : true,
							"useInteractiveGuideline" : false,
							"interactive" : true,
							"lines": {
								"dispatch": {
									"elementClick": function(e) {},
									"elementMouseout": function(e) {},
									"elementMouseover": function(e) {},
								}
							},
							"tooltip" : {
								enable : true,
								contentGenerator : function(d) {
													var dateString = d.point.data.startTime;
													var day = dateString.substring(8,10);
													var month = dateString.substring(5,7);
													var year = dateString.substring(0,4);
													dateString=day+'/'+month+'/'+year;
													return '<p><b> UUID: ' + d.point.data.uuid  + ' </b></p>' +
												'<p  style="text-align:left;">'+' Acquisition Day: '  +  dateString + '</p>'+
												'<p  style="text-align:left;">'+' Total products: '  +  d.point.y + '</p>';
												}
							}
						},
						"title" : {
								enable : true,
								html : "<b>Acquisitions History</b>"
						},
					
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
		var getTableData= function (features){
			
			features.sort(function(a,b) {
							if (convertDate(a.properties.startTime) < convertDate(b.properties.startTime))
								return -1;
							if (convertDate(a.properties.startTime) > convertDate(b.properties.startTime))
								return 1;
							return 0;
				} );
			
			var featureValue = [];
			var dateLong =[];
			for (var i = 0; i < features.length; i++) {
				//get long value for date
				var dateLong = convertDate(features[i].properties.startTime);
                featureValue.push({x: dateLong, y: i+1,data:features[i].properties});
                
            };
			$scope.$apply();			//update view
			console.log(featureValue);
			
			return [
                {
                    values: featureValue,      //values - represents the array of {x,y} data points
                    key: 'Total products', //key  - the name of the series.
                    color: '#ff7f0e',  //color - optional: choose your own line color.
					mean: 20
                }];
			
			
		};
		
		var getExtentSuperMaster= function (features)
		{
			var coordinates=[];
			var i = 0;
			while ( i < features.length  ) {
					coordinates.push(features[i].geometry.coordinates);
				
				i++;  
            };
			console.log(coordinates);
			
			return coordinates;
			
		};
		
		
		
		
		
		var convertDate= function (dateString){
			
			var day = dateString.substring(8,10);
			var month = dateString.substring(5,7)-1;
			var year = dateString.substring(0,4);
			var d = new Date();
			d.setFullYear(year);
			d.setMonth(month);
			d.setDate(day);
			
			return d.getTime();
			
		}
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
							var datasetValue = timeline.features[i].properties.datasetId;
							try {
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
								
							} catch (e) {
								console.log("[timeline-controller :: normalizeDatasetList] EXCEPTION : '"+datasetIdAttribute+"' attribute doesn't exists!");
							} finally {
								// do nothing ... continue parsing other features!
							}
					
						
					}
				}
				//sort datasetList
				datasetList.sort(function(a,b) {
							if (a.features.length < b.features.length)
								return -1;
							if (a.features.length > b.features.length)
								return 1;
							return 0;
				} );
				
				datasetList.reverse();
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
			var alphabet =['A','B','C','D','E','F','G','H','I','L','M','N','0','P'] ;
			var res = false;
			if (datasetList.length>9)
				datasetList.length=10; // max array size to be displayed
			try {
				if ((datasetList!==null) && (datasetList.length>0)){
					//Line chart data should be sent as an array of series objects.                
					var chartData = []; //Data is represented as an array of {x,y} pairs.
					for (var i=0; i<datasetList.length; i++) {
						try {
							
							if(datasetList[i].features.length>5) // set a minimum cardinality to view a dataset
							chartData.push({
								"label" : alphabet[i], // alias dataset ID value
								"id" : datasetList[i].id, // dataset id
								"value" : datasetList[i].features.length, // values - represents the dataset's cardinality 
								"features" : datasetList[i].features
								
							});
							
						} catch (e) {
							console.log("[timeline-controller :: generateChartData] EXCEPTION adding data to chart: "+e);
						} finally {
							// do nothing and continue
						}
					}
					var chartDataExternal = [];
					chartDataExternal.push({
								"key" : "prova", 
								"values" : chartData 
								
							});
					$scope.api.refresh();
					$scope.api.updateWithData(chartDataExternal);
					res = true;
				}
			} catch (e) {
				console.log("[ps-trends-controller :: generateChartData] EXCEPTION : '"+e);
			} finally {
				return(res);
			}
		};

	}]);