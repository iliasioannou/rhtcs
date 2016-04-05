'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:PsTrendsCtrl
 * @description
 * # PsTrendsCtrl
 * PS Trends Controller for rheticus project
 */
angular.module('rheticus')
	.controller('PsTrendsCtrl',['$rootScope','$scope','configuration','$http','GeocodingService',function($rootScope,$scope,configuration,$http,GeocodingService){

		var self = this; //this controller
		var host = (configuration.rheticusAPI.host.indexOf("locationHost")!==-1)	? configuration.rheticusAPI.host.replace("locationHost",document.location.host)	: configuration.rheticusAPI.host;
		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */
		angular.extend(self,{
			"options" : { // PS Line chart options
				"chart" : {
					"type" : "multiChart",
					"height": 190,
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
						},
						"axisLabelDistance": 1,
						"tickPadding":10
					},
					"yAxis1": {
						"axisLabel": 'Displacement Maps (mm)',
						"tickFormat": function(d){
							return d3.format(',.1f')(d); // jshint ignore:line
						},
						"axisLabelDistance": 1,
						"ticks":5,
					},
					"yAxis2": {
						"axisLabel": 'Precipitations (mm/day)',
						"tickFormat": function(d) {
							return d3.format(',.1f')(d); // jshint ignore:line
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
								return '<div id="circle" style="height=20px; width=20px;" ><a style="font-size: 20px; color: '+d.point.color+';" > &#x25CF;</a><b>'+dataPoint+'</b></div><b>&nbsp;Name: </b>'+d.point.key+'&nbsp;</br><b>&nbsp;Displacement:  </b> '+d.point.y+' mm ' ;
							} else if(self.isCumulative30){
								return '<div id="circle" style="height=20px; width=20px;" ><a style="font-size: 20px; color: #1e90ff; " > &#x25CF;</a><b>'+dataPoint+'</b></div><p>'+d.data.key+'<b>  '+d.data.y+' mm/30 days </b></p>' ;
							}else if(self.isCumulative60){
								return '<div id="circle" style="height=20px; width=20px;" ><a style="font-size: 20px; color: #1e90ff; " > &#x25CF;</a><b>'+dataPoint+'</b></div><p>'+d.data.key+'<b>  '+d.data.y+' mm/60 days </b></p>' ;
							}else if(self.isCumulative90){
								return '<div id="circle" style="height=20px; width=20px;" ><a style="font-size: 20px; color: #1e90ff; " > &#x25CF;</a><b>'+dataPoint+'</b></div><p>'+d.data.key+'<b>  '+d.data.y+' mm/90 days </b></p>' ;
							}else if(self.isCumulative120){
								return '<div id="circle" style="height=20px; width=20px;" ><a style="font-size: 20px; color: #1e90ff; " > &#x25CF;</a><b>'+dataPoint+'</b></div><p>'+d.data.key+'<b>  '+d.data.y+' mm/120 days </b></p>' ;
							}else{
									return '<div id="circle" style="height=20px; width=20px;" ><a style="font-size: 20px; color: #1e90ff; " > &#x25CF;</a><b>'+dataPoint+'</b></div><p>'+d.data.key+'<b>  '+d.data.y+' mm/day </b></p>' ;
							}
						}
					},
					"noData" : "Loading...",
					"showLegend" : false,
				},
				"title" : {
					"enable" : true,
					"text" : "",
					"html" : "Loading"
				},
				"subtitle" : {
					"enable" : false
				},
				"caption" : {
					"enable" : false
				}
			},
			"comboboxModel" : null,
			"checkboxModelRegression" : null,
			"checkboxModelErrorFilter" : true,
			"checkboxModelView":false,
			"measureFound":true,
			"chartDataMeasureCount" : false, //flag to download weather only one time.
			"chartData" : [],
			"ps" : [],
			"psCandidate": [],
			"checkboxModel2": ['Daily','Cumulative 30 day','Cumulative 60 day','Cumulative 90 day','Cumulative 120 day'],
			"isRegressiveActivated" : false,
			"isFilterErrorActivated": true,
			"coherence":0,
			"isCumulative30" : true,
			"isCumulative60" : false,
			"isCumulative90" : false,
			"isCumulative120" : false,
			"yearCumulativeWeather" : 0,
			"stringPeriod" : "",
			"lastDatePs" : 0,
			"firstDatePs" : 0,
			"maxVelPs":0,
			"minVelPs":0,
			"psLength":0,
			"psTempLength":0,
			"lat" : 0,
			"lon" : 0,
			"data" : [], // PS line chart data
			"databkp" : [], // PS line chart data backup for speed refresh
			"databkpCount" : [], // PS line chart index backup for speed refresh
			"psDetails" : [], // PS feature details
			"show_trends" : false, // dialog box closure
			"showPsTrends" : function (show){ // showPsTrends hides this view and deletes OLs marker
				self.show_trends = show;
				$rootScope.markerVisibility = show;
				if (!show){
					self.data = [];
					self.psDetails = [];
					}
				},
			 "setRegressionView":function(){
				 self.isRegressiveActivated=!self.isRegressiveActivated;
				 if(self.psLength===1 && self.isRegressiveActivated)
 				{
					//minimi quadrati per la retta di interpolazione
 					var values=[];
 					var x=0,y=0,x2=0,y2=0,xy=0;
 					var coeff=0,q=0;
 					var i=0;
 					for (i=0;i<self.data[0].values.length;i++)
 					{
 						x+=new Date(self.data[0].values[i].x).getTime();
 						y+=self.data[0].values[i].y;
 						x2+=(self.data[0].values[i].x.getTime() * self.data[0].values[i].x.getTime());
 						y2+=(self.data[0].values[i].y * self.data[0].values[i].y);
 						xy+=(self.data[0].values[i].x.getTime() * self.data[0].values[i].y);

 					}
 					x=x/self.data[0].values.length;
 					y=y/self.data[0].values.length;
 					x2=x2/self.data[0].values.length;
 					y2=y2/self.data[0].values.length;
 					xy=xy/self.data[0].values.length;
 					coeff=(xy-(x*y))/(x2-(x*x));
 					q=y-(coeff*x);
 					var firstY=coeff*self.data[0].values[0].x+q;
 					var lastY=coeff*self.data[0].values[self.data[0].values.length-1].x+q;
 					if (self.isRegressiveActivated){
 						values.push({
 							"x" : self.data[0].values[0].x ,
 							"y": Math.round(firstY*100)/100,
 							"key" : "Interpolation"
 						});
 						values.push({
 							"x" : self.data[0].values[self.data[0].values.length-1].x ,
 							"y": Math.round(lastY*100)/100,
 							"key" : "Interpolation"
 						});
 						self.chartData.push({
 							"key" : "InterPolation",
 							"yAxis" : 1,
 							"type" : "line",
 							"values" : values,
 							"color" : "#00cc00"
 						});
 					}
				}else{
					for (var j=0;j<self.data.length;j++)
 					{
						if(self.data[j].key==="InterPolation")
						{
							self.data.splice( j, 1 );
						}
					}
				}
				 //generateChartData(self.ps);
			 },
			 "filterErrorView":function(){
				 self.isFilterErrorActivated=!self.isFilterErrorActivated;
				 if (self.psLength===1 && self.isFilterErrorActivated){
					 //minimi quadrati per la retta di interpolazione
						 self.databkp=[];
						 self.databkpCount=[];
  					var x=0,y=0,x2=0,y2=0,xy=0;
  					var coeff=0,q=0;
  					var i=0;
  					for (i=0;i<self.data[0].values.length;i++)
  					{
  						x+=new Date(self.data[0].values[i].x).getTime();
  						y+=self.data[0].values[i].y;
  						x2+=(self.data[0].values[i].x.getTime() * self.data[0].values[i].x.getTime());
  						y2+=(self.data[0].values[i].y * self.data[0].values[i].y);
  						xy+=(self.data[0].values[i].x.getTime() * self.data[0].values[i].y);

  					}
  					x=x/self.data[0].values.length;
  					y=y/self.data[0].values.length;
  					x2=x2/self.data[0].values.length;
  					y2=y2/self.data[0].values.length;
  					xy=xy/self.data[0].values.length;
  					coeff=(xy-(x*y))/(x2-(x*x));
  					q=y-(coeff*x);
					 var yaxisLinear;
					 var thresold= 2*Math.sqrt(Math.log(self.coherence));
					 console.log(thresold);
					 for (var c=0;c<self.data[0].values.length;c++){
						 yaxisLinear=coeff*self.data[0].values[c].x+q;
						 if(Math.abs((yaxisLinear-self.data[0].values[c].y))>thresold){
							 //console.log(self.data[0].values[c]);
							 self.databkp.push(self.data[0].values[c]);
							 self.databkpCount.push(c);
							 self.data[0].values.splice( c, 1 );

						 }
					 }

				 }else{
					 var j=0;
					 for (var k=0;k<self.databkp.length;k++){

						 //console.log(self.databkpCount[k]);
						 //console.log(self.databkp[k]);
					 		self.data[0].values.splice(self.databkpCount[k]+j,0,self.databkp[k]);
							j++;
				 		}

				 }
				 //generateChartData(self.ps);
			 },
			 "changeCumulativeView":function(){

				document.getElementById("CumulativeSelect").className ="";
				var combo = document.getElementById('CumulativeSelect');
				if(combo.selectedIndex===0){
					self.isCumulative30 =false;
					self.isCumulative60 =false;
					self.isCumulative90 =false;
					self.isCumulative120 =false;
				}else if (combo.selectedIndex===1) {
					self.isCumulative30 =true;
					self.isCumulative60 =false;
					self.isCumulative90 =false;
					self.isCumulative120 =false;
				}else if (combo.selectedIndex===2) {
					self.isCumulative30 =false;
					self.isCumulative60 =true;
					self.isCumulative90 =false;
					self.isCumulative120 =false;
				}else if (combo.selectedIndex===3) {
					self.isCumulative30 =false;
					self.isCumulative60 =false;
					self.isCumulative90 =true;
					self.isCumulative120 =false;
				}else if (combo.selectedIndex===4) {
					self.isCumulative30 =false;
					self.isCumulative60 =false;
					self.isCumulative90 =false;
					self.isCumulative120 =true;
				}

				for (var i=0;i<self.data.length;i++)
				{
					if(self.data[i].key==="Precipitations")
					{
						self.data.splice( i, 1 );
					}
				}

				var values = getWeather(); // get weather data
				self.chartData.push({
					"key" : "Precipitations",
					"yAxis" : 2,
					"type" : "bar",
					"values" : values,
					"color" : "#67C8FF"
				});

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
		$scope.$watch("psCandidate",function(psCandidate){
			if (psCandidate && (psCandidate!==null) && (psCandidate.features!==null) && (psCandidate.features.length>0)) {
				self.psCandidate=psCandidate;
				self.showPsTrends(
					generateChartDataCandidate(psCandidate)
				);
			} else {
				self.showPsTrends(false);
			}
		});
		// ps watcher for rendering chart line data
		$scope.$watch("ps",function(ps){
			if ((ps!==null) && (ps.features!==null) && (ps.features.length>0)) {
				self.ps=ps;
				self.showPsTrends(
					generateChartData(ps)
				);
			} else {
				self.showPsTrends(false);
			}
		});


		var calculateRegressionLine = function() {
			if(self.psLength===1 && self.isRegressiveActivated)
		 {
			 //minimi quadrati per la retta di interpolazione
			 var values=[];
			 var x=0,y=0,x2=0,y2=0,xy=0;
			 var coeff=0,q=0;
			 var i=0;
			 for (i=0;i<self.data[0].values.length;i++)
			 {
				 x+=new Date(self.data[0].values[i].x).getTime();
				 y+=self.data[0].values[i].y;
				 x2+=(self.data[0].values[i].x.getTime() * self.data[0].values[i].x.getTime());
				 y2+=(self.data[0].values[i].y * self.data[0].values[i].y);
				 xy+=(self.data[0].values[i].x.getTime() * self.data[0].values[i].y);

			 }
			 x=x/self.data[0].values.length;
			 y=y/self.data[0].values.length;
			 x2=x2/self.data[0].values.length;
			 y2=y2/self.data[0].values.length;
			 xy=xy/self.data[0].values.length;
			 coeff=(xy-(x*y))/(x2-(x*x));
			 q=y-(coeff*x);
			 var firstY=coeff*self.data[0].values[0].x+q;
			 var lastY=coeff*self.data[0].values[self.data[0].values.length-1].x+q;
			 if (self.isRegressiveActivated){
				 values.push({
					 "x" : self.data[0].values[0].x ,
					 "y": Math.round(firstY*100)/100,
					 "key" : "Interpolation"
				 });
				 values.push({
					 "x" : self.data[0].values[self.data[0].values.length-1].x ,
					 "y": Math.round(lastY*100)/100,
					 "key" : "Interpolation"
				 });
				 self.chartData.push({
					 "key" : "InterPolation",
					 "yAxis" : 1,
					 "type" : "line",
					 "values" : values,
					 "color" : "#00cc00"
				 });
			 }
		 }

		};

		var useNoiseFilter=function(){
			//console.log(self.isFilterErrorActivated);
			if (self.psLength===1 && self.isFilterErrorActivated){
				//minimi quadrati per la retta di interpolazione
					self.databkp=[];
					self.databkpCount=[];
				 var x=0,y=0,x2=0,y2=0,xy=0;
				 var coeff=0,q=0;
				 var i=0;
				 for (i=0;i<self.data[0].values.length;i++)
				 {
					 x+=new Date(self.data[0].values[i].x).getTime();
					 y+=self.data[0].values[i].y;
					 x2+=(self.data[0].values[i].x.getTime() * self.data[0].values[i].x.getTime());
					 y2+=(self.data[0].values[i].y * self.data[0].values[i].y);
					 xy+=(self.data[0].values[i].x.getTime() * self.data[0].values[i].y);
				 }
				 x=x/self.data[0].values.length;
				 y=y/self.data[0].values.length;
				 x2=x2/self.data[0].values.length;
				 y2=y2/self.data[0].values.length;
				 xy=xy/self.data[0].values.length;
				 coeff=(xy-(x*y))/(x2-(x*x));
				 q=y-(coeff*x);
					var yaxisLinear;
					var thresold= 2*Math.sqrt(Math.log(self.coherence));
					//console.log(thresold);
					for (var c=0;c<self.data[0].values.length;c++){
						yaxisLinear=coeff*self.data[0].values[c].x+q;
						if(Math.abs((yaxisLinear-self.data[0].values[c].y))>thresold){
							//console.log(self.data[0].values[c]);
							self.databkp.push(self.data[0].values[c]);
							self.databkpCount.push(c);
							self.data[0].values.splice( c, 1 );

						}
					}
				}
		};

		var setTitle = function (response,datasetId,psId) {
			//console.log("featureinfo_"+datasetId+"_"+psId);
			document.getElementById("featureinfo_"+datasetId+"_"+psId).title = response;
		};

		var setDatasetTitle = function(datasetId,psId){



			var getDatasetUrl = host+configuration.rheticusAPI.dataset.path;
			var _datasetidKey = configuration.rheticusAPI.dataset.datasetid;
			var urlGetDataset = getDatasetUrl
				.replace(_datasetidKey,datasetId);
			$http.get(urlGetDataset)
				.success(function (result) {
					var r = "PS: "+result.datasetid+"\n"+
					"Algorithm Name: "+result.algorithmname+"\n"+
					"Algorithm Description: "+result.algorithmdescription+"\n"+
					"Supermaster: "+result.supermaster+"\n"+
					"Timestamp Elaboration Start: "+result.timestampelaborationstart+"\n"+
					"Timestamp Elaboration End: "+result.timestampelaborationend;
					setTitle(r,datasetId,psId);
				});
		};

		/**
		 * Parameters:
		 * features - {Object}
		 *
		 * Returns:
		 */
		var generateChartData = function(ps){
			self.options.chart.noData = "Loading ...";
			self.chartDataMeasureCount = false; // reset flag for download weather
			self.currentWeather=[];
			self.data=[];
			self.maxVelPs=-100;
			self.minVelPs=100;
			self.lat=ps.point[1];
			self.lon=ps.point[0];
			var res = false;
			self.options.title.html = "";
			var deals=$scope.getUserDeals(); // get user contracts
			var point = [Math.round(self.lon*10000)/10000,Math.round(self.lat*10000)/10000];
			//console.log("Total deals for selected point: ",deals.length);
			//console.log("Deals for selected point: ",deals);
			if(deals.length>0) {// if exists at least one contract in the selected point
				try {//get contracts start&end period
					//console.log("filter contracts for this point: ",point);
					self.stringPeriod ="";
					var totalContract = 0 ;
					for (var d=0; d<deals.length; d++) {
						if(inside(point,deals[d].geom_geo_json.coordinates[0])){
							self.firstDatePs=new Date(deals[d].end_period).getTime();
							self.lastDatePs=0;
							totalContract++;
							self.stringPeriod+=d3.time.format("%Y-%m-%d")(new Date(deals[d].start_period))+","+d3.time.format("%Y-%m-%d")(new Date())+";"; // jshint ignore:line
							if(new Date(deals[d].end_period).getTime()<new Date().getTime()){
				      	self.stringPeriod+=d3.time.format("%Y-%m-%d")(new Date(deals[d].start_period))+","+d3.time.format("%Y-%m-%d")(new Date(deals[d].end_period))+";"; // jshint ignore:line
							}
						}
					}
					self.stringPeriod = self.stringPeriod.substring(0, self.stringPeriod.length - 1);
					//console.log("Show period contracts in the selected point:",self.stringPeriod);

					getCity();  // get city info from Nomimatim and save in titleChart
					self.chartData = []; // Data is represented as an array of {x,y} pairs.
					var tableInfo = []; // PS details

					var datasetidParamKey = configuration.rheticusAPI.measure.properties.datasetid;
					var psidParamKey = configuration.rheticusAPI.measure.properties.psid;

					for (var i=0; i<ps.features.length; i++) {
						self.psLength=ps.features.length;
						self.psTempLength=0;
						if (ps.features[i].properties){
							var datasetId = eval("ps.features[i].properties."+datasetidParamKey+";"); // jshint ignore:line
							var psId = eval("ps.features[i].properties."+psidParamKey+";"); // jshint ignore:line
							self.chartData.push({
								"key" : ps.features[i].id,
								"type" : "line",
								"yAxis" : 1,
								"values" : getMeasures(datasetId,psId,ps.features[i].id) // values - represents the array of {x,y} data points
							});
							var featureInfo = {};
							for (var key in ps.features[i].properties) {
								if (key==="coherence"){
									eval("featureInfo." + key + " = 100*ps.features[\"" + i + "\"].properties." + key + ";"); // jshint ignore:line
									self.coherence=featureInfo.coherence;
								} else {
									eval("featureInfo." + key + " = ps.features[\"" + i + "\"].properties." + key + ";"); // jshint ignore:line
								}
							}
							featureInfo.color =  self.options.chart.color[i];
							setDatasetTitle(datasetId,psId);
							tableInfo.push(featureInfo);
							//console.log(tableInfo);
						}
					}

					//Line chart data should be sent as an array of series objects.

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
			} else {
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
			//console.log(point);
			//console.log(vs);
			var isInside = false;
			for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
				var xi = vs[i][0], yi = vs[i][1];
				var xj = vs[j][0], yj = vs[j][1];
				var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
				if (intersect) {
					isInside = !isInside;
				}
			}
			//console.log(isInside);
			return isInside;
		}

		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var getMeasureUrl = host+configuration.rheticusAPI.measure.path;
		var datasetidKey = configuration.rheticusAPI.measure.datasetid;
		var psidKey = configuration.rheticusAPI.measure.psid;
		var periodsKey = configuration.rheticusAPI.measure.periods;

		var getMeasures = function (datasetid,psid,idComplete){
			var ret = [];
			// set the url with global period
			var url = getMeasureUrl
				.replace(datasetidKey,datasetid)
				.replace(psidKey,psid)
				.replace(periodsKey,self.stringPeriod);

			$http.get(url)
				.success(function (measures) { //if request is successful


					var dateParamKey = configuration.rheticusAPI.measure.properties.date;
					var measureParamKey = configuration.rheticusAPI.measure.properties.measure;
					if ((measures!==null) && measures.length>0){
						for (var i=0; i<measures.length; i++) {
							var measureDate = new Date(eval("measures[i]."+dateParamKey+";")); // jshint ignore:line
							if(measures[i].measure<self.minVelPs){
								self.minVelPs=measures[i].measure;
							}
							if (measures[i].measure>self.maxVelPs) {
								self.maxVelPs=measures[i].measure;
							}

							if (measureDate instanceof Date) {
								var milliTime = measureDate.getTime();
								if(self.lastDatePs < milliTime){				//update last valid date for PS
									self.lastDatePs = milliTime;
								}
								if(self.firstDatePs > milliTime){
									self.firstDatePs = milliTime;
								}
								ret.push({
									"x" : measureDate,
									"y" : eval("measures[i]."+measureParamKey+";"), // jshint ignore:line
									"key" : idComplete
								});
							}
						}
						self.psTempLength ++;
						self.measureFound=true;
						updateyDomain1();
					}
					if (!self.chartDataMeasureCount && measures.length>0){
						var values = getWeather(); // get weather data
						self.chartData.push({
							"key" : "Precipitations",
							"yAxis" : 2,
							"type" : "bar",
							"values" : values,
							"color" : "#67C8FF"
						});
						self.chartDataMeasureCount = true;
					}else if (measures.length===0){
						self.options.chart.noData = "Your subscrition does not include this point.";
						self.checkboxModelView=false;
						self.measureFound=false;
					}
				})
				.error(function(){ //.error(function(data,status,headers,config){ //if request is not successful
					console.log("[ps-trends-controller] getMeasures :: ERROR");
				});
			return ret;
		};

		var updateyDomain1 = function(){
			if(self.psTempLength===self.psLength)
			{
				//console.log("lunghezza temp ps",self.psTempLength);
				var delta=Math.abs(self.maxVelPs-self.minVelPs);
				//console.log("delta",delta);
				if(delta<20)
				{
					self.options.chart.yDomain1=[self.minVelPs-(20-delta)/2,self.maxVelPs+(20-delta)/2];
					self.options.chart.yAxis1.showMaxMin=false;
				//	console.log("added",self.options.chart.yDomain1);
				}else{
					self.options.chart.yDomain1=[self.minVelPs,self.maxVelPs];
					self.options.chart.yAxis1.showMaxMin=true;
				//	console.log("normal",self.options.chart.yDomain1);
				}
				self.data = self.chartData;
				if(self.psLength===1){
					self.checkboxModelView=true;
				}else{
					self.checkboxModelView=false;
				}

				calculateRegressionLine();
				useNoiseFilter();

				}




		};
		var getCity = function(){
			GeocodingService.reverse(
				{"lon":self.lon,"lat":self.lat},
				getCityCallback
			);
		};

		var getCityCallback = function(result){
			self.options.title.html = result+" [LAT: "+Math.round(self.lat*10000)/10000+"; LON: "+Math.round(self.lon*10000)/10000+"]";
		};

		/**
		 * Parameters:
		 *
		 * Returns: array values with the date and the relative measure
		 */
		var getWeather = function(){
			var values = [];
			var currentWeatherValue=0;
			var currentWeatherValue30=0;
			var currentWeatherValue60=0;
			var currentWeatherValue90=0;
			var currentWeatherValue120=0;
			var getStationIdUrl = host+configuration.rheticusAPI.weather.getStationId.path;
			var latKey = configuration.rheticusAPI.weather.getStationId.lat;
			var lonKey = configuration.rheticusAPI.weather.getStationId.lon;
			var url1 = getStationIdUrl
				.replace(latKey,self.lat)
				.replace(lonKey,self.lon);

			$http.get(url1)
				.success(function (response) {
					var station = response[0].id;
					var lastDatePs = d3.time.format("%Y-%m-%d")(new Date(self.lastDatePs)); // jshint ignore:line
					var firstDatePs = d3.time.format("%Y-%m-%d")(new Date(self.firstDatePs)); // jshint ignore:line
					var getWeatherMeasuresByStationIdUrl = host+configuration.rheticusAPI.weather.getWeatherMeasuresByStationId.path;
					var stationidKey = configuration.rheticusAPI.weather.getWeatherMeasuresByStationId.stationid;
					var begindateKey = configuration.rheticusAPI.weather.getWeatherMeasuresByStationId.begindate;
					var enddateKey = configuration.rheticusAPI.weather.getWeatherMeasuresByStationId.enddate;
					var url2 = getWeatherMeasuresByStationIdUrl
						.replace(stationidKey,station)
						.replace(begindateKey,firstDatePs)
						.replace(enddateKey,lastDatePs);

					$http.get(url2)
						.success(function (response) {
							var j=0;
							for (var i=0; i< response.length;i++) {
								var dateWeather = new Date(response[i].day);
									currentWeatherValue+=Math.round(response[i].measure);
									if(self.isCumulative30){
										if(i<30){
											values.push({
												"x" : dateWeather ,
												"y": currentWeatherValue
											});
											//console.log(currentWeatherValue);
										}else{
											currentWeatherValue30=0;
											for (j=i; j> i-30;j--) {
												currentWeatherValue30+=Math.round(response[j].measure);
											}
											//console.log(currentWeatherValue30);
											values.push({
												"x" : dateWeather ,
												"y": currentWeatherValue30
											});
										}

									}else if(self.isCumulative60){
										if(i<60){
											values.push({
												"x" : dateWeather ,
												"y": currentWeatherValue
											});
											//console.log(currentWeatherValue);
										}else{
											currentWeatherValue60=0;
											for (j=i; j> i-60;j--) {
												currentWeatherValue60+=Math.round(response[j].measure);
											}
											//console.log(currentWeatherValue60);
											values.push({
												"x" : dateWeather ,
												"y": currentWeatherValue60
											});
										}
									}else if(self.isCumulative90){
											if(i<90){
												values.push({
													"x" : dateWeather ,
													"y": currentWeatherValue
												});
												//console.log(currentWeatherValue);
											}else{
												currentWeatherValue90=0;
												for (j=i; j> i-90;j--) {
													currentWeatherValue90+=Math.round(response[j].measure);
												}
												//console.log(currentWeatherValue90);
												values.push({
													"x" : dateWeather ,
													"y": currentWeatherValue90
												});
											}
										}else if(self.isCumulative120){
												if(i<120){
													values.push({
														"x" : dateWeather ,
														"y": currentWeatherValue
													});
													//console.log(currentWeatherValue);
												}else{
													currentWeatherValue120=0;
													for (j=i; j> i-120;j--) {
														currentWeatherValue120+=Math.round(response[j].measure);
													}
													//console.log(currentWeatherValue120);
													values.push({
														"x" : dateWeather ,
														"y": currentWeatherValue120
													});
												}
											}else{
										values.push({
											"x" : dateWeather ,
											"y": response[i].measure
										});
										}



						}})
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

		var generateChartDataCandidate = function(psCandidate){
			self.options.chart.noData = "Your subscrition does not include this point.";
			self.checkboxModelView=false;
			self.measureFound=false;
			self.data=[];
			self.lat=psCandidate.point[1];
			self.lon=psCandidate.point[0];
			self.options.title.html = "";
			var point = [Math.round(self.lon*10000)/10000,Math.round(self.lat*10000)/10000];
			//console.log("Total deals for selected point: ",deals.length);
			//console.log("Deals for selected point: ",deals);
			getCity();  // get city info from Nomimatim and save in titleChart
			var tableInfo = []; // PS details
			var datasetidParamKey = configuration.rheticusAPI.measure.properties.datasetid;
			var psidParamKey = configuration.rheticusAPI.measure.properties.psid;

			for (var i=0; i<psCandidate.features.length; i++) {
				self.psLength=psCandidate.features.length;
				self.psTempLength=0;
				if (psCandidate.features[i].properties){
					var datasetId = eval("psCandidate.features[i].properties."+datasetidParamKey+";"); // jshint ignore:line
					var psId = eval("psCandidate.features[i].properties."+psidParamKey+";"); // jshint ignore:line

					var featureInfo = {};
					for (var key in psCandidate.features[i].properties) {
						if (key==="coherence"){
							eval("featureInfo." + key + " = 100*psCandidate.features[\"" + i + "\"].properties." + key + ";"); // jshint ignore:line
							self.coherence=featureInfo.coherence;
						} else {
							eval("featureInfo." + key + " = psCandidate.features[\"" + i + "\"].properties." + key + ";"); // jshint ignore:line
						}
					}
					featureInfo.color =  self.options.chart.color[i];
					setDatasetTitle(datasetId,psId);
					tableInfo.push(featureInfo);
					//console.log(tableInfo);
				}


				//Line chart data should be sent as an array of series objects.
				self.psDetails = tableInfo;
				if(!$scope.$$phase) {
					$scope.$apply();
				}

			}
			return true;
		};






	}]);
