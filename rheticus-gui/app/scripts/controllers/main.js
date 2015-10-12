'use strict';

/**
 * @ngdoc function
 * @name workspacePilotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspacePilotApp
 */
angular.module('workspacePilotApp')
  .controller('HeaderController', ['$scope',function ($scope) {
	  angular.extend($scope, {		  
			filterPopupTemplateName : "filterPopupTemplate.html",
			datasets : [
				{name : 'DS1', selected: false},
				{name : 'DS2', selected: false},
				{name : 'DS3', selected: false},
				{name : 'DS4', selected: false},
				{name : 'DS5', selected: false},
				{name : 'DS6', selected: false},
			],
			dsModel : [],
			selectedDatatsets : [],
			timeModel : "0;50",
			timeOptions : {       
				from: 1,
				to: 100,
				step: 1,
				dimension: " days ago",
				scale: [0, '|', 50, '|' , 100],
				css: {
					background: {"background-color": "silver"},
					before: {"background-color": "purple"},
					default: {"background-color": "white"},
					after: {"background-color": "green"},
					pointer: {"background-color": "red"}          
				}        
			}		  
	  });
  }])
  .controller('MainCtrl', ['$scope',function ($scope) {
    
	angular.extend($scope, {
		center: {
			lon: 11.13,
			lat: 46.05,
			zoom: 14
		},
		defaults : {
			interactions: {
				mouseWheelZoom: true
			},
			controls: {
				zoom:{
					position: 'bottomright'
				},
				rotate: true,
				zoomtoextent: true,
				zoomslider: true,
				scaleline: true,
				attribution: false
			}			
		},
		
		wms: {
			visible: true,
			opacity: 0.5,
			source: {
				type: 'ImageWMS',
				url: 'http://minerva.planetek.it:8080/geoserver/cite/wms',
				params: { 					 
					LAYERS: 'point',
					VERSION: '1.1.0',
					STYLES: 'Heatmap'
				},
				serverType: 'geoserver'								
			}
		},
		view: {
		},
		controls: [
			{ name: 'zoom', active: true },
			{ name: 'fullscreen', active: true },
			{ name: 'rotate', active: true},
			{ name: 'zoomslider', active: true},
			{ name: 'zoomtoextent', active: true},			
			{ name: 'scaleline', active: true},			
			{ name: 'attribution', active: false}
		]
    });
  }]);