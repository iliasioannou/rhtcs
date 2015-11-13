'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('MainCtrl', ['$rootScope', '$scope', '$http', 'olData', 'default_graph_options', 'configuration',
	function ($rootScope, $scope, $http, olData, default_graph_options, configuration) {

	angular.extend($scope, {
		configurationLegend: configuration.legends
	});

    angular.extend($scope, {
        legend		: $scope.configurationLegend.density.url,
        legendTitle	: $scope.configurationLegend.density.title,
		legendUom	: $scope.configurationLegend.density.uom,
		
		rc : {},
        center: $rootScope.configuration.center,
        show_trends: false,
        defaults: {
            events: { 
                map: ['moveend', 'click'],
                layers: ['click']
            },
            interactions: {
                // Enable/Disable mouseWheelZoom
                mouseWheelZoom: true
            },
            controls: {
                // Enable/Disable zoom box
                zoom: true,
                rotate: true,
                zoomtoextent: false,
                zoomslider: true,
                scaleline: true,
                attribution: false
            }
        },
        
        marker: {
        },

        wms_basemap: {
            visible: true,
            opacity: 1,
            source: {
                type: 'TileWMS',
                url: 'http://morgana.planetek.it:8080/geoserver/gwc/service/wms',
                params: {
                    LAYERS: 'pkt284:rv1',
                    VERSION: '1.3.0',
                    SRS: 'EPSG:3857',
                    TILED: true
                    //format_options: 'layout:legend'
                }
            }

        },
        
        wms: {},
        
        /*
        //TRENTO HEATMAP DENSITA'
        wms_raster: {
            visible: true,
            opacity: 0.8,
            source: {
                type: 'TileWMS',
                url: 'http://morgana.planetek.it:8080/geoserver/gwc/service/wms',
                minScale: 10000,
                params: {
                    LAYERS: 'pkt284:PS_heatmap_100m',
                    VERSION: '1.3.0',
                    //STYLES: 'PS_heatmap_100m_style',
                    SRS: 'EPSG:3857',
                    TILED: true,
                    //format_options: 'layout:legend'
                },
                serverType: 'geoserver'
            }
        },
        */
        /*
        //BARRITTERI HEATMAP VELOCITA'
        wms_raster: {
            visible: true,
            opacity: 0.8,
            source: {
                type: 'TileWMS',
                url: 'http://morgana.planetek.it:8080/geoserver/gwc/service/wms',
                minScale: 10000,
                params: {
                    LAYERS: 'pkt284:ps_barritteri_raster_vel',
                    VERSION: '1.3.0',
                    SRS: 'EPSG:3857',
                    TILED: true
                },
                serverType: 'geoserver'
            }
        },
        */

        //BARRITTERI HEATMAP DENSITA'
        wms_raster: {
            visible: true,
            opacity: 0.8,
            source: {
                type: 'TileWMS',
                url: 'http://morgana.planetek.it:8080/geoserver/gwc/service/wms',
                minScale: 10000,
                params: {
                    LAYERS: 'pkt284:ps_barritteri_raster',
                    VERSION: '1.3.0',
                    SRS: 'EPSG:3857',
                    TILED: true,
                },
                serverType: 'geoserver'
            }
        },

/*
        //TRENTO PS VIEW
        wms_vector: {
            visible: true,
            opacity: 0.8,
            source: {
                type: 'TileWMS',
                url: 'http://morgana.planetek.it:8080/geoserver/gwc/service/wms',
                maxScale: 10000,
                params: {
                    LAYERS: 'pkt284:ps_trento_view',
                    VERSION: '1.3.0',
                    //STYLES: 'pkt284:ps_view_style',
                    SRS: 'EPSG:3857',
                    TILED: true,
                    //format_options: 'layout:legend'
                },
                serverType: 'geoserver'
            }
        },
*/
        //BARRITTERI PS VIEW
        wms_vector: {
            visible: true,
            opacity: 0.8,
            source: {
                type: 'TileWMS',
                url: 'http://morgana.planetek.it:8080/geoserver/gwc/service/wms',
                maxScale: 10000,
                params: {
                    LAYERS: 'pkt284:ps_barritteri_view',
                    VERSION: '1.3.0',
                    SRS: 'EPSG:3857',
                    TILED: true
                },
                serverType: 'geoserver'
            }
        },
/*			
        //TRENTO PS QUERY
        wms_vector_features: {
            visible: false,
            source: {
                type: 'TileWMS',
                url: 'http://morgana.planetek.it:8080/geoserver/pkt284/wms',
                params: {
                    LAYERS: 'ps_trento',
                    VERSION: '1.3.0'
                },
                serverType: 'geoserver'
            }
        },
*/
        //BARRITTERI PS QUERY
        wms_vector_features: {
            visible: false,
            source: {
                type: 'TileWMS',
                url: 'http://morgana.planetek.it:8080/geoserver/pkt284/wms',
                params: {
                    LAYERS: 'pkt284:ps_barritteri',
                    VERSION: '1.3.0'
                },
                serverType: 'geoserver'
            }
        },

        wms_sentinel: {
            visible: false,
            source: {
                type: 'TileWMS',
                url: 'http://kim.planetek.it:9080/geoserver/rheticus/wms',
                params: {
                    LAYERS: 'rheticus:dati_sentinel',
                    VERSION: '1.3.0',
                    SRS: 'EPSG:3857',
                    TILED: true
                },
                serverType: 'geoserver'
            }
        },

        wms_vector_sentinel: {
            visible: true,
            source: {
                type: 'GeoJSON',
                url: "jsonData/FeatureCollection.json"
                /*
                geojson: {
                    object:
                        {
                          "type": "Feature",
                          "id": "sentinel1_slc.058a9160-3a6c-49f2-8f7b-fcacde344235",
                          "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                              [
                                [
                                  10.510047,
                                  43.177322
                                ],
                                [
                                  13.618793,
                                  43.572952
                                ],
                                [
                                  13.977547,
                                  41.897419
                                ],
                                [
                                  10.953796,
                                  41.501442
                                ],
                                [
                                  10.510047,
                                  43.177322
                                ]
                              ]
                            ]
                          },
                          "geometry_name": "location",
                          "properties": {
                            "missionDataTakeID": "39012",
                            "superMaster": "false",
                            "familyName": "SENTINEL-1",
                            "productClass": "S",
                            "mode": "IW",
                            "productType": "SLC",
                            "relativeOrbitNumberTypeStop": "117",
                            "startTime": "2015-07-28T17:05:29.874Z",
                            "datasetId": "SENTINEL-1IWIW1117117ASCENDINGVVVHSSLC1143.2",
                            "swath": "IW1",
                            "totalSlices": "11",
                            "instrumentConfigurationID": "5",
                            "cycleNumber": "54",
                            "linkDownload": "https://scihub.esa.int/dhus/odata/v1/Products('058a9160-3a6c-49f2-8f7b-fcacde344235')/$value",
                            "sliceNumber": "8",
                            "number": "A",
                            "pass": "ASCENDING",
                            "stopTime": "2015-07-28T17:05:57.798Z",
                            "transmitterReceiverPolarisation2": "VH",
                            "transmitterReceiverPolarisation1": "VV",
                            "orbitNumberTypeStart": "7014",
                            "ingestion": "2015-07-28T21:31:35.014Z",
                            "orbitNumberTypeStop": "7014",
                            "relativeOrbitNumberTypeStart": "117",
                            "filename": "S1A_IW_SLC__1SDV_20150728T170529_20150728T170557_007014_009864_059D",
                            "uuid": "058a9160-3a6c-49f2-8f7b-fcacde344235"
                          }
                        }
                }
                */
            },
            style: {
                fill: {
                    color: 'rgba(0, 255, 0, 0.6)'
                },
                stroke: {
                    color: 'white',
                    width: 3
                }
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
                active: false
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
        graph_options: default_graph_options,
        data: [],
        getFeatureInfoResponse: []
    });

    $scope.$watch("center.zoom", function (zoom) {
        console.log(zoom);
        $scope.wms = $scope.shouldShowDetails() ? $scope.wms_vector : $scope.wms_raster;
        $scope.legend = $scope.configurationLegend[$scope.shouldShowDetails() ? 'ps' : 'density'].url;
        $scope.legendTitle = $scope.configurationLegend[$scope.shouldShowDetails() ? 'ps' : 'density'].title;
		$scope.legendUom = $scope.configurationLegend[$scope.shouldShowDetails() ? 'ps' : 'density'].uom;
    });

    $scope.$watch("configuration.datasets", function (datasets) {
        var selected = [];
        for (var key in datasets) {
            if (datasets[key].selected){
                selected.push("dataset_id='" + datasets[key].name + "'");
            }
        }
        var cql = selected.join(' OR ');
        if (cql) {
            cql = "("+cql+") AND ";
            cql += "(abs_4(average_speed)>="+$scope.configuration.speedModel.split(";")[0]+" AND abs_4(average_speed)<="+$scope.configuration.speedModel.split(";")[1]+")";
            $scope.wms_vector.source.params.CQL_FILTER = cql;
        } else {
            delete $scope.wms_vector.source.params.CQL_FILTER;
        }
    }, true);

    $scope.$watch("configuration.speedModel", function (speedModel) {
        console.log("watcher: "+speedModel);
        var cql = $scope.wms_vector.source.params.CQL_FILTER;
        if (cql) {
            cql = cql.split("(abs_4(average_speed)>=")[0];
            cql += "(abs_4(average_speed)>="+speedModel.split(";")[0]+" AND abs_4(average_speed)<="+speedModel.split(";")[1]+")";
            $scope.wms_vector.source.params.CQL_FILTER = cql;
        }
    });

    var that=$scope;
    olData.getMap().then(function (map) {
        map.on('singleclick', function (evt) {
            $scope.marker = {};
            
            if ($scope.wms.source==$scope.wms_vector.source){
                //proceed with getFeatureInfo request
                var viewResolution = map.getView().getResolution();
                var wmsSource = new ol.source.TileWMS($scope.wms_vector_features.source);
                var url = wmsSource.getGetFeatureInfoUrl(
                    evt.coordinate, viewResolution, 'EPSG:3857', 
                    {
                        INFO_FORMAT: 'application/json',
                        FEATURE_COUNT: 20,
                        CQL_FILTER: $scope.wms_vector.source.params.CQL_FILTER
                    }
                );

                $http.get(url).success(function (response) {
                    var point = ol.proj.toLonLat(evt.coordinate, 'EPSG:3857');
                    if ($scope.configuration.autocenter) {
                        $scope.center.lat = point[1];
                        $scope.center.lon = point[0];
                        if ($scope.configuration.autozoom) {
                            $scope.center.zoom = 20;
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
                            return this.slice(0, idx) + s + this.slice(idx + Math.abs(rem));
                        };
                    }

                    var chartData = [];
                    var infoResponse = [];
                    //Data is represented as an array of {x,y} pairs.                     
                    that.show_trends= true;
                    if (response.features && (response.features.length > 0)) {
                        
                        $scope.graph_options.title.html = "<b>Trend spostamenti PS ID<b><br>[LAT: "+Math.round(point[1]*10000)/10000+"; LON: "+Math.round(point[0]*10000)/10000+"]";

                        var autoColor = {
                            colors: d3.scale.category20(),
                            index: 0,
                            getColor: function () {
                                return this.colors(this.index++)
                            }
                        };

                        for (var i = 0; i < response.features.length; i++) {
                            //$scope.graph_options.title.text += response.features[i].properties["code"] + ", ";

                            var featureData = [];
                            var featureInfo = {};
                            for (var key in response.features[i].properties) {
                                if (key.startsWith("dl")) {
                                    var FeatureDate = new Date(key.replace("dl", "").splice(6, 0, "/").splice(4, 0, "/"));
                                    if (FeatureDate instanceof Date) {
                                        featureData.push({
                                            x: FeatureDate,
                                            y: response.features[i].properties[key]
                                        });
                                    }
                                }
                                eval("featureInfo." + key + "=response.features[\"" + i + "\"].properties." + key + ";");
                            }


                            chartData.push({
                                values: featureData, //values - represents the array of {x,y} data points
                                key: response.features[i].properties["code"], //key  - the name of the series (PS CODE)
                                //color: '#ff7f0e' //color - optional: choose your own line color.
                                color: autoColor.getColor() //'#ff7f0e' //color - optional: choose your own line color.
                            });

                            infoResponse.push(featureInfo);
                            $scope.marker = {
                                lat: point[1],
                                lon: point[0],
                                label: response.features[0].properties.code
                            };

                        }
                        //$scope.graph_options.title.text = $scope.graph_options.title.text.substr(0, $scope.graph_options.title.text.length - 2);

                    } else {
                        //$scope.graph_options.title.text = "";
                        $scope.show_trends = false;
                    }

                    //Line chart data should be sent as an array of series objects.                
                    $scope.data= chartData;
                    $scope.getFeatureInfoResponse= infoResponse;
                    
                    if(!that.$$phase) {
                        that.$apply();
                    }
                });
            } else {
                console.log("getFeatureInfo request disabled!");
            }

            var wmsSentinel = new ol.source.TileWMS($scope.wms_sentinel.source);
            var urlSentinel = wmsSentinel.getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, 'EPSG:3857', {
                INFO_FORMAT: 'application/json',
                FEATURE_COUNT: 1000
            });

/*
            //GET DATASETS AND RELATIVE SENTINEL1 FEATURES
            var datasetList = [];
            $http.get(urlSentinel).success(function (response) {
                if (response.features && (response.features.length > 0)) {
                    for (var i = 0; i < response.features.length; i++) {
                        if (response.features[i].properties){

                            for (var key in response.features[i].properties) {
                                
                                if (getIndexByAttributeValue(datasetList,"id",response.features[i].properties.datasetId)==-1){
                                    datasetList.push({
                                        "id"	: response.features[i].properties.datasetId
                                        "bbox"	: {
                                            "left"	: response.features[i].geometry.coordinates
                                            "bottom": 
                                            "right"	:
                                            "top"	:
                                        }
                                        response.features[i].properties.datasetId
                                    });
                                } else {
                                    //add 
                                }
                                
                                //console.log(response.features[i].properties[key]);
                            }
                        
                        }
                    }
                } else {
                    console.log("no sentinel data features for selected point!");
                }
            });
*/
            
        });
    });
}]);