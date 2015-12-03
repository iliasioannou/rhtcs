'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:SwitchPanelCtrl
 * @description
 * # SwitchPanelCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('SwitchPanelCtrl',['$rootScope','$scope', function ($rootScope,$scope) {
		angular.extend($scope,{
			//PS
			"titlePs" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].legend.name,
			"legendTitlePs" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].legend.title,
			"legendUomPs" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].legend.uom,
			"legendUrlPs" : $rootScope.metadata[$rootScope.overlaysHashMap.ps].legend.url.velocity,
			"legendOpacityPs" : $rootScope.overlays[$rootScope.overlaysHashMap.ps].opacity,
			//IFFI
			"titleIffi" : $rootScope.metadata[$rootScope.overlaysHashMap.iffi].legend.name,
			"legendTitleIffi" : $rootScope.metadata[$rootScope.overlaysHashMap.iffi].legend.title,
			"legendUomIffi" : $rootScope.metadata[$rootScope.overlaysHashMap.iffi].legend.uom,
			"legendUrlIffi1" : $rootScope.metadata[$rootScope.overlaysHashMap.iffi].legend.url.tipologia_frana,
			"legendUrlIffi2" : $rootScope.metadata[$rootScope.overlaysHashMap.iffi].legend.url.area_frane_diffuse,
			"legendOpacityIffi" : $rootScope.overlays[$rootScope.overlaysHashMap.iffi].opacity,
			//SENTINEL
			"titleSentinel" : $rootScope.metadata[$rootScope.overlaysHashMap.sentinel].legend.name,
			"legendTitleSentinel" : $rootScope.metadata[$rootScope.overlaysHashMap.sentinel].legend.title,
			"legendUomSentinel" : $rootScope.metadata[$rootScope.overlaysHashMap.sentinel].legend.uom,
			"legendUrlSentinel" : $rootScope.metadata[$rootScope.overlaysHashMap.sentinel].legend.url.nothing,
			"legendOpacitySentinel" : $rootScope.overlays[$rootScope.overlaysHashMap.sentinel].opacity,
			//DATA PROVIDER 
			"entities" : [{
				"name" : ' Sentinel',
				"checked" : false
				}, {
				"name" : ' Cosmo',
				"checked" : false
				}],
			//DEMO AREAS
			"demoareas" : [{
				"name" : $rootScope.aoi[0].name,
				"bbox" : $rootScope.aoi[0].bbox,
				"checked" : $rootScope.aoi[0].selected
				}, {
				"name" : $rootScope.aoi[1].name,
				"bbox" : $rootScope.aoi[1].bbox,
				"checked" : $rootScope.aoi[1].selected
				}],
			//Controls
			"isCollapsed" : true, // not minimize
			//overlay visibility 
			"ps_layer_view" : $rootScope.overlays[$rootScope.overlaysHashMap.ps].active,
			"iffi_layer_view" : $rootScope.overlays[$rootScope.overlaysHashMap.iffi].active,
			"sentinel_layer_view" : $rootScope.overlays[$rootScope.overlaysHashMap.sentinel].active,
			// loading first PS div at startup
			"ps_legend_view" : true,
			"iffi_legend_view" : false,
			"sentinel_legend_view" : false,
			"provider_legend_view" : false,
			// Tooltip on laye visibility
			"ps_active" : $rootScope.overlays[$rootScope.overlaysHashMap.ps].active ? "Layer off" : "Layer on",
			"iffi_active" : $rootScope.overlays[$rootScope.overlaysHashMap.iffi].active ? "Layer off" : "Layer on",
			"sentinel_active" : $rootScope.overlays[$rootScope.overlaysHashMap.sentinel].active ? "Layer off" : "Layer on",
			
			//Functions
			//PS
			"changePsLayer" : function(){
				if ($scope.ps_layer_view == false){
					$scope.ps_active = "Layer off";
				}else{
					$scope.ps_active = "Layer on";
				}
				$scope.ps_layer_view = !$scope.ps_layer_view;
				$rootScope.overlays[$rootScope.overlaysHashMap.ps].active = $scope.ps_layer_view;
				
			},
			"ViewPsLegend" : function(){
				$scope.iffi_legend_view = false;
				$scope.sentinel_legend_view = false;
				$scope.provider_legend_view = false;
				$scope.ps_legend_view = true;
				
			},
			//IFFI
			"changeIffiLayer" : function(){
				if ($scope.iffi_layer_view == false){
					$scope.iffi_active = "Layer off";
				}else{
					$scope.iffi_active = "Layer on";
				}
				$scope.iffi_layer_view = !$scope.iffi_layer_view;
				$rootScope.overlays[$rootScope.overlaysHashMap.iffi].active = $scope.iffi_layer_view;
			},
			"ViewIffiLegend" : function(){
				$scope.ps_legend_view = false;
				$scope.sentinel_legend_view = false;
				$scope.provider_legend_view = false;
				$scope.iffi_legend_view = true;
			},
			//SENTINEL
			"changeSentinelLayer" : function(){
				if ($scope.sentinel_layer_view == false){
						$scope.sentinel_active = "Layer off";
				}else{
					$scope.sentinel_active = "Layer on";
				}
				$scope.sentinel_layer_view = !$scope.sentinel_layer_view;
				$rootScope.overlays[$rootScope.overlaysHashMap.sentinel].active = $scope.sentinel_layer_view;
			},
			"ViewSentinelLegend" : function(){ 
				$scope.iffi_legend_view = false;
				$scope.ps_legend_view = false;
				$scope.provider_legend_view = false;
				$scope.sentinel_legend_view = true;
			},
			"ViewProviderLegend" : function(){
				$scope.iffi_legend_view = false;
				$scope.ps_legend_view = false;
				$scope.provider_legend_view = true;
				$scope.sentinel_legend_view = false;
			},
			"Minimize" : function(){
				$scope.isCollapsed = !$scope.isCollapsed;
			},
			"updateSelectionArea" : function(position, entities) {
				angular.forEach(entities, function(subscription, index) {
				if (position != index) 
				  subscription.checked = false;
			});
			},
			"updateSelection" : function(position, entities) {
				angular.forEach(entities, function(subscription, index) {
				if (position != index) 
				  subscription.checked = false;
			});
			}
		});
	}]);