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
		//'nvd3ChartDirectives',
		'smart-table',
        'services.config',
		'angularHelpOverlay'
	])
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
	//.constant("configParam", "constant value");
	//.value("defaultInput", 5);
	/*.factory('MathService', function() {
		return {
			method = function(a, b) {
			   return a * b;
			};
		};
	 });*/
	.service('ArrayService', function() {
		/**
		 * Parameters:
		 * list - {Object}
		 * attribute - {String}
		 * idValue - {String}
		 * 
		 * Returns:
		 * {Integer} - Position in list
		 */
		this.getIndexByAttributeValue = function(list,attribute,idValue) {
			var res = -1;
			try {
				if (list && (list!==null) && (list.length>0)) {
					var i=0;
					if (attribute!==""){
						for (i=0; i<list.length; i++){
							if (eval("list[i]."+attribute)===idValue){ // jshint ignore:line
								res = i;
								break;
							}
						}
					} else {
						for (i=0; i<list.length; i++){
							if (list[i]===idValue){
								res = i;
								break;
							}
						}
					}
				}
			} catch (e) {
				console.log("[ArrayService :: getIndexByAttributeValue] EXCEPTION : '"+e);
			} finally {
				return(res);
			}
		};
	})
	//.run(function () {//do nothing
	.run(['$rootScope', '$cookies','$http', function ($rootScope, $cookies, $http) {
		angular.extend($rootScope,{
			"markerVisibility" : false,
			"logged" : false,
			"username" : ""
		});
		console.log("globals: "+ $cookies.getObject('username'));
		$rootScope.globals = $cookies.getObject('globals') || {};
		console.log($rootScope.globals);
        if ($rootScope.globals.currentUser) {
			console.log('currentUser:');
			$rootScope.logged= true;
			$rootScope.username = $rootScope.globals.currentUser.username;
			console.log($rootScope.globals.currentUser);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 /*
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });*/
	}]);