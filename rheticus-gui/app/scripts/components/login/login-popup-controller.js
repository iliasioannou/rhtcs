'use strict';
 
angular.module('rheticus')
 	.controller('LoginController',['$scope', '$rootScope', '$location', 'AuthenticationService', '$route', '$templateCache',
		function ($scope, $rootScope, $location, AuthenticationService,$route,$templateCache) {
			$scope.login = function () {
				$scope.dataLoading = true;
				AuthenticationService.Login($scope.username, $scope.password, function(response) {
					console.log($scope.username + $scope.password);
					if(response.success) {
						AuthenticationService.SetCredentials($scope.username, $scope.password);
						$location.path('/');
						$scope.dataLoading = false;
						$scope.error = null;
						console.log("logged1 : "+$scope.logged);
						var currentPageTemplate = $route.current.templateUrl;
						$templateCache.remove(currentPageTemplate);
						$route.reload();
					} else {
						$scope.error = response.message;
						$scope.dataLoading = false;
					}
				});
				console.log("logged2 : "+$scope.logged);
			};
			
			$scope.logout = function () {
				AuthenticationService.ClearCredentials();
				$route.reload();
				console.log("logged1 : "+$scope.logged);
			};
		}]
	);