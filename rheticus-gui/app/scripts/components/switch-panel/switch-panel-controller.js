'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:SwitchPanelCtrl
 * @description
 * # SwitchPanelCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('SwitchPanelCtrl',['$scope','configuration','utils', function ($scope,configuration,utils) {
		angular.extend($scope,{
			"metadata" : configuration.layers.overlays.metadata, // overlay layer list
		});
		angular.extend($scope,{
			"overlaysHashMap" : {
				"iffi" : utils.getIndexByAttributeValue($scope.metadata,"id","iffi"),
				"sentinel" : utils.getIndexByAttributeValue($scope.metadata,"id","sentinel"),
				"ps" : utils.getIndexByAttributeValue($scope.metadata,"id","ps")
			}
		});
		angular.extend($scope,{
			//PS
			"legendTitlePs" : $scope.metadata[$scope.overlaysHashMap.ps].legend.title,
			"legendUomPs" : $scope.metadata[$scope.overlaysHashMap.ps].legend.uom,
			"legendUrlPs" : $scope.metadata[$scope.overlaysHashMap.ps].legend.url.velocity,
			//IFFI
			"legendTitleIffi" : $scope.metadata[$scope.overlaysHashMap.iffi].legend.title,
			"legendUomIffi" : $scope.metadata[$scope.overlaysHashMap.iffi].legend.uom,
			"legendUrlIffi1" : $scope.metadata[$scope.overlaysHashMap.iffi].legend.url.tipologia_frana,
			"legendUrlIffi2" : $scope.metadata[$scope.overlaysHashMap.iffi].legend.url.area_frane_diffuse,
			//SENTINEL
			"legendTitleSentinel" : $scope.metadata[$scope.overlaysHashMap.sentinel].legend.title,
			"legendUomSentinel" : $scope.metadata[$scope.overlaysHashMap.sentinel].legend.uom,
			"legendUrlSentinel" : $scope.metadata[$scope.overlaysHashMap.sentinel].legend.url.nothing,
			//Controls
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
			//Functions
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