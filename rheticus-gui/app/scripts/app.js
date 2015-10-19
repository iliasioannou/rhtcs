'use strict';

/**
 * @ngdoc overview
 * @name workspacePilotApp
 * @description
 * # workspacePilotApp
 *
 * Main module of the application.
 */
angular
  .module('workspacePilotApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
	'openlayers-directive',
	'ui.bootstrap',
	'angularAwesomeSlider',
    'nvd3'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });	  
  });
