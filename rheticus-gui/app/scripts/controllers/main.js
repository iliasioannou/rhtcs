'use strict';

/**
 * @ngdoc function
 * @name workspacePilotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspacePilotApp
 */
angular.module('workspacePilotApp')

.controller('DemoCtrl', ['$scope', function($scope){
    $scope.title = "Timeline using d3.js";
    $scope.data = [];
}])
.directive('d3Bars', [function() {
    return {
		restrict: 'EA',
		replace: true,
		scope: {
			data: "="
		},
		link: function(scope, ele, attrs) {
			//data
			var lanes = ["Dataset1","Dataset2","Dataset3"],
				laneLength = lanes.length,
				items = [{"lane": 0, "id": "", "start": 5, "end": 6},
						{"lane": 0, "id": "", "start": 265, "end": 266},
						{"lane": 0, "id": "", "start": 615, "end": 616},
						{"lane": 0, "id": "", "start": 900, "end": 901},
						{"lane": 0, "id": "", "start": 1265, "end": 1266},
						{"lane": 0, "id": "", "start": 1365, "end": 1366},
						{"lane": 0, "id": "", "start": 1640, "end": 1641},
						{"lane": 0, "id": "", "start": 1910, "end": 1911},
						{"lane": 1, "id": "", "start": 530, "end": 531},
						{"lane": 1, "id": "", "start": 700, "end": 701},
						{"lane": 1, "id": "", "start": 790, "end": 791},
						{"lane": 1, "id": "", "start": 1180, "end": 1181},
						{"lane": 1, "id": "", "start": 1330, "end": 1331},
						{"lane": 1, "id": "", "start": 1560, "end": 1561},
						{"lane": 1, "id": "", "start": 1860, "end": 1861},
						{"lane": 1, "id": "", "start": 1900, "end": 1901},
						{"lane": 1, "id": "", "start": 1920, "end": 1921},
						{"lane": 1, "id": "", "start": 1985, "end": 1986},
						{"lane": 1, "id": "", "start": 1990, "end": 1991},
						{"lane": 2, "id": "", "start": 670, "end": 671},
						{"lane": 2, "id": "", "start": 690, "end": 691},
						{"lane": 2, "id": "", "start": 1380, "end": 1381},
						{"lane": 2, "id": "", "start": 1390, "end": 1391},
						{"lane": 2, "id": "", "start": 1945, "end": 1946}],
				timeBegin = 0,
				timeEnd = 2000;
			
			var m = [20, 15, 15, 120], //top right bottom left
				w = 960 - m[1] - m[3],
				h = 500 - m[0] - m[2],
				miniHeight = laneLength * 12 + 50,
				mainHeight = 0;/*h - miniHeight - 50;*/

			//scales
			var x = d3.scale.linear()
				.domain([timeBegin, timeEnd])
				.range([0, w]);
			var x1 = d3.scale.linear()
				.range([0, w]);
			var y1 = d3.scale.linear()
				.domain([0, laneLength])
				.range([0, mainHeight]);
			var y2 = d3.scale.linear()
				.domain([0, laneLength])
				.range([0, miniHeight]);
			  
			var chart = d3.select(ele[0])
				.append("svg")
				.attr("width", w + m[1] + m[3])
				.attr("height", h + m[0] + m[2])
				.attr("class", "chart");

			chart.append("defs").append("clipPath")
				.attr("id", "clip")
				.append("rect")
				.attr("width", w)
				.attr("height", mainHeight);
/*
			var main = chart.append("g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")")
				.attr("width", w)
				.attr("height", mainHeight)
				.attr("class", "main");
*/
			var mini = chart.append("g")
				.attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
				.attr("width", w)
				.attr("height", miniHeight)
				.attr("class", "mini");
					
			/*	
			angular.forEach(scope.data, function (item, index) {
				  svg.append('rect')
				.attr('height', 20)
				.attr('width', item.score)
				.attr('x', 0)
				.attr('y', 20*index)
				.attr('fill', item.color);
			  })
			  */
/*
			//main lanes and texts
			main.append("g").selectAll(".laneLines")
				.data(items)
				.enter().append("line")
				.attr("x1", m[1])
				.attr("y1", function(d) {return y1(d.lane);})
				.attr("x2", w)
				.attr("y2", function(d) {return y1(d.lane);})
				.attr("stroke", "lightgray")

			main.append("g").selectAll(".laneText")
				.data(lanes)
				.enter().append("text")
				.text(function(d) {return d;})
				.attr("x", -m[1])
				.attr("y", function(d, i) {return y1(i + .5);})
				.attr("dy", ".5ex")
				.attr("text-anchor", "end")
				.attr("class", "laneText");
*/
			//mini lanes and texts
			mini.append("g").selectAll(".laneLines")
				.data(items)
				.enter().append("line")
				.attr("x1", m[1])
				.attr("y1", function(d) {return y2(d.lane);})
				.attr("x2", w)
				.attr("y2", function(d) {return y2(d.lane);})
				.attr("stroke", "lightgray");

			mini.append("g").selectAll(".laneText")
				.data(lanes)
				.enter().append("text")
				.text(function(d) {return d;})
				.attr("x", -m[1])
				.attr("y", function(d, i) {return y2(i + .5);})
				.attr("dy", ".5ex")
				.attr("text-anchor", "end")
				.attr("class", "laneText");
/*
			var itemRects = main.append("g")
				.attr("clip-path", "url(#clip)");
*/
			//mini item rects
			mini.append("g").selectAll("miniItems")
				.data(items)
				.enter().append("rect")
				.attr("class", function(d) {return "miniItem" + d.lane;})
				.attr("x", function(d) {return x(d.start);})
				.attr("y", function(d) {return y2(d.lane + .5) - 5;})
				.attr("width", function(d) {return x(d.end - d.start);})
				.attr("height", 10);

			//mini labels
			mini.append("g").selectAll(".miniLabels")
				.data(items)
				.enter().append("text")
				.text(function(d) {return d.id;})
				.attr("x", function(d) {return x(d.start);})
				.attr("y", function(d) {return y2(d.lane + .5);})
				.attr("dy", ".5ex");

			//brush
			var brush = d3.svg.brush()
				.x(x)
				.on("brush", display);

			mini.append("g")
				.attr("class", "x brush")
				.call(brush)
				.selectAll("rect")
				.attr("y", 1)
				.attr("height", miniHeight - 1);

			display();

			function display() {
				/*
				var rects, labels,
					minExtent = brush.extent()[0],
					maxExtent = brush.extent()[1],
					visItems = items.filter(function(d) {return d.start < maxExtent && d.end > minExtent;});

				mini.select(".brush")
					.call(brush.extent([minExtent, maxExtent]));

				x1.domain([minExtent, maxExtent]);

				//update main item rects
				rects = itemRects.selectAll("rect")
						.data(visItems, function(d) { return d.id; })
					.attr("x", function(d) {return x1(d.start);})
					.attr("width", function(d) {return x1(d.end) - x1(d.start);});
				
				rects.enter().append("rect")
					.attr("class", function(d) {return "miniItem" + d.lane;})
					.attr("x", function(d) {return x1(d.start);})
					.attr("y", function(d) {return y1(d.lane) + 10;})
					.attr("width", function(d) {return x1(d.end) - x1(d.start);})
					.attr("height", function(d) {return .8 * y1(1);});

				rects.exit().remove();

				//update the item labels
				labels = itemRects.selectAll("text")
					.data(visItems, function (d) { return d.id; })
					.attr("x", function(d) {return x1(Math.max(d.start, minExtent) + 2);});

				labels.enter().append("text")
					.text(function(d) {return d.id;})
					.attr("x", function(d) {return x1(Math.max(d.start, minExtent));})
					.attr("y", function(d) {return y1(d.lane + .5);})
					.attr("text-anchor", "start");

				labels.exit().remove();
*/
			}

		}
	};
  }])
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
            selectedDatasets: [],
            timeModel: "1",
            timeOptions: {
                from: 1,
                to: $scope.selectableDates.length - 1,
                step: 1,
                modelLabels: $scope.selectableDates,
                dimension: ""
            },
            speedModel: $scope.configuration.speedModel,
            speedOptions: {
                from: -20,
                to: 20,
                step: 1,
                dimension: " mm/year",
                scale: [-20, '|', -10, '|', 0, '|', 10, '|', 20],
                css: {
                    background: {"background-color": "silver"},
                    before: {"background-color": "purple"},
                    default: {"background-color": "white"},
                    after: {"background-color": "green"},
                    pointer: {"background-color": "red"}
                },
                callback: function(value, released) {
                    // useful when combined with 'realtime' option 
                    // released it triggered when mouse up 
                    console.log(value + " " + released);
					$scope.configuration.speedModel = value;
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
        /*
		$scope.$watch("datasets", function (datasets) {
            if (datasets)
                $scope.wms.source.params.CQL_FILTER = "dataset_id=" + dataset;
        }, true);
		*/

    }])
    .controller('MainCtrl', ['$rootScope', '$scope', '$http', 'olData', function ($rootScope, $scope, $http, olData) {
        angular.extend($scope, {
            legends: [
				//TRENTO
				//SERVIZIO DEI PS IN VISUALIZZAZIONE
                //'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_limit&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true&STYLE=ps_limit_legend',
				//HEATMAP DENSITA'
                //'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:PS_heatmap_100m&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true'

				//BARRITTERI
				//SERVIZIO DEI PS IN VISUALIZZAZIONE
				'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_barritteri_view&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true&STYLE=pkt284:ps_legend_style',
				//HEATMAP VELOCITA'
				'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_barritteri_raster_vel&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true'
				//HEATMAP DENSITA'
				//'http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_barritteri_raster&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true'

            ],
            legendsTitle: ['Velocità PS (mm/year)', 'Velocità PS'],
        });
        angular.extend($scope, {
            rc: {},
            legend: $scope.legends[0],
            legendTitle: $scope.legendsTitle[0],
			center: $rootScope.configuration.center,
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
                        TILED: true,
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
                        TILED: true,
                    },
                    serverType: 'geoserver'
                }
            },
/*
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
*/
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
                        TILED: true,
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

            wms_vector_sentinel: {
                visible: false,
                source: {
                    type: 'TileWMS',
                    url: 'http://kim.planetek.it:9080/geoserver/rheticus/wms',
                    params: {
                        LAYERS: 'rheticus:dati_sentinel',
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
                        tickFormat: function (d) {
                                return d3.time.format('%d/%m/%Y')(new Date(d));
                            }
                    },
                    yAxis: {
                        axisLabel: 'Spostamento (mm)',
                        tickFormat: function (d) {
                            return d3.format('.02f')(d);
                        },
                        axisLabelDistance: -10
                    },
                    callback: function (chart) {
						//do nothing
                    }
                },
                title: {
                    enable: true,
                    text: ''
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

        $scope.$watch("center.zoom", function (zoom) {
            console.log(zoom);
            $scope.wms = $scope.shouldShowDetails() ? $scope.wms_vector : $scope.wms_raster;
            $scope.legend = $scope.legends[$scope.shouldShowDetails() ? 0 : 1];
            $scope.legendTitle = $scope.legendsTitle[$scope.shouldShowDetails() ? 0 : 1];
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
				cql += "(average_speed>="+$scope.configuration.speedModel.split(";")[0]+" AND average_speed<="+$scope.configuration.speedModel.split(";")[1]+")";
				$scope.wms_vector.source.params.CQL_FILTER = cql;
            } else {
                delete $scope.wms_vector.source.params.CQL_FILTER;
			}
        }, true);

        $scope.$watch("configuration.speedModel", function (speedModel) {
            console.log(speedModel);
			var cql = $scope.wms_vector.source.params.CQL_FILTER;
			if (cql) {
				cql = cql.split("(average_speed>=")[0];
				cql += "(average_speed>="+speedModel.split(";")[0]+" AND average_speed<="+speedModel.split(";")[1]+")";
				$scope.wms_vector.source.params.CQL_FILTER = cql;
			}
        });

        olData.getMap().then(function (map) {
            map.on('singleclick', function (evt) {
				
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
						if (response.features && (response.features.length > 0)) {
							$scope.show_panel = true;
							//$scope.graph_options.title.text = "PS ID: ";

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
							$scope.show_panel = false;
						}

						//Line chart data should be sent as an array of series objects.                
						$scope.data = [];
						angular.extend($scope.data, chartData);
						angular.extend($scope, {
							getFeatureInfoResponse: infoResponse
						});
						$scope.rc.api.update();
					});
				} else {
					console.log("getFeatureInfo request disabled!");
				}

				/*
				var wmsSentinel = new ol.source.TileWMS($scope.wms_vector_sentinel.source);
                var urlSentinel = wmsSentinel.getGetFeatureInfoUrl(
                    evt.coordinate, viewResolution, 'EPSG:3857', {
                    INFO_FORMAT: 'application/json',
                    FEATURE_COUNT: 10
                });
                $http.get(urlSentinel).success(function (response) {
					if (response.features && (response.features.length > 0)) {
                        for (var i = 0; i < response.features.length; i++) {
                            for (var key in response.features[i].properties) {
								console.log(response.features[i].properties[key]);
                            }
                        }
                    } else {
                        // do nothing
                    }
                });
				*/
				
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