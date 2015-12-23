'use strict';
 
angular.module('rheticus')
 	.controller('LoginController', 
		['$scope','AuthenticationService','$window',function($scope,AuthenticationService,$window) {
			$scope.login = function () {
				$scope.dataLoading = true;
				AuthenticationService.Login($scope.username, $scope.password, function(response) {
					if(response.username === $scope.username) {
						AuthenticationService.SetCredentials($scope.username, $scope.password, response.deals);
						$scope.dataLoading = false;
						$scope.error = null;
						$window.location.reload();
					} else {
						$scope.error = response.message;
						$scope.dataLoading = false;
					}
				});
			};
			$scope.logout = function () {
				AuthenticationService.ClearCredentials();
				$window.location.reload();
			};
		}]
	);