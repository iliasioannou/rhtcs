'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MainCtrl
 * @description
 * # MainCtrl
 * Main Controller for rheticus project
 */
angular.module('rheticus')
	.controller('MainCtrl',['$rootScope','$scope','$http','olData','ArrayService','SpatialService','Flash',
	function ($rootScope,$scope,$http,olData,ArrayService,SpatialService,Flash){

		var self = this; //this controller

		var setCrossOrigin = function() { // Review "CrossOrigin" openlayers parameter from overlays configuration
			var overlays = $rootScope.configurationCurrentHost.layers.overlays.olLayers;
			for(var o=0; o<overlays.length; o++){
				overlays[o].source.crossOrigin = (overlays[o].source.crossOrigin && (overlays[o].source.crossOrigin==="null")) ? null : "";
			}
			return overlays;
		};
		var overlays = setCrossOrigin();

		/**
		 * PUBLIC VARIABLES AND METHODS
		 */
		// OpenLayers Default Events
		var olDefaults = {
			"events" : {
				"map" : ["moveend", "click"],
				"layers" : ["click"]
			},
			"interactions" : {
				"mouseWheelZoom" : true
			}
		};
		// Openlayers controls
		var olControls = [
			//{"name" : 'zoom', "active" : true}, // TBC ...duplicate in view
			{"name" : 'rotate', "active" : true},
			{"name" : 'zoomtoextent', "active" : false},
			//{"name" : 'zoomslider', "active" : true},
			{"name" : 'scaleline', "active" : true},
			{"name" : 'attribution', "active" : true},
		];
		//External Controller management : GETTER and SETTER
		var setController = function(openController){
			activeController = (activeController===openController) ? "" : openController;
		};
		var getController = function(openController){
			return activeController===openController;
		};
		//Setter map view center
		var setCenter = function(center){
			$scope.center.lon = (center.lon && !isNaN(center.lon)) ? center.lon : $scope.center.lon;
			$scope.center.lat = (center.lat && !isNaN(center.lat)) ? center.lat : $scope.center.lat;
			$scope.center.zoom = (center.zoom && !isNaN(center.zoom)) ? center.zoom : $scope.center.zoom;
		};
		// Setter map view extent on GeoJSON bounds
		var setMapViewExtent = function(geometryType,geoJSON){
			if (geoJSON && (geoJSON!==null)){
				var geom = eval("new ol.geom."+geometryType+"(geoJSON);"); // jshint ignore:line
				var extent = geom.getExtent();
				extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857")); // jshint ignore:line
				olData.getMap().then(function (map) {
					map.getView().fit(extent, map.getSize());
				});
			}
		};
		//Getter overlay ols parameters
		var getOverlayParams = function(id){
			return getOverlay("overlays",id);
		};
		//Getter overlay config metadata
		var getOverlayMetadata = function(id){
			return getOverlay("metadata",id);
		};
		// check on zoom level to enable getFeatureInfo query on PS
		var showDetails = function() {
			return $scope.center.zoom>=$rootScope.configurationCurrentHost.map.query.zoom;
		};
		//Getter active baselayer useful for basemap controller
		var getActiveBaselayer = function() {
			return self.baselayers[ArrayService.getIndexByAttributeValue(self.baselayers,"active",true)];
		};
		var getBaselayers = function() {
			return self.baselayers;
		};
		var getOverlays = function() {
			return self.overlays;
		};
		var userDeals = [];
		var getUserDeals = function(){
			return userDeals;
		};
		var setSentinelExtent = function(geojson) {
			getOverlayParams("sentinel").source = {
				"type": "GeoJSON",
				"geojson": {
					"projection": "EPSG:3857",
					"object": {
						"type": "FeatureCollection",
						"features": [{
							"type": "Feature",
							"id": "sentinel",
							"properties": {
								"name": "Sentinel"
							},
							"geometry": {
								"type": "MultiPolygon",
								"coordinates": geojson
							}
						}]
					}
				}
			};
			if (getFeatureInfoPoint.length>0 && geojson.length>0){
				setCenter({
					"lon" : getFeatureInfoPoint[0],
					"lat" : getFeatureInfoPoint[1],
					"zoom" : 7
				});
			}
		};

		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */
		angular.extend(self,{
			"olDefaults" : olDefaults,
			"controls" : olControls,
			"view" : {}, // Openlayers view
			"marker" : {}, // OpenLayers Marker layer for PS query
			"baselayers" : $rootScope.configurationCurrentHost.layers.baselayers,
			"overlays" : overlays, // overlay layer list
			"metadata" : $rootScope.configurationCurrentHost.layers.overlays.metadata // overlay layer list
		});

		/**
		 * EXPORT AS PUBLIC SCOPE
		 */
		angular.extend($scope,{
			// externalized scope variables for watchers
			"speedModel" : $rootScope.configurationCurrentHost.filters.speedSlider, // PS speed filter
			"coherenceModel" : $rootScope.configurationCurrentHost.filters.coherenceSlider, // PS coherence filter
			"iffi" : null, // IFFI overlay getFeatureInfoResponse
			"sentinel" : null, // SENTINEL overlay getFeatureInfoResponse
			"ps" : null, // PS overlay getFeatureInfoResponse
			"center" : $rootScope.configurationCurrentHost.map.center, // for scope watcher reasons because "ols moveend event" makes ols too slow!
			// externalized scope methods for children controllers
			"setController" : setController,
			"getController" : getController,
			"setMapViewExtent" : setMapViewExtent,
			"getOverlayParams" : getOverlayParams,
			"getOverlayMetadata" : getOverlayMetadata,
			"showDetails" : showDetails,
			"getActiveBaselayer" : getActiveBaselayer,
			"getBaselayers" : getBaselayers,
			"getOverlays" : getOverlays,
			"getUserDeals" : getUserDeals,
			"setSentinelExtent" : setSentinelExtent
		});

		/**
		 * WATCHERS
		 */
		//speedModel init watcher for adjusting CQL_FILTER view source parameter
		$scope.$watch("speedModel.init", function (range) {
			setSpeedModelFilter(range);
			applyFiltersToMap();
		});
		//coherenceModel init watcher for adjusting CQL_FILTER view source parameter
		$scope.$watch("coherenceModel.init", function (range) {
			setCoherenceModelFilter(range);
			applyFiltersToMap();
		});
		//delete marker when status changes to false
		$rootScope.$watch("markerVisibility", function (visible) {
			if (!visible){
				initMarker();
			}
		});
		//update user details on login change status
		$rootScope.$watch("login.details", function () {
			setUserDeals(
				(($rootScope.login.details!==null) && $rootScope.login.details.info) ? $rootScope.login.details.info : null
			);
			$scope.$broadcast("setSwitchPanelUserDeals",{"userDeals":userDeals});
		});

		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var MAX_FEATURES = 5;
		var MAX_SENTINEL_MEASURES = 1000;
		//External Controller flag
		var activeController = "";
		var getFeatureInfoPoint = [];
		//Retrieves Overlay ols params or metadata detail
		var getOverlay = function(detail,id){
			var index = ArrayService.getIndexByAttributeValue(self.overlays,"id",id); // jshint ignore:line
			return eval("self."+detail+"[index]"); // jshint ignore:line
		};
		//Marker
		var setMarker = function(response) { // Marker and PS trends management
			self.marker = {
				"lat" : response.point[1],
				"lon" : response.point[0],
				"label": {
					"message": "",
					"show": false,
					"showOnMouseOver": true
				}
			};
		};
		var initMarker = function(){
			setMarker({
				"point" : [99999,99999]
			});
		};
		//GetFeatureInfo
		var getFeatureInfo = function(map,coordinate,olLayer,olParams,resultObj,callback){
			getFeatureInfoPoint = ol.proj.toLonLat(coordinate,$rootScope.configurationCurrentHost.map.crs); // jshint ignore:line
			var viewResolution = map.getView().getResolution();
			var wms = eval("new ol.source."+olLayer.source.type+"(olLayer.source);"); // jshint ignore:line
			var url = wms.getGetFeatureInfoUrl(coordinate,viewResolution,$rootScope.configurationCurrentHost.map.crs,olParams);
			if (url) {
				var that = $scope; // jshint ignore:line
				$http.get(url)
					.success(function (response) {
						if (!response.features){ //HTTP STATUS == 200 -- no features returned or "ServiceException"
							Flash.create('warning', "Layer \""+olLayer.name+"\" returned no features!");
						} else {
							Flash.dismiss();
							var obj = {
								"point" : ol.proj.toLonLat(coordinate,$rootScope.configurationCurrentHost.map.crs), // jshint ignore:line
								"features" : (response.features.length>0) ? response.features : null
							};
							if (resultObj!==""){
								eval("that."+resultObj+" = obj;"); // jshint ignore:line
							}
							if ((callback!==undefined) && (typeof callback==="function")){
								callback(obj);
							}
						}
					})
					.error(function (response) {// jshint ignore:line
						//HTTP STATUS != 200
						Flash.create('danger', "Layer \""+olLayer.name+"\" returned an error!!");
					});
			} else {
				console.log("[main-controller :: getFeatureInfo] URL undefined!");
			}
		};
		var advancedCqlFilters = {
			"velocity" : "",
			"coherence" : "",
			"spatial" : ""
		};
		var applyFiltersToMap = function(){
			var cqlFilter = null;
			for (var key in advancedCqlFilters) {
				if (advancedCqlFilters.hasOwnProperty(key) && (advancedCqlFilters[key]!=="")) {
					if (cqlFilter!==null){
						cqlFilter += " AND "; //Add "AND" condition with prevoius item
					} else {
						cqlFilter = ""; //initialize as empty String
					}
					cqlFilter += advancedCqlFilters[key]; //Add new condition to cqlFilter
				}
			}
			getOverlayParams("ps").source.params.CQL_FILTER = cqlFilter;
		};
		var getCqlTextRange = function(minText, maxText){
			var cqlText = "";
			if ((minText!=="") || (maxText!=="")){
				cqlText += (minText!=="") ? minText : "";
				cqlText += ((minText!=="") && (maxText!=="")) ? " AND " : "";
				cqlText += (maxText!=="") ? maxText : "";
			}
			return cqlText;
		};
		//CQL_FILTER SETTER ON "VELOCITY" PS ATTRIBUTE
		var setSpeedModelFilter = function(range){
			var min = "";
			if (parseInt(range.split(";")[0])!==$scope.speedModel.from){
				min = "velocity>="+range.split(";")[0];
			}
			var max = "";
			if (parseInt(range.split(";")[1])!==$scope.speedModel.to){
				max = "velocity<="+range.split(";")[1];
			}
			advancedCqlFilters.velocity = getCqlTextRange(min,max);
		};
		//CQL_FILTER SETTER ON "COHERENCE" PS ATTRIBUTE
		var setCoherenceModelFilter = function(range){
			var min = "";
			if (parseInt(range.split(";")[0])!==$scope.coherenceModel.from){
				min = "coherence>="+range.split(";")[0]/100;
			}
			var max = "";
			if (parseInt(range.split(";")[1])!==$scope.coherenceModel.to){
				max = "coherence<="+range.split(";")[1]/100;
			}
			advancedCqlFilters.coherence = getCqlTextRange(min,max);
		};
		//Creates OLS Layer Source from layer properties
		var getGetFeatureInfoOlLayer = function(l){
			var queryUrl = getOverlayMetadata(l.id).queryUrl;
			var olLayer = null;
			if (queryUrl==="") {
				olLayer = l;
			} else {
				var queryType = getOverlayMetadata(l.id).type;
				switch(queryType) {
					case "ImageWMS":
						var idLayers = "";
						for (var i=0; i<getOverlayMetadata(l.id).custom.LAYERS.length; i++) {
							if (getOverlayMetadata(l.id).custom.LAYERS[i].queryable){
								idLayers += getOverlayMetadata(l.id).custom.LAYERS[i].id + ",";
							}
						}
						if (idLayers!==""){
							idLayers = idLayers.substring(0, idLayers.length-1);
						}
						olLayer = {
							"id" : l.id,
							"name" : l.name,
							"source" : {
								"type" : queryType,
								"url" : queryUrl,
								"params" : {
									"LAYERS" : idLayers
								}
							}
						};
						break;
					case "RheticusApiRest":
						//do nothing
						break;
					default:
						//do nothing
				}
			}
			return(olLayer);
		};
		//OLS Map interation
		olData.getMap().then(function (map) {
			//singleclick event
			map.on("singleclick", function (evt) {
				var point = ol.proj.toLonLat(evt.coordinate,$rootScope.configurationCurrentHost.map.crs); // jshint ignore:line
				self.overlays.map(function(l) {
					if (l./*active*/visible){
						Flash.create("info", "Loading results for \""+getOverlayMetadata(l.id).legend.title+"\" ...");
						var params = null;
						switch(l.id) {
							case "iffi": //Progetto IFFI
								params = {
									"INFO_FORMAT" : "application/geojson",
									"FEATURE_COUNT" : MAX_FEATURES
								};
								getFeatureInfo(map,evt.coordinate,getGetFeatureInfoOlLayer(l),params,"iffi",setMarker);
								break;
							case "sentinel": // Sentinel 1 Datatset and timeline management
								//var startDate = (configuration.timeSlider.domain.start!=="") ? configuration.timeSlider.domain.start : "2014-10-01T00:00:00Z"; // if empty string set on 01 Oct 2014
								// if empty string set on today's date
								//var endDate = (configuration.timeSlider.domain.end!=="") ? configuration.timeSlider.domain.end : d3.time.format("%Y-%m-%dT%H:%M:%SZ")(new Date()); // jshint ignore:line
								params = {
									"INFO_FORMAT" : "application/json",
									"FEATURE_COUNT" : MAX_SENTINEL_MEASURES
									//"TIME" : startDate+"/"+endDate
								};
								getFeatureInfo(map,evt.coordinate,getGetFeatureInfoOlLayer(l),params,"sentinel",setMarker);
								break;
							case "ps":
								if (showDetails()){ //proceed with getFeatureInfo request
									params = {
										"INFO_FORMAT" : "application/json",
										"FEATURE_COUNT" : MAX_FEATURES,
										"CQL_FILTER" : getOverlayParams("ps").source.params.CQL_FILTER
									};
									getFeatureInfo(map,evt.coordinate,getGetFeatureInfoOlLayer(l),params,"ps",setMarker);
								} else {
									Flash.create("warning", "At this level of zoom isn't possible to display feature info for \""+getOverlayMetadata("ps").legend.title+"\"!");
								}
								break;
							default:
								//do nothing
						}
					}
				});
			});

			map.on("moveend", function (evt) { // jshint ignore:line
				//pan or zoom event
				$scope.$broadcast("setFeatureInfoClosure");
				$scope.$broadcast("setPsTrendsClosure");
				$scope.$broadcast("setTimelineClosure");
				if ($scope.$parent.showHelp){
					$scope.$parent.showHelp = false;
				}
			});
		});

		//CQL_FILTER SETTER ON "SPATIAL" PS
		var setSpatialFilter = function(){
			var cqlFilter = "";
			for(var i=0; i<userDeals.length; i++){
				if (userDeals[i].geom_geo_json!==null){
					if (cqlFilter!==""){
						cqlFilter += " OR ";
					}
					var cqlText = SpatialService.getIntersectSpatialFilterCqlText(
						userDeals[i].geom_geo_json.type,
						userDeals[i].geom_geo_json.coordinates
					);
					if (cqlText!==""){
						if (userDeals[i].sensorid!==""){
							cqlText = "("+cqlText+" AND (sensorid='"+userDeals[i].sensorid+"')"+")";
						}
						cqlFilter += cqlText;
					}
				}
			}
			advancedCqlFilters.spatial = (cqlFilter!=="") ? "("+cqlFilter+")" : "";
		};
		//User deals management
		var setUserDeals = function(info){
			userDeals = [];
			if ((info!==null) && info.deals && (info.deals.length>0)){
				angular.forEach(info.deals,
					function(item) {
						var coords = (item.geom_geo_json && item.geom_geo_json!=="") ? JSON.parse(item.geom_geo_json) : null;
						userDeals.push({
							"signature_date" : (item.signature_date && item.signature_date!=="") ? item.signature_date : "",
							"product_id" : (item.product_id && item.product_id!=="") ? item.product_id : -1,
							"product_name" : (item.product_name && item.product_name!=="") ? item.product_name : "",
							"geom_geo_json" : coords, //geojson Object
							"sensorid" : (item.sensorid && item.sensorid!=="") ? item.sensorid : "",
							"start_period" : (item.start_period && item.start_period!=="") ? item.start_period : "",
							"end_period" : (item.end_period && item.end_period!=="") ? item.end_period : ""
						});
					}
				);
			}
			setSpatialFilter();
			applyFiltersToMap();
		};

	}]);
