'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('MainCtrl',['$rootScope','$scope','$http','olData','configuration','ArrayService',
	function ($rootScope,$scope,$http,olData,configuration,ArrayService){

		var self = this; //this controller

		var setCrossOrigin = function() { // Review "CrossOrigin" openlayers parameter from overlays configuration
			var overlays = configuration.layers.overlays.olLayers;
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
			{"name" : 'fullscreen', "active" : true}
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
			$scope.center.lon = (center.lon) ? center.lon : $scope.center.lon;
			$scope.center.lat = (center.lat) ? center.lat : $scope.center.lat;
			$scope.center.zoom = (center.zoom) ? center.zoom : $scope.center.zoom;
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
			return $scope.center.zoom>=configuration.map.query.zoom;
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
		
		var privateAOI=[];
		privateAOI.push({"name":"nick"});
		
		var setPrivateAOI = function(deals){
			$rootScope.privateAOI = [];
			angular.forEach(deals, function(aoi, index) {
				var obj = JSON.parse(aoi.geom_geo_json);
				
				$rootScope.privateAOI.push({
					"name" : aoi.product_name,
					"center" : {
						"lon" : getCoord(obj.coordinates[0], 0),
						"lat" : getCoord(obj.coordinates[0], 1),
						"zoom" : 14
					}
				});
			});
			
		};
		/**
		* array coord: arrey di coordinate
		* integer measure: specifica la coordinata su cui fare la media (0 per x, 1 per y)
		*/
		var getCoord= function(coord, measure) {
			var tot=0;
			angular.forEach(coord, function(value, index) {
				tot+= coord[index][measure];
			});
			return (tot / coord.length);
		};
		
		var getPrivateAOI = function(){
			return $rootScope.privateAOI;
		};
		
		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */		
		angular.extend(self,{
			"olDefaults" : olDefaults,
			"controls" : olControls,
			"view" : {}, // Openlayers view
			"marker" : {}, // OpenLayers Marker layer for PS query
			"baselayers" : configuration.layers.baselayers, // basemap layer list

			"overlays" : overlays, // overlay layer list
			"metadata" : configuration.layers.overlays.metadata // overlay layer list
		});

		/**
		 * EXPORT AS PUBLIC SCOPE
		 */
		angular.extend($scope,{
			// externalized scope variables for watchers
			"speedModel" : configuration.filters.speedSlider, // PS velocity filter
			"iffi" : null, // IFFI overlay getFeatureInfoResponse
			"sentinel" : null, // SENTINEL overlay getFeatureInfoResponse
			"ps" : null, // PS overlay getFeatureInfoResponse
			"center" : configuration.map.center, // for scope watcher reasons because "ols moveend event" makes ols too slow!
			// externalized scope methods for children controllers
			"setController" : setController,
			"getController" : getController,
			"setCenter" : setCenter,
			"getOverlayParams" : getOverlayParams,
			"getOverlayMetadata" : getOverlayMetadata,
			"showDetails" : showDetails,
			"getActiveBaselayer" : getActiveBaselayer,
			"getBaselayers" : getBaselayers,
			
			"getOverlays" : getOverlays,
			
			"dataLoading" : false,
			"logged" : $rootScope.logged,
			"username" : $rootScope.username,
			"error" : null,
			"setPrivateAOI" :  setPrivateAOI,
			"getPrivateAOI" : getPrivateAOI
		});
		
		/**
		 * WATCHERS
		 */
		//Switch PS layer
		$scope.$watch("center.zoom", function () {
			if (showDetails()){
				setSpeedModelFilter($scope.speedModel.init);
				getOverlayParams("ps").source.params.LAYERS = getOverlayMetadata("ps").custom.detail;
			} else {
				getOverlayParams("ps").source.params.CQL_FILTER = null;
				getOverlayParams("ps").source.params.LAYERS = getOverlayMetadata("ps").custom.heatmap;
			}
		});
		//speedModel init watcher for adjusting CQL_FILTER view source parameter
		$scope.$watch("speedModel.init", function (range) {
			setSpeedModelFilter(range);
		});
		//delete marker when status changes to false
		$rootScope.$watch("markerVisibility", function (visible) {
			if (!visible){
				initMarker();
			}
		});

		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var MAX_FEATURES = 5;
		var MAX_SENTINEL_MEASURES = 1000;
		//External Controller flag
		var activeController = "";
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

		var getFeatureInfo = function(map,coordinate,olLayerSource,infoFormat,featureCount,cqlFilter,resultObj,callback){
			var viewResolution = map.getView().getResolution();

			var wms = eval("new ol.source."+olLayerSource.type+"(olLayerSource);"); // jshint ignore:line
			var url = wms.getGetFeatureInfoUrl(coordinate,viewResolution,configuration.map.crs,{

				"INFO_FORMAT" : (infoFormat!=="") ? infoFormat : "application/json",
				"FEATURE_COUNT" : featureCount,
				"CQL_FILTER" : cqlFilter
			});	
			if (url) {
				var that = $scope; // jshint ignore:line
				$http.get(url)
					.success(function (response) {
						//TODO HTTP STATUS == 200 -- manage "ServiceException"
						var obj = {
							"point" : ol.proj.toLonLat(coordinate,configuration.map.crs),
							"features" : (response.features && (response.features.length>0)) ? response.features : null
						};
						if (resultObj!==""){
							eval("that."+resultObj+" = obj;"); // jshint ignore:line
						}


						if (callback!==null){
							callback(obj);
						}
					})
					.error(function (response) {
						//TODO HTTP STATUS != 200
					});
			} else {
				console.log("[main-controller :: getFeatureInfo] URL undefined!");
			}
		};
		//CQL_FILTER SETTER ON "VELOCITY" PS ATTRIBUTE
		var setSpeedModelFilter = function(range){
			if (showDetails()){ //proceed with filtering
				var min = "";
				if (range.split(";")[0]!==$scope.speedModel.from){
					min = "velocity>="+range.split(";")[0];
				}
				var max = "";
				if (range.split(";")[1]!==$scope.speedModel.to){
					max = "velocity<="+range.split(";")[1];
				}
				var cql_text = "";
				if ((min!=="") || (max!=="")){
					cql_text += (min!=="") ? min : "";
					cql_text += ((min!=="") && (max!=="")) ? " AND " : "";
					cql_text += (max!=="") ? max : "";
				}
				var cql_filter = (cql_text!=="") ? cql_text : null;
				getOverlayParams("ps").source.params.CQL_FILTER = cql_filter;
			}
		};
		//Creates OLS Layer Source from layer properties
		var getGetFeatureInfoOlLayerSource = function(l){
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
							idLayers += getOverlayMetadata(l.id).custom.LAYERS[i].id + ",";
						}
						if (idLayers!==""){
							idLayers = idLayers.substring(0, idLayers.length-1);
						}
						olLayer = {
							"type" : queryType,
							"url" : queryUrl,
							"params" : {
								"LAYERS" : idLayers
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

				var point = ol.proj.toLonLat(evt.coordinate,configuration.map.crs); // jshint ignore:line
				self.overlays.map(function(l) {
					if (l.active){
						switch(l.id) {
							case "iffi": //Progetto IFFI

								getFeatureInfo(map,evt.coordinate,getGetFeatureInfoOlLayerSource(l),"application/geojson",MAX_FEATURES,null,"iffi",setMarker);
								break;
							case "sentinel": // Sentinel 1 Datatset and timeline management
								var startDate = (configuration.timeSlider.domain.start!=="") ? configuration.timeSlider.domain.start : "2014-10-01T00:00:00Z"; // if empty string set on 01 Oct 2014
	
								// if empty string set on today's date 
								var endDate = (configuration.timeSlider.domain.end!=="") ? configuration.timeSlider.domain.end : d3.time.format("%Y-%m-%dT%H:%M:%SZ")(new Date()); // jshint ignore:line 
								var cqlFilter = "(("+configuration.timeSlider.attributes.CQL_FILTER.startDate+">="+startDate+") AND ("+configuration.timeSlider.attributes.CQL_FILTER.endDate+"<="+endDate+"))";
								getFeatureInfo(map,evt.coordinate,getGetFeatureInfoOlLayerSource(l),"",MAX_SENTINEL_MEASURES,cqlFilter,"sentinel",setMarker);
								break;
							case "ps":
								if (showDetails()){ //proceed with getFeatureInfo request
									getFeatureInfo(map,evt.coordinate,l.source,"",MAX_FEATURES,getOverlayParams("ps").source.params.CQL_FILTER,"ps",setMarker);
								} else {
									// do nothing
									//console.log("heatmap zoom level ... no features info to display!");
								}
								break;
							default:
								//do nothing
						}
					}
				});
			});

			map.on("moveend", function (evt) { //pan or zoom
				//do nothing
			});	
		});
		
		$rootScope.$watch("globals", function () {
			if ($rootScope.globals.currentUser) {
				$scope.setPrivateAOI($rootScope.globals.currentUser.deals);
			}		
		});

	}]);