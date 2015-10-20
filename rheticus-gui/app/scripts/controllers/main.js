'use strict';

/**
 * @ngdoc function
 * @name workspacePilotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspacePilotApp
 */

var legends = [
    'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_limit&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true',
    'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:PS_heatmap_100m&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true'
];
angular.module('workspacePilotApp')
    .controller('HeaderController', ['$scope', function ($scope) {
        angular.extend($scope, {
            filterPopupTemplateName: "filterPopupTemplate.html",
            datasets: [
                {
                    name: 'DS1',
                    selected: false
                },
                {
                    name: 'DS2',
                    selected: false
                },
                {
                    name: 'DS3',
                    selected: false
                },
                {
                    name: 'DS4',
                    selected: false
                },
                {
                    name: 'DS5',
                    selected: false
                },
                {
                    name: 'DS6',
                    selected: false
                }
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
            dsModel: [],
            selectedDatatsets: [],
            timeModel: "1",
            timeOptions: {
                from: 1,
                to: $scope.selectableDates.length - 1,
                step: 1,
                modelLabels: $scope.selectableDates,
                dimension: ""
            },
            speedModel: "10",
            speedOptions: {
                from: 1,
                to: 100,
                step: 1,
                dimension: " mm/year",
                scale: [0, '|', 50, '|', 100],
                css: {
                    background: {
                        "background-color": "silver"
                    },
                    before: {
                        "background-color": "purple"
                    },
                    default: {
                        "background-color": "white"
                    },
                    after: {
                        "background-color": "green"
                    },
                    pointer: {
                        "background-color": "red"
                    }
                }
            },
            coherenceModel: "80",
            coherenceOptions: {
                from: 75,
                to: 100,
                step: 0.5,
                dimension: " %",
                scale: [75, '|', 90, '|', 100],
                css: {
                    background: {
                        "background-color": "silver"
                    },
                    before: {
                        "background-color": "purple"
                    },
                    default: {
                        "background-color": "white"
                    },
                    after: {
                        "background-color": "green"
                    },
                    pointer: {
                        "background-color": "red"
                    }
                }
            }
        });
        
    this.legends=legends;
        this.getLegend= function(){
          return legends[1];
        };
  }])
    .controller('MainCtrl', ['$scope', function ($scope) {

        angular.extend($scope, {
            center: {
                lon: 11.13,
                lat: 46.05,
                zoom: 14
            },
            defaults: {
                controls: {
                    zoom: true,
                    rotate: true,
                    zoomtoextent: true,
                    zoomslider: true,
                    scaleline: true,
                    attribution: false
                }
            },
            wms_raster: {
			visible: true,
			opacity: 0.8,
			source: {
				type: 'TileWMS',
				url: 'http://morgana.planetek.it:8080/geoserver/pkt284/wms',
				params: { 					 
					LAYERS: 'PS_heatmap_100m',
					VERSION: '1.1.0',
					STYLES: 'PS_heatmap_100m_style',
                    minScale: 10000
				},
				serverType: 'geoserver'								
			}
                        
		},          
        
		wms_vector: {
			visible: true,
			opacity: 0.8,
			source: {
				type: 'TileWMS',
				url: 'http://morgana.planetek.it:8080/geoserver/pkt284/wms',
				params: { 					 
					LAYERS: 'ps_limit',
					VERSION: '1.1.0',
					STYLES: 'ps_limit_style',
                    maxScale: 10000,
                    minScale: 1000
				},
				serverType: 'geoserver'								
			}
        },   
            bkg: {
                source: {
                    type: 'OSM'
                }
            },
            view: {},
            controls: [
                {
                    name: 'zoom',
                    active: true
                },
                {
                    name: 'fullscreen',
                    active: true
                },
                {
                    name: 'rotate',
                    active: true
                },
                {
                    name: 'zoomslider',
                    active: true
                },
                {
                    name: 'zoomtoextent',
                    active: true
                },
                {
                    name: 'scaleline',
                    active: true
                },
                {
                    name: 'attribution',
                    active: false
                }
		],


            options: {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function (d) {
                        return d.x;
                    },
                    y: function (d) {
                        return d.y;
                    },
                    useInteractiveGuideline: true,
                    dispatch: {
                        stateChange: function (e) {
                            console.log("stateChange");
                        },
                        changeState: function (e) {
                            console.log("changeState");
                        },
                        tooltipShow: function (e) {
                            console.log("tooltipShow");
                        },
                        tooltipHide: function (e) {
                            console.log("tooltipHide");
                        }
                    },
                    xAxis: {
                        axisLabel: 'Time (ms)'
                    },
                    yAxis: {
                        axisLabel: 'Voltage (v)',
                        tickFormat: function (d) {
                            return d3.format('.02f')(d);
                        },
                        axisLabelDistance: 30
                    },
                    callback: function (chart) {
                        console.log("!!! lineChart callback !!!");
                    }
                },
                title: {
                    enable: true,
                    text: 'Title for Line Chart'
                },
                subtitle: {
                    enable: true,
                    text: 'Subtitle for simple line chart.',
                    css: {
                        'text-align': 'center',
                        'margin': '10px 13px 0px 7px'
                    }
                },
                caption: {
                    enable: true,
                    html: '<b>Figure 1.</b>',
                    css: {
                        'text-align': 'justify',
                        'margin': '10px 13px 0px 7px'
                    }
                }
            },

            data: function sinAndCos() {
                var sin = [],
                    sin2 = [],
                    cos = [];

                //Data is represented as an array of {x,y} pairs.
                for (var i = 0; i < 100; i++) {
                    sin.push({
                        x: i,
                        y: Math.sin(i / 10)
                    });
                    sin2.push({
                        x: i,
                        y: i % 10 === 5 ? null : Math.sin(i / 10) * 0.25 + 0.5
                    });
                    cos.push({
                        x: i,
                        y: 0.5 * Math.cos(i / 10 + 2) + Math.random() / 10
                    });
                }

                //Line chart data should be sent as an array of series objects.
                return [
                    {
                        values: sin, //values - represents the array of {x,y} data points
                        key: 'Sine Wave', //key  - the name of the series.
                        color: '#ff7f0e' //color - optional: choose your own line color.
                },
                    {
                        values: cos,
                        key: 'Cosine Wave',
                        color: '#2ca02c'
                },
                    {
                        values: sin2,
                        key: 'Another sine wave',
                        color: '#7777ff',
                        area: true //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
            }

        });

        $scope.$watch("center.zoom", function (zoom) {
            var level = (15 - (20 - 2 * Math.floor(zoom / 2)));
            console.log(level);
            if (level <= 12) {
                level = level < 6 ? 6 : level;
                $scope.wms.source.params.LAYERS = "ps_limit_group";
                $scope.wms.source.params.STYLES = '';
            } else {
                $scope.wms.source.params.LAYERS = "ps_limit";
                $scope.wms.source.params.STYLES = "ps_limit_style";
            }
        });
        $scope.$watch("selectedDatatsets", function (dataset) {
            if (dataset)
                $scope.wms.source.params.CQL_FILTER = "dataset_id=" + dataset;
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
