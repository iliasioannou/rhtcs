'use strict';

/**
 * @ngdoc overview
 * @name rheticus
 * @description
 * # rheticus
 *
 * Main module of the application.
 */

angular
	//modules addition
	.module('rheticus',[
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'openlayers-directive',
		'openlayers-layerswitcher',
		'ui.bootstrap',
		'angularAwesomeSlider',
		'nvd3',
		'smart-table',
    'services.config',
		'angularHelpOverlay',
		'angularResizable',
		'flash'
	])

	//routing configuration
	.config(function ($routeProvider) {
		$routeProvider
		.when('/login', {
            controller: 'LoginController',
            templateUrl: 'scripts/components/login/login-template-view.html',
            hideMenus: true
        })
		.when('/',{
			"templateUrl" : "scripts/components/main/main-view.html",
			"controller" : "MainCtrl",
			"controllerAs" : "main"
		})
		.when('/about', {
			"templateUrl": "scripts/components/about/about-view.html",
			"controller": "AboutCtrl",
			"controllerAs": "about"
		})
		.otherwise({
			"redirectTo": "/"
		});
	})

	//login service configuration
	.run(['$rootScope','$cookies','$http',function($rootScope,$cookies,$http) {
		angular.extend($rootScope,{
			"markerVisibility" : false,
			"logged" : false,
			"username" : "",
			"privateAOI" : []
		});
		$rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
					$rootScope.logged = true;
					$rootScope.username = $rootScope.globals.currentUser.username;
					$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 /*
		// redirect to login page if not logged in and trying to access a restricted page
		$rootScope.$on('$locationChangeStart', function (event, next, current) {
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
*/
	}]);
