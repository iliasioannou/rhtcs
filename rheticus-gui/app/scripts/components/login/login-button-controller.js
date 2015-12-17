'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('LoginCtrl',['$scope',function($scope){
		var login = "login";
		angular.extend(this,{
			"loginPopup" : "scripts/components/login/login-popup-view.html",
			"getShow" : function(){
				return $scope.getController(login);
			},
			"setShow" : function(){
				$scope.setController(login);
			}
		});
	}]);