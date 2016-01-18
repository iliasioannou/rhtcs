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
					"type" : "multiChart",
					"margin": {
						"top": 30,
						"right": 80,
						"bottom": 50,
						"left": 80
					},
					"focusEnable": false,
					"x" : function (d) {return d.x;},
					"y" : function (d) {return d.y;},
					"showValues" : true,
					"color": [
							  "#ff7f0e",
							  "#2ca02c",
							  "#d62728",
							  "#9467bd",
							  "#8c564b",
							  "#e377c2",
							  "#7f7f7f",
							  "#bcbd22",
							  "#17becf"
							],
					"xAxis" : {
						"axisLabel" : "Date",
						"tickFormat" : function (d) {
							return d3.time.format("%d/%m/%Y")(new Date(d)); // jshint ignore:line
						}
					},
					"yAxis1": {
						"axisLabel": 'Displacement Maps (mm/year)',
						"tickFormat": function(d){
							return d3.format(',.1f')(d); // jshint ignore:line
						},
						"axisLabelDistance": 1
					},
					"yAxis2": {
						"axisLabel": 'Precipitations (mm/day)',
						"tickFormat": function(d) {
							return d3.format(',.f')(d); // jshint ignore:line
						},
						"axisLabelDistance": 10
					},
					//custom Tooltip
					"tooltip" : {
						enable : true,
						gravity : "e",
						duration : 100,
						snapDistance : 25 ,
						contentGenerator : function(d) {
											//console.log(d);
											var dataPoint = (d3.time.format("%d/%m/%Y")(d.value)); // jshint ignore:line
											if (typeof d.point!=='undefined'){
												return '<div id="circle" style="height=20px; width=20px;" ><a style="font-size: 20px; color: '+d.point.color+';" > &#x25CF;</a><b>'+dataPoint+'</b></div><b>&nbsp;Name: </b>'+d.point.key+'&nbsp;</br><b>&nbsp;Velocity:  </b> '+d.point.y+' mm/year ' ;
											} else{
												return '<div id="circle" style="height=20px; width=20px;" ><a style="font-size: 20px; color: #1e90ff; " > &#x25CF;</a><b>'+dataPoint+'</b></div><p>'+d.data.key+'<b>  '+d.data.y+' mm/day </b></p>' ;
											}

										}
					},
					"noData" : "Loading...",
					"showLegend" : false,
				},
				"title" : {
					enable : true,
					html : "Loading"
				},
				"subtitle" : {
					"enable" : false
				},
				"caption" : {
					"enable" : false
				}
			},
			"chartDataMeasureCount" : false, //flag to download weather only one time.
			"chartData" : [],
			"stringPeriod" : "",
			"lastDatePs" : 0,
			"firstDatePs" : new Date ().getTime(),
			"lat" : 0,
			"lon" : 0,
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
					generateChartData(ps)
				);
			} else {
				self.showPsTrends(false);
			}
		});





		/**
		 * Parameters:
		 * features - {Object}
		 *
		 * Returns:
		 */
		var generateChartData = function(ps){
			self.chartDataMeasureCount = false; // reset flag for download weather
			self.lastDatePs=0;					// reset LastDate(millisec.) value
			self.firstDatePs=new Date().getTime();					// reset FirstDate(millisec.) value
			self.lat=ps.point[1];
			self.lon=ps.point[0];
			var res = false;
			self.options.title.html = "<b>Displacements<b>";
			var deals=$scope.getUserDeals(); // get user contracts
			var point = [Math.round(self.lon*10000)/10000,Math.round(self.lat*10000)/10000];
			console.log("Total deals for selected point: ",deals.length);
			if(deals.length>0) // if exists at least one contract in the selected point
			{
				try {
				
				//get contracts start&end period 
				console.log("filter contracts for this point: ",point);
				self.stringPeriod ="";
				for (var i=0; i<deals.length; i++) {
					var condition = inside(point,deals[i].geom_geo_json.coordinates[0]);
					if(condition==true)
					{
						console.log("valore AFTER IF",condition);
						self.stringPeriod+=d3.time.format("%Y-%m-%d")(new Date(deals[i].start_period))+","+d3.time.format("%Y-%m-%d")(new Date(deals[i].end_period))+";";
					}
					
				}
				self.stringPeriod = self.stringPeriod.substring(0, self.stringPeriod.length - 1);
				console.log("Show period contracts in the selected point:",self.stringPeriod);
			
				getCity();  // get city info from Nomimatim and save in titleChart
				self.chartData = []; // Data is represented as an array of {x,y} pairs.
				var tableInfo = []; // PS details

				for (var i=0; i<ps.features.length; i++) {				
					if (ps.features[i].properties){
						var datasetId = eval("ps.features[i].properties."+datasetIdKey+";"); // jshint ignore:line
						var psId = eval("ps.features[i].properties."+psIdKey+";"); // jshint ignore:line
						self.chartData.push({
							"key" : ps.features[i].id,
							"type" : "line",
							"yAxis" : 1,
							"values" : getMeasures(datasetId,psId,ps.features[i].id) // values - represents the array of {x,y} data points
						});
						var featureInfo = {};
						for (var key in ps.features[i].properties) {
							if (key==="coherence")
							{
								eval("featureInfo." + key + " = 100*ps.features[\"" + i + "\"].properties." + key + ";"); // jshint ignore:line
							}else{
								eval("featureInfo." + key + " = ps.features[\"" + i + "\"].properties." + key + ";"); // jshint ignore:line
							}

						}
						featureInfo.color =  self.options.chart.color[i];
						tableInfo.push(featureInfo);
						//console.log(tableInfo);

					}
				}
				//Line chart data should be sent as an array of series objects.
				self.data = self.chartData;
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
			}else{
				return false;				// To do: notification to alert user.
			}
			
		};
		
		/**
		 * Check if a point belogs to a polygon.
		 * Parameters:
		 * features - {point,array of point}
		 *
		 * Returns: null (change the global chart title)
		 */
		
		function inside(point, vs) {
			var x = point[0], y = point[1];
			console.log(point);
			console.log(vs);
			var inside = false;
			for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
				var xi = vs[i][0], yi = vs[i][1];
				var xj = vs[j][0], yj = vs[j][1];

				var intersect = ((yi > y) != (yj > y))
					&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
				if (intersect) inside = !inside;
			}
			console.log(inside);
			return inside;
		};
		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var datasetIdKey = $scope.getOverlayMetadata("ps").custom.datasetid;
		var psIdKey = $scope.getOverlayMetadata("ps").custom.psid;

		var getMeasures = function (datasetid,psid,idComplete){
			
			var ret = [];
			var measureUrl = $scope.getOverlayMetadata("ps").custom.measureUrl;
			var dateKey = $scope.getOverlayMetadata("ps").custom.date;
			var measureKey = $scope.getOverlayMetadata("ps").custom.measure;
			
			var url = measureUrl.replace(datasetIdKey,datasetid).replace(psIdKey,psid)+"&periods="+self.stringPeriod; // set the url with global period 
			$http.get(url)
				.success(function (measures) { //if request is successful
					if ((measures!==null) && measures.length>0){
						
						for (var i=0; i<measures.length; i++) {
							var measureDate = new Date(eval("measures[i]."+dateKey+";")); // jshint ignore:line
							if (measureDate instanceof Date) {
								var milliTime = measureDate.getTime();
								if(self.lastDatePs < milliTime){				//update last valid date for PS
									self.lastDatePs = milliTime;
								}
								else if(self.firstDatePs > milliTime){
									self.firstDatePs = milliTime;
								}
								ret.push({
									"x" : measureDate,
									"y" : eval("measures[i]."+measureKey+";"), // jshint ignore:line
									"key" : idComplete
								});
							}
						}
					}
					if (self.chartDataMeasureCount === false)
					{
						var values = getWeather(); // get weather data
						self.chartData.push({
							"key" : "Precipitations",
							"yAxis" : 2,
							"type" : "bar",
							"values" : values,
							"color" : "#1e90ff"
						});
						self.chartDataMeasureCount = true;
					}
				})
				.error(function(){ //.error(function(data,status,headers,config){ //if request is not successful
					console.log("[ps-trends-controller] getMeasures :: ERROR");
				});
			return ret;
		};



		/**
		 * Parameters:
		 * features - {latitude,longitude}
		 *
		 * Returns: null (change the global chart title)
		 */
		var getCity = function(){
			var result="";
			var url = configuration.geocoder.urlReverse+'lat='+self.lat+'&lon='+self.lon+configuration.geocoder.paramsReverse;
			$http.get(url)
						.success(function (response) {
							//console.log(response);
							var city = response.address.city;
							if (typeof city!=='undefined'){
								result=city+', '+response.address.state+', '+response.address.country;
							} else {
								city=response.address.village;
								result=city+', '+response.address.state+', '+response.address.country;
							}
							//console.log("getCity:",result);
							self.options.title.html = "<b>Displacements<b></br>"+result+" [LAT: "+Math.round(self.lat*10000)/10000+"; LON: "+Math.round(self.lon*10000)/10000+"]";
						})
						.error(function(){
							console.log("[ps-trends-controller] getCity :: ERROR");
						});
		};

		/**
		 * Parameters:
		 * features - {String datasetId} it conteins the id of the city weather station
		 *
		 * Returns: array values with the date and the relative measure
		 */

		var getWeather = function(){

			var values = [];
			$http.get(configuration.weatherAPI.urlFoundStation+self.lat+","+self.lon)
					.success(function (response) {
							var station = response[0].id;
							var lastDatePs = d3.time.format("%Y-%m-%d")(new Date(self.lastDatePs)); // jshint ignore:line
							var firstDatePs = d3.time.format("%Y-%m-%d")(new Date(self.firstDatePs)); // jshint ignore:line
							$http.get(configuration.weatherAPI.urlGetWeatherFromStation+station+"/measures?type=RAIN&period="+firstDatePs+","+lastDatePs+"&aggregation=DAY")
							.success(function (response) {
								for (var i=0; i< response.length;i++) {
									var dateWeather = new Date(response[i].data);
									values.push({
										"x" : dateWeather ,
										"y": response[i].measure
									});

								}

							})
							.error(function (response) { // jshint ignore:line
								//HTTP STATUS != 200
								//do nothing
							});

					})
					.error(function (response) {// jshint ignore:line
						//HTTP STATUS != 200
						//do nothing
					});

			return values;


		};

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
