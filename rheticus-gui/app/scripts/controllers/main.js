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
			selectableDates: [
				"dl20110521",
				"dl20110724",
				"dl20110926",
				"dl20120217",
				"dl20120507",
				"dl20120908",
				"dl20121026",
				"dl20121217",
				"dl20130130",
				"dl20130303",
				"dl20130506",
				"dl20130725",
				"dl20130927",
				"dl20131114",
				"dl20131216",
				"dl20140121",
				"dl20140310",
				"dl20140423",
				"dl20140610",
				"dl20140712",
				"dl20140813",
				"dl20140914",
				"dl20141101",
				"dl20141219",
				"dl20150124",
				"dl20150225",
				"dl20150329",
				"dl20150414",
				"dl20150516"
			]
	  });
	  angular.extend($scope, {
			dsModel : [],
			selectedDatatsets : [],
			timeModel : "1",
			timeOptions : {       
				from: 1,
				to: $scope.selectableDates.length-1,
				step: 1,
				modelLabels: $scope.selectableDates,
				dimension: "",
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
  }])
  .controller('MainCtrl', ['$scope',function ($scope) {
    
	angular.extend($scope, {
		center: {
			lon: 11.13,
			lat: 46.05,
			zoom: 14
		},
		defaults : {
			controls: {
				zoom:true,
				rotate: true,
				zoomtoextent: true,
				zoomslider: true,
				scaleline: true,
				attribution: false
			}
		},
		wms: {			
			visible: true,
			opacity: 1,
			source: {
				type: 'TileWMS',
				url: 'http://morgana.planetek.it:8080/geoserver/pkt284/wms',
				params: {
					LAYERS: 'PS_density_raster_10m_colorV2',
					VERSION: '1.3.0',
					CQL_FILTER: null
				},
				serverType: 'geoserver'								
			}
		},
		
		bkg: {
			source: {
				type: 'OSM'
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
	
	$scope.$watch("center.zoom", function(zoom) {
		var level = (15-(20-2*Math.floor(zoom/2)));
		console.log(level);
		if(level<=12) {
			level = level<6?6:level;
			$scope.wms.source.params.LAYERS="PS_density_raster_10m_colorV2";
			$scope.wms.source.params.STYLES='';
		} else {
			$scope.wms.source.params.LAYERS="ps_limit";
			$scope.wms.source.params.STYLES="ps_limit_style";
		}
	});
	$scope.$watch("selectedDatatsets",function(dataset) {
		if(dataset)
			$scope.wms.source.params.CQL_FILTER="dataset_id="+dataset;
	});
  }]);