'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FilterCtrl
 * @description
 * # FilterCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('FilterCtrl',['$scope','configuration',function ($scope,configuration) {
		angular.extend($scope, {
			"filterPopup" : "scripts/components/filter/filter-popup-view.html",
			"speedModel": configuration.filters.speedSlider.init,
			"speedOptions": {
				"from" : configuration.filters.speedSlider.from,
				"to" : configuration.filters.speedSlider.to,
				"step" : configuration.filters.speedSlider.step,
				"dimension" : configuration.filters.speedSlider.dimension,
				"scale" : configuration.filters.speedSlider.scale,
				"css": {
					"background": {"background-color": "silver"},
					"before": {"background-color": "purple"},
					"default": {"background-color": "white"},
					"after": {"background-color": "green"},
					"pointer": {"background-color": "red"}
				},
				"callback": function(value, released) { // released it triggered on mouse up
					$scope.configuration.speedModel = value;
				}
			}
		});
	}]);