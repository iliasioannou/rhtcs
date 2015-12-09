'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the rheticus
 */
angular.module('rheticus')
    .controller('HelpCtrl',['$scope', function ($scope) {
		angular.extend($scope,{
			"showHelp" : false
		});
		angular.extend($scope,{
			"onStart" : function() { //function(event)
				//console.log('STARTING');
				return '1';
			},
			"onStop" : function() { //
				//console.log('ENDING');
				return '0';
			},
			"toggleHelp" : function() {
				$scope.showHelp = !$scope.showHelp;
			}
		});	
	}]);