'use strict';

/**
 * @ngdoc function
 * @name workspacePilotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspacePilotApp
 */

angular.module('workspacePilotApp')
    .controller('HeaderController', ['$scope', function ($scope) {
        angular.extend($scope, {
            filterPopupTemplateName: "filterPopupTemplate.html",            
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
            },
            
        });
        $scope.$watch("datatsets", function (datasets) {
            if (datasets)
                $scope.wms.source.params.CQL_FILTER = "dataset_id=" + dataset;
        }, true);
    }])
    .controller('MainCtrl', ['$rootScope', '$scope', '$http', 'olData', function ($rootScope, $scope, $http, olData) {
        angular.extend($scope, {
            legends: [
                'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_limit&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true',
                'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:PS_heatmap_100m&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true'
            ]
        });
        angular.extend($scope, {
            rc: {},
            center: {
                lon: 11.13,
                lat: 46.05,
                zoom: 19
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
            marker:{
                
            },
            wms_basemap: {
                visible: true,
                opacity: 1,
                source: {
                    type: 'TileWMS',
                    url: 'http://morgana.planetek.it:8080/geoserver/pkt284/wms',
                    params: {
                        LAYERS: 'rv1',
                        VERSION: '1.3.0'                       
                    }
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
                        VERSION: '1.3.0',
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
                        VERSION: '1.3.0',
                        STYLES: 'ps_limit_style',
                        maxScale: 10000
                    },
                    serverType: 'geoserver'
                }
            },
            wms_vector_features: {
                visible: false,
                source: {
                    type: 'TileWMS',
                    url: 'http://morgana.planetek.it:8080/geoserver/pkt284/wms',
                    params: {
                        LAYERS: 'ps',
                        VERSION: '1.3.0'
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
            graph_options: {
                chart: {
                    type: 'lineChart',
                    height: 250,
                    width: 650,
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
                        axisLabel: 'Data',
                        tickFormat : function(d) { 
                            return d3.time.format('%d/%m/%Y')(new Date(d))
                        }
                        //range: [new Date("01/01/2011"), new Date("01/01/2016")]
                        //scale: d3.time.scale().domain([new Date("01/01/2011"), new Date("01/01/2016")])
                        //tickValues: 
                    },
                    yAxis: {
                        axisLabel: 'Spostamento (cm)',
                        tickFormat: function (d) {
                            return d3.format('.02f')(d);
                        },
                        axisLabelDistance: -10
                    },
                    callback: function (chart) {
                        
                    }
                },
                title: {
                    enable: true,
                    text: 'Title for Line Chart'
                },
                subtitle: {
                    enable: false,
                    text: 'Subtitle for simple line chart.',
                    css: {
                        'text-align': 'center',
                        'margin': '10px 13px 0px 7px'
                    }
                },
                caption: {
                    enable: false,
                    html: '<b>Figure 1.</b>',
                    css: {
                        'text-align': 'justify',
                        'margin': '10px 13px 0px 7px'
                    }
                }
            },
            data: [],
            getFeatureInfoResponse: []
        });

        $scope.$watch("configuration.datasets",function(datasets){           
            var selected = [];
            for(var key in datasets) {
                if(datasets[key].selected)
                    selected.push("dataset_id='"+datasets[key].name+"'");
            }
            var cql = selected.join(' OR ');
            if(cql)
                $scope.wms_vector.source.params.CQL_FILTER = cql;
            else 
                delete $scope.wms_vector.source.params.CQL_FILTER;
        },true);
        
        olData.getMap().then(function (map) {
            map.on('singleclick', function (evt) {
                var viewResolution = map.getView().getResolution();
                var wmsSource = new ol.source.TileWMS($scope.wms_vector_features.source);
                var url = wmsSource.getGetFeatureInfoUrl(
                    evt.coordinate, viewResolution, 'EPSG:3857', {
                        'INFO_FORMAT': 'application/json'
                    });

                $http.get(url).success(function (response) {
                    var point = ol.proj.toLonLat(evt.coordinate,'EPSG:3857');
                    if($scope.configuration.autocenter){
                        $scope.center.lat=point[1];
                        $scope.center.lon=point[0];
                        if($scope.configuration.autozoom) {
                            $scope.center.zoom=20;
                        }
                    }
                    
                    //For IE :: creating "startsWith" method for String Class
                    if (typeof String.prototype.startsWith != 'function') {
                        String.prototype.startsWith = function (str) {
                            return this.slice(0, str.length) == str;
                        };
                    }
                    if (typeof String.prototype.splice != 'function') {
                        String.prototype.splice = function (idx, rem, s) {
                            return this.slice(0,idx) + s + this.slice(idx + Math.abs(rem));
                        };
                    }

                    var chartData = [];
                    var infoResponse = [];
                    //Data is represented as an array of {x,y} pairs.                     
                    if (response.features && (response.features.length > 0) ) {
                        $scope.show_panel = true;
                        $scope.graph_options.title.text = "PS ID: ";

                        for (var i=0; i<response.features.length; i++){
                            $scope.graph_options.title.text += response.features[i].properties["code"]+", ";
                            
                            var featureData = [];
                            var featureInfo = {};
                            for (var key in response.features[i].properties) {
                                if (key.startsWith("dl")) {
                                    var FeatureDate = new Date(key.replace("dl", "").splice(6,0,"/").splice(4,0,"/"));
                                    if (FeatureDate instanceof Date){
                                        featureData.push({
                                            x: FeatureDate,
                                            y: response.features[i].properties[key]
                                        });
                                    }
                                }
                                eval("featureInfo."+key+"=response.features[\""+i+"\"].properties."+key+";");
                            }

                            var autoColor = {
                                colors : d3.scale.category10(),
                                index : 0,
                                getColor: function () { return this.colors(this.index++) }
                            };
                            chartData.push({
                                values: featureData, //values - represents the array of {x,y} data points
                                key: response.features[i].properties["code"], //key  - the name of the series (PS CODE)
                                //color: '#ff7f0e' //color - optional: choose your own line color.
                                color: autoColor.getColor() //'#ff7f0e' //color - optional: choose your own line color.
                            });
                            
                            infoResponse.push(featureInfo);
							$scope.marker={
								lat: point[1],
								lon: point[0],
								label: response.features[0].properties.code
							};

                        }
                        $scope.graph_options.title.text = $scope.graph_options.title.text.substr(0,$scope.graph_options.title.text.length-2);
                        
                    }else{
                        $scope.show_panel = false;
                    }
                    
                    //Line chart data should be sent as an array of series objects.                
                    angular.extend($scope.data, chartData);
                    angular.extend($scope.getFeatureInfoResponse, infoResponse);
                    $scope.rc.api.update();
                    
                });
            });
        });
    }])

.controller('DetailController', ['$scope', function ($scope) {
    angular.extend($scope, {
        show: true,
        switch: function () {
            $scope.show = !$scope.show;
        },
        isVisible: function () {
            return $scope.show;
        }
    });
    }]);