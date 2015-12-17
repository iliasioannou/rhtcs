'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FeatureInfoCtrl
 * @description
 * # FeatureInfoCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('FeatureInfoCtrl',['$rootScope','$scope','ArrayService',function($rootScope,$scope,ArrayService){
		
		var self = this; //this controller
		
		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */		
		angular.extend(self,{
			"overlayName" : "",
			"featureDetails" : [], // Feature details: array of "layerName" objects who have in thier "properties" KVP which are respectively fieldsName and records values
			"show_features" : false, // dialog box closure
			"showFeatures" : function (show){ // showFeatures hides this view and deletes OLs marker
				self.show_features = show;
				$rootScope.markerVisibility = show;
				if (!show){
					self.psDetails = [];
				}
			}
		});

		/**
		 * WATCHERS
		 */		
		// featureCollection watcher for rendering chart line data
		$scope.$watch("iffi",function(iffi){
			self.overlayName = $scope.getOverlayMetadata("iffi").legend.title;
			configurationLayers = $scope.getOverlayMetadata("iffi").custom.LAYERS;
			if ((iffi!==null) && (iffi.features!==null) && (iffi.features.length>0)) {
				self.showFeatures(
					generateData(iffi)
				);
			} else {
				self.showFeatures(false);
			}
		});

		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var configurationLayers = [];
		/**
		 * Parameters:
		 * features - {Object}
		 * 
		 * Returns:
		 */
		var generateData = function(featureCollection){
			var res = false;
			var layerList = []; // feature details
			try {
				// parse all features
				for (var i=0; i<featureCollection.features.length; i++) { 
					// retrieve features that have "properties" and "layerName" fields following geojson standard
					if ((featureCollection.features[i].properties) && (featureCollection.features[i].layerName)){ 
						//retrieve its layer name
						var layerName = featureCollection.features[i].layerName;
						if (configurationLayers.length>0){
							var index = ArrayService.getIndexByAttributeValue(configurationLayers,"id",layerName);
							layerName = configurationLayers[index].name;
						}
						// layer name must be not null
						if (layerName!==""){
							try {
								var record = {};
								var index = ArrayService.getIndexByAttributeValue(layerList,"layer",layerName);
								if (index===-1){ // add new layer with its first feature
									var attributes = [];
									for (var key in featureCollection.features[i].properties) {
										// layer attributes (i.e. name of its properties)
										if (key!==null){
											attributes.push(key);
											eval("record."+key+" = featureCollection.features[i].properties."+key+";");
										}
									}
									layerList.push({
										"layer" : layerName, // layer name (identifier)
										"attributes" : attributes,
										"records" : [record] // layer fileds
									});
								} else { // update existing layer with current feature
									for (var k=0; k<layerList[index].attributes.length; k++) { 
										eval("record."+layerList[index].attributes[k]+" = featureCollection.features[i].properties."+layerList[index].attributes[k]+";");
									}
									layerList[index].records.push(record);
								}
							} catch (e) {
								console.log("[feature-info-controller :: generateData] EXCEPTION : 'layerName' attribute doesn't exists!");
							} finally {
								// do nothing ... continue parsing other features!
							}
						}
					}
				}
				if (layerList.length>0){
					res = true;
				}
			} catch (e) {
				console.log("[feature-info-controller :: generateData] EXCEPTION : '"+e);
				layerList = []; // this empties the list if dirty
			} finally {
				self.featureDetails = layerList;
				if(!$scope.$$phase) {
					$scope.$apply();
				}
				return(res);
			}
		};
	}]);