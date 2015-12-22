'use strict';
 
angular.module('rheticus')
 	.controller('LoginController', 
		['$scope', 'AuthenticationService', '$route', '$templateCache',
		function ($scope, AuthenticationService,$route,$templateCache) {
			$scope.login = function () {
				$scope.dataLoading = true;
				AuthenticationService.Login($scope.username, $scope.password, function(response) {
					if(response.username === $scope.username) {
						AuthenticationService.SetCredentials($scope.username, $scope.password, response.deals);
						
						$scope.dataLoading = false;
						$scope.setPrivateAOI(response.deals);
						$scope.error = null;
						var currentPageTemplate = $route.current.templateUrl;
						$templateCache.remove(currentPageTemplate);
						$route.reload();
					} else {
						$scope.error = response.message;
						$scope.dataLoading = false;
					}
				});
				
			};
			
			$scope.logout = function () {
				AuthenticationService.ClearCredentials();
				var currentPageTemplate = $route.current.templateUrl;
				$templateCache.remove(currentPageTemplate);
				$route.reload();
				
			};
		}]
	);