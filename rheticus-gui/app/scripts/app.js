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
		'angularHelpOverlay',
		'angularResizable',
		'flash'
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
	//Enabling CORS in Angular JS 
	/*.config(['$httpProvider', function($httpProvider) {
		//Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
		//Remove the header containing XMLHttpRequest used to identify ajax call 
		//that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])*/

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
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });*/
	}])
	.directive('draggable', function($document) {
		return function(scope, element, attr) {
			var startX = 0, startY = 0, x = 0, y = 0;
			element.css({
				cursor: 'pointer'
			});
			element.on('mousedown', function(event) {
				element.css({
					border: '1px solid red'
				});
				// Prevent default dragging of selected content
				event.preventDefault();
				startX = event.screenX - x;
				startY = event.screenY - y;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				y = event.screenY - startY;
				x = event.screenX - startX;
				element.css({
					top: y + 'px',
					left:  x + 'px',
					border: '1px solid red'
				});
			}

			function mouseup() {
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);
				element.css({
					border: '0px solid red'
				});
			}
		};
	});