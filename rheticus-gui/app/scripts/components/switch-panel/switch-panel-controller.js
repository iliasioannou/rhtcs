'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:SwitchPanelCtrl
 * @description
 * # SwitchPanelCtrl
 * Switch Panel Controller for rheticus project
 */
 angular.module('rheticus')
 	.controller('SwitchPanelCtrl',['$scope','$rootScope','$mdSidenav',function ($scope,$rootScope,$mdSidenav){

 		var self = this; //this controller


 		$rootScope.$watch("login.details", function (user) {
			var deals=$scope.getUserDeals();
      if(user.info.name.indexOf("anonymous")== -1){
        $scope.setMapViewExtent(
   				deals[0].geom_geo_json.type,
   				deals[0].geom_geo_json.coordinates
   			);
      }

 		});

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
					$scope.setMapViewExtent(
						entities[position].geom_geo_json.type,
						entities[position].geom_geo_json.coordinates
					);
					$mdSidenav('areaMenu').close();
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
		//PSCANDIDATE
		var switchOverlaypsCandidate = function(){
			toggleOverlay("psCandidate");
		};
		var viewPanelpsCandidate = function(){
			viewPanel("psCandidate");
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
			"sentinel_metadata" : $scope.getOverlayMetadata("sentinel"),
			"psCandidate" : $scope.getOverlayParams("psCandidate"),
			"psCandidate_metadata" : $scope.getOverlayMetadata("psCandidate"),
			"userDeals" : $scope.getUserDeals(),
			"checkboxActive" : "prova"
		});
		angular.extend(self,{
			//Tab controls
			"isCollapsed" : true, // not minimize
			"minimize" : minimize,
			//PS
			"show_panel_ps" : true,
			"show_panel_ps_aoi" : false,
			"view_overlay_ps" : self.ps.visible, // overlay visibility
			"ps_layer_visibility_text" : self.ps.visible ? "Layer off" : "Layer on",
			"switchOverlayPs" : switchOverlayPs,
			"viewPanelPs" : viewPanelPs,
			"viewPanelPsProviders" : viewPanelPsProviders,
			"viewPanelPsAoi" : viewPanelPsAoi,
			"updateSelectionArea" : updateSelectionArea,
			//IFFI
			"show_panel_iffi" : false,
			"view_overlay_iffi" : self.iffi.visible,
			"iffi_layer_visibility_text" : self.iffi.visible ? "Layer off" : "Layer on",
			"switchOverlayIffi" : switchOverlayIffi,
			"viewPanelIffi" : viewPanelIffi,
			//PSCANDIDATE
			"show_panel_psCandidate" : false,
			"view_overlay_psCandidate" : self.psCandidate.visible,
			"psCandidate_layer_visibility_text" : self.psCandidate.visible ? "Layer off" : "Layer on",
			"switchOverlaypsCandidate" : switchOverlaypsCandidate,
			"viewPanelpsCandidate" : viewPanelpsCandidate,
			//SENTINEL
			"show_panel_sentinel" : false,
			"view_overlay_sentinel" : self.sentinel.visible,
			"sentinel_layer_visibility_text" : self.sentinel.visible ? "Layer off" : "Layer on",
			"switchOverlaySentinel" : switchOverlaySentinel,
			"viewPanelSentinel" : viewPanelSentinel
		});

		$scope.$on("setSwitchPanelUserDeals",function(event, args){ // jshint ignore:line
			self.userDeals = args.userDeals;
		});

		/**
		 * PRIVATE VARIABLES AND METHODS
		 */
		var toggleOverlay = function(overlay){
			var visibility = eval("self.view_overlay_"+overlay+";"); // jshint ignore:line
			if (!visibility){
				eval("self."+overlay+"_layer_visibility_text = \"Layer off\";"); // jshint ignore:line
			} else {
				eval("self."+overlay+"_layer_visibility_text = \"Layer on\";"); // jshint ignore:line
			}
			eval("self.view_overlay_"+overlay+" = !self.view_overlay_"+overlay+";"); // jshint ignore:line
			eval("self."+overlay+".visible = self.view_overlay_"+overlay+";"); // jshint ignore:line
		};
		var viewPanel = function(panel){
			self.show_panel_ps_aoi = false;
			self.show_panel_iffi = false;
			self.show_panel_sentinel = false;
			self.show_panel_psCandidate = false;
			self.show_panel_ps = false;
			eval("self.show_panel_"+panel+" = true;"); // jshint ignore:line
		};
	}]);
