'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderTitle : 'Rheticus™',
		timeSlider : {"domain":{"start":"2014-10-01T00:00:00Z","end":""},"brush":{"start":"2014-10-01T00:00:00Z","end":""},"attributes":{"CQL_FILTER":{"startDate":"startTime","endDate":"stopTime"},"datasetIdentifier":"datasetId"}},
		filters : {"speedSlider":{"init":"0;20","from":0,"to":20,"step":0.5,"dimension":"mm/year","scale":[0,"|",5,"|",10,"|",15,"|",20]},"coherenceSlider":{"_comment":"NOT YET IMPLEMENTED","init":"75;100","from":75,"to":100,"step":0.5,"dimension":"%","scale":[75,"|",90,"|",100]}},
		map : {"center":{"lon":15.85,"lat":38.325,"zoom":14},"query":{"zoom":16},"crs":"EPSG:3857"},
		aoi : [{"name":"Demo Barritteri","bbox":{},"selected":true},{"name":"Demo Trento","bbox":{},"selected":false}],
		//custom environment configuration
		legends : {"_comment":"Barritteri legend style","velocity":{"title":"Velocità PS ","uom":"[mm/period]","url":"http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_barritteri_raster&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true"},"density":{"title":"Densità PS ","uom":"[ps/100㎡]","url":"http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_barritteri_raster&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true"},"ps":{"title":"Velocità PS ","uom":"[mm/period]","url":"http://morgana.planetek.it:8080/geoserver/pkt284/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=pkt284:ps_barritteri_view&TRANSPARENT=true&LEGEND_OPTIONS=fontColor:0xffffff;fontAntiAliasing:true&STYLE=pkt284:ps_legend_style_v2"}},
		layers : {"baselayers":[{"name":"OpenStreetMap","source":{"type":"OSM"},"active":true,"visible":false,"opacity":1},{"name":"MapBox Night","source":{"type":"TileJSON","url":"https://api.tiles.mapbox.com/v3/examples.map-0l53fhk2.jsonp"},"active":true,"visible":false,"opacity":1},{"name":"Mapbox Geography","source":{"type":"TileJSON","url":"http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp"},"active":true,"visible":false,"opacity":1},{"name":"e-Geos Ortofoto RealVista 1.0","source":{"type":"TileWMS","urls":["http://morgana.planetek.it:8080/geoserver/gwc/service/wms"],"params":{"LAYERS":"pkt284:rv1","VERSION":"1.3.0","SRS":"EPSG:3857","TILED":true},"serverType":"geoserver"},"active":true,"visible":true,"opacity":1}],"overlays":{"barritteri":{"heatmap":{"name":"Barritteri Heat Map","source":{"type":"TileWMS","urls":["http://morgana.planetek.it:8080/geoserver/gwc/service/wms"],"minScale":10000,"params":{"LAYERS":"pkt284:ps_barritteri_raster","VERSION":"1.3.0","SRS":"EPSG:3857","TILED":true},"serverType":"geoserver"},"active":true,"visible":true,"opacity":0.8},"view":{"name":"Barritteri Persistent Scatterers Map","source":{"type":"TileWMS","urls":["http://morgana.planetek.it:8080/geoserver/gwc/service/wms"],"maxScale":10000,"params":{"LAYERS":"pkt284:ps_barritteri_view","VERSION":"1.3.0","SRS":"EPSG:3857","TILED":true},"serverType":"geoserver"},"active":true,"visible":true,"opacity":0.8},"query":{"name":"Barritteri Persistent Scatterers Map Query","source":{"type":"TileWMS","urls":["http://morgana.planetek.it:8080/geoserver/pkt284/wms"],"params":{"LAYERS":"pkt284:ps_barritteri","VERSION":"1.3.0","SRS":"EPSG:3857"},"serverType":"geoserver"},"active":true,"visible":false}},"trento":{"heatmap":{"name":"Trento Heat Map","source":{"type":"TileWMS","urls":["http://morgana.planetek.it:8080/geoserver/gwc/service/wms"],"minScale":10000,"params":{"LAYERS":"pkt284:PS_heatmap_100m","VERSION":"1.3.0","SRS":"EPSG:3857","TILED":true},"serverType":"geoserver"},"active":true,"visible":true,"opacity":0.8},"view":{"name":"Trento Persistent Scatterers Map","source":{"type":"TileWMS","urls":["http://morgana.planetek.it:8080/geoserver/gwc/service/wms"],"maxScale":10000,"params":{"LAYERS":"pkt284:ps_trento_view","VERSION":"1.3.0","SRS":"EPSG:3857","TILED":true},"serverType":"geoserver"},"active":true,"visible":true,"opacity":0.8},"query":{"name":"Trento Persistent Scatterers Map Query","source":{"type":"TileWMS","urls":["http://morgana.planetek.it:8080/geoserver/pkt284/wms"],"params":{"LAYERS":"ps_trento","VERSION":"1.3.0","SRS":"EPSG:3857"},"serverType":"geoserver"},"active":true,"visible":false}},"sentinel":{"view":{"name":"Sentinel 1 Datasets GeoJSON","source":{"type":"GeoJSON","geojson":{}},"active":true,"visible":true},"query":{"name":"Sentinel 1 Datasets Query","source":{"type":"TileWMS","urls":["http://kim.planetek.it:9080/geoserver/rheticus/wms"],"params":{"LAYERS":"rheticus:slc","VERSION":"1.3.0","SRS":"EPSG:3857","TILED":true},"serverType":"geoserver"},"active":true,"visible":false}}}}
	});
