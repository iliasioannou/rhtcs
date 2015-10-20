'use strict';

/**
 * @ngdoc function
 * @name workspacePilotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspacePilotApp
 */

var legends = [
          'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_limit&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true' , 'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:PS_heatmap_100m&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true'
        
      ];

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
				skin: 'plastic',
				      
			},
			
			speedModel : "10",
			speedOptions : {       
				from: 1,
				to: 100,
				step: 1,
				dimension: " mm/year",
				scale: [0, '|', 50, '|' , 100],
				css: {
					background: {"background-color": "silver"},
					before: {"background-color": "purple"},
					default: {"background-color": "white"},
					after: {"background-color": "green"},
					pointer: {"background-color": "red"}          
				}        
			}, 
			coherenceModel : "80",
			coherenceOptions : {       
				from: 75,
				to: 100,
				step: 0.5,
				dimension: " %",
				scale: [75, '|', 90, '|' , 100],
				css: {
					background: {"background-color": "silver"},
					before: {"background-color": "purple"},
					default: {"background-color": "white"},
					after: {"background-color": "green"},
					pointer: {"background-color": "red"}   
				}
			}
	  });
      
      this.zoom=true;
      this.legends=legends;
      this.getLegend= function(){
          return legends[1];
      };
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
      
      
  }])
  

  .controller('DetailController', ['$scope',function ($scope) {
      
      this.show = true;
      
      this.switch= function(){
          this.show=!this.show;
      };
      this.isVisible= function(){
          return this.show===true;
      };
      
      angular.extend($scope, {
          
      });
  }]);

      