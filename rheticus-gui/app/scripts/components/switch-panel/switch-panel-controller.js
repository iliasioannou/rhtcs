'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:SwitchPanelCtrl
 * @description
 * # SwitchPanelCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('SwitchPanelCtrl',['$scope','configuration', function ($scope,configuration) {
		angular.extend($scope,{
			"legendTitlePs" : configuration.legends.ps.title,
			"legendUomPs" : configuration.legends.ps.uom,
			"legendUrlPs" : configuration.legends.ps.url,
			"legendTitleIffi" : configuration.legends.iffi.title,
			"legendUomIffi" : configuration.legends.iffi.uom,
			"legendUrlIffi1" : configuration.legends.iffi.url[1],
			"legendUrlIffi2" : configuration.legends.iffi.url[0],
			"legendTitleSentinel" : configuration.legends.iffi.title,
			"legendUomSentinel" : configuration.legends.iffi.uom,
			"legendUrlSentinel" : configuration.legends.iffi.url,
			"isCollapsed" : true,
			"ps_layer_view" : true,
			"iffi_layer_view" : false,
			"sentinel_layer_view" : false,
			"ps_legend_view" : true,
			"iffi_legend_view" : false,
			"sentinel_legend_view" : false,
			"ps_active" : "Layer off",
			"iffi_active" : "Layer on",
			"sentinel_active" : "Layer on",
			"changePsLayer" : function(){
				if ($scope.ps_layer_view == false){
						$scope.ps_active = "Layer off";
				}else{
					$scope.ps_active = "Layer on";
				}
				$scope.ps_layer_view = !$scope.ps_layer_view;
			},
			"ViewPsLegend" : function(){
				$scope.iffi_legend_view = false;
				$scope.sentinel_legend_view = false;
				$scope.ps_legend_view = true;
				
				
			},
			"changeIffiLayer" : function(){
				if ($scope.iffi_layer_view == false){
						$scope.iffi_active = "Layer off";
				}else{
					$scope.iffi_active = "Layer on";
				}
				$scope.iffi_layer_view = !$scope.iffi_layer_view;
			},
			"ViewIffiLegend" : function(){
				$scope.ps_legend_view = false;
				$scope.sentinel_legend_view = false;
				$scope.iffi_legend_view = true;
				
			},
			"changeSentinelLayer" : function(){
				if ($scope.sentinel_layer_view == false){
						$scope.sentinel_active = "Layer off";
				}else{
					$scope.sentinel_active = "Layer on";
				}
				$scope.sentinel_layer_view = !$scope.sentinel_layer_view;
			},
			"ViewSentinelLegend" : function(){
				$scope.iffi_legend_view = false;
				$scope.ps_legend_view = false;
				$scope.sentinel_legend_view = true;
				
				
				
			},
			
			"Minimizer" : function(){
				$scope.isCollapsed = !$scope.isCollapsed;
				
			}
			
			
			
		});
		
		
	}]);