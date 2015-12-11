'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:SwitchPanelCtrl
 * @description
 * # SwitchPanelCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('SwitchPanelCtrl',['$scope','configuration',function ($scope,configuration){

		var self = this; //this controller

		/**
		 * PUBLIC VARIABLES AND METHODS
		 */
		var minimize = function(){
			self.isCollapsed = !self.isCollapsed;
		};
		//PS
		var switchOverlayPs = function(){
			toggleOverlay("ps");
		};
		var viewPanelPs = function(){
			viewPanel("ps");
		};
		var viewPanelPsProviders = function(){
			viewPanel("ps_provider");
		};
		var viewPanelPsAoi = function(){
			viewPanel("ps_aoi");
		};
		var updateSelectionArea = function(position, entities) {
			angular.forEach(entities, function(subscription, index) {
				if (position === index) {
					$scope.setCenter({
						"lon" : self.aoi[position].center.lon,
						"lat" : self.aoi[position].center.lat,
						"zoom" : self.aoi[position].center.zoom
					});
				}
			});
		};
		var updateSelection = function(position, entities) {
			angular.forEach(entities, function(subscription, index) {
				if (position !== index) {
					subscription.checked = false;
				}
			});
		};
		//IFFI
		var switchOverlayIffi = function(){
			toggleOverlay("iffi");
		};
		var viewPanelIffi = function(){
			viewPanel("iffi");
		};
		//SENTINEL
		var switchOverlaySentinel = function(){
			toggleOverlay("sentinel");
		};
		var viewPanelSentinel = function(){ 
			viewPanel("sentinel");
		};
		
		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */	
		angular.extend(self,{
			"ps" : $scope.getOverlayParams("ps"),
			"ps_metadata" : $scope.getOverlayMetadata("ps"),
			"iffi" : $scope.getOverlayParams("iffi"),
			"iffi_metadata" : $scope.getOverlayMetadata("iffi"),
			"sentinel" : $scope.getOverlayParams("sentinel"),
			"sentinel_metadata" : $scope.getOverlayMetadata("sentinel")
		});
		angular.extend(self,{
			//Tab controls
			"isCollapsed" : true, // not minimize
			"minimize" : minimize,
			//PS
			"show_panel_ps" : self.ps.active,
			"show_panel_ps_provider" : false,
			"show_panel_ps_aoi" : false,
			"view_overlay_ps" : self.ps.active, // overlay visibility
			"ps_layer_visibility_text" : self.ps.active ? "Layer off" : "Layer on",
			"dataProviders" : configuration.dataProviders, // data rpoviders
			"aoi" : configuration.aoi, //aoi
			"switchOverlayPs" : switchOverlayPs,
			"viewPanelPs" : viewPanelPs,
			"viewPanelPsProviders" : viewPanelPsProviders,
			"viewPanelPsAoi" : viewPanelPsAoi,
			"updateSelectionArea" : updateSelectionArea,
			"updateSelection" : updateSelection,
			//IFFI
			"show_panel_iffi" : self.iffi.active,
			"view_overlay_iffi" : self.iffi.active,
			"iffi_layer_visibility_text" : self.iffi.active ? "Layer off" : "Layer on",
			"switchOverlayIffi" : switchOverlayIffi,
			"viewPanelIffi" : viewPanelIffi,
			//SENTINEL
			"show_panel_sentinel" : self.sentinel.active,
			"view_overlay_sentinel" : self.sentinel.active,
			"sentinel_layer_visibility_text" : self.sentinel.active ? "Layer off" : "Layer on",
			"switchOverlaySentinel" : switchOverlaySentinel,
			"viewPanelSentinel" : viewPanelSentinel
		});

		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var toggleOverlay = function(overlay){
			var visibility = eval("self.view_overlay_"+overlay+";");
			if (visibility === false){
			eval("self."+overlay+"_layer_visibility_text = \"Layer off\";");
			} else {
			eval("self."+overlay+"_layer_visibility_text = \"Layer on\";");
			}
			eval("self.view_overlay_"+overlay+" = !self.view_overlay_"+overlay+";");
			eval("self."+overlay+".active = self.view_overlay_"+overlay+";");
		};
		var viewPanel = function(panel){
			self.show_panel_ps_provider = false;
			self.show_panel_ps_aoi = false;
			self.show_panel_iffi = false;
			self.show_panel_sentinel = false;
			self.show_panel_ps = false;
			eval("self.show_panel_"+panel+" = true;");
		};
	}]);