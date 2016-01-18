'use strict';

/**
 * @ngdoc overview
 * @name rheticus
 * @description
 * # rheticus
 *
 * Main module for rheticus project
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
	.constant("ANONYMOUS_USER", {
		"username": "anonymous",
		"password": "pwdanonymous"
	})
	//login service configuration
	.run(['$rootScope','$cookies'/*,'$http'*/,'ANONYMOUS_USER','ArrayService','AuthenticationService',
		function($rootScope,$cookies/*,$http*/,ANONYMOUS_USER,ArrayService,AuthenticationService) {
			angular.extend($rootScope,{
				"markerVisibility" : false,
				"login" : {
					"logged" : false,
					"details" : null
				},
				"anonymousDetails" : null
			});
			//retrieve details for anonymous user (login simulation)
			AuthenticationService.Login(ANONYMOUS_USER.username,ANONYMOUS_USER.password,
				function(response) {
					if(response.username && (response.username===ANONYMOUS_USER.username)) {
						$rootScope.anonymousDetails = {
							"authdata" : "",
							"info" : response
						};
						if (($rootScope.login.details===null) && ($rootScope.anonymousDetails!==null)){
							$rootScope.login.details = ArrayService.cloneObj($rootScope.anonymousDetails);
						}
					} else {
						// do nothing
					}
				}
			);

			//set anonymous details instead of "null" value
			$rootScope.login.details = ($rootScope.login.details===null) ? ($cookies.getObject('rheticus.login.details') || null) : null;
			if (($rootScope.login.details!==null) &&
					$rootScope.login.details.info && ($rootScope.login.details.info!==null) &&
					$rootScope.login.details.info.username && ($rootScope.login.details.info.username!==ANONYMOUS_USER.username)) {
				$rootScope.login.logged = true;
				//TODO: uncomment for HTTPS
				//$http.defaults.headers.common["Authorization"] = "Basic " + $rootScope.login.details.authdata; // jshint ignore:line
	    }
			// redirect to login page if not logged in and trying to access a restricted page
			/*$rootScope.$on('$locationChangeStart', function (event, next, current) {
	          var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
	          var loggedIn = $rootScope.globals.currentUser;
	          if (restrictedPage && !loggedIn) {
	              $location.path('/login');
	          }
	      });*/
		}
	]
);
