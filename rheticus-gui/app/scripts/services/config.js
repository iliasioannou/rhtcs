'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderImage : "./images/RheticusLogo.png",
		timeSlider : {"domain":{"start":"2014-10-01T00:00:00Z","end":""},"brush":{"start":"2014-10-01T00:00:00Z","end":""},"attributes":{"CQL_FILTER":{"startDate":"startTime","endDate":"stopTime"},"datasetIdentifier":"datasetId"}},
		filters : {"speedSlider":{"init":"0;20","from":0,"to":20,"step":0.5,"dimension":"mm/year","scale":[0,"|",5,"|",10,"|",15,"|",20]},"coherenceSlider":{"_comment":"NOT YET IMPLEMENTED","init":"75;100","from":75,"to":100,"step":0.5,"dimension":"%","scale":[75,"|",90,"|",100]}},
		map : {"center":{"lon":15.85,"lat":38.325,"zoom":14},"query":{"zoom":16},"crs":"EPSG:3857"},
		aoi : [{"name":"Demo Barritteri","bbox":{},"selected":true},{"name":"Demo Trento","bbox":{},"selected":false}],
		//custom environment configuration
		legends : {"ps":{"title":"PS Velocity","uom":"[mm/year]","url":"./images/legend_vel_ps.png"},"iffi":{"title":"Frane","uom":"","url":["./images/Aree_frane_diffuse.png","./images/Frane.png","./images/Punto_identificativo_frana.png"]}},
		layers : {"baselayers":[{"name":"OpenStreetMap","group":"base","source":{"type":"OSM"},"visible":false,"active":false,"opacity":1},{"name":"Ortofoto RealVista 1.0","group":"base","source":{"type":"TileWMS","urls":["http://kim.planetek.it:9080/geoserver/rheticus/gwc/service/wms"],"params":{"LAYERS":"rheticus:rv1","TILED":true},"serverType":"geoserver"},"visible":true,"active":true,"opacity":1}],"overlays":{"olLayers":[{"id":"iffi","name":"Aree a rischio frana","group":"Overlays","source":{"type":"TileWMS","urls":["http://kim.planetek.it:9080/geoserver/rheticus/gwc/service/wms"],"params":{"LAYERS":"rheticus:97,rheticus:98,rheticus:99","TILED":true},"serverType":"geoserver"},"visible":false,"active":false,"opacity":0.8},{"id":"sentinel","name":"Sentinel 1 Datasets GeoJSON","group":"Overlays","source":{"type":"GeoJSON","url":"./stub/geojson.json"},"visible":false,"active":false,"opacity":0.8},{"id":"ps","name":"Persistent Scatterers Map","group":"Overlays","source":{"type":"TileWMS","urls":["http://kim.planetek.it:9080/geoserver/rheticus/gwc/service/wms"],"params":{"LAYERS":"rheticus:ps_barritteri_raster","TILED":true},"serverType":"geoserver"},"visible":true,"active":true,"opacity":0.8}],"metadata":[{"id":"iffi","type":"","queryUrl":"","custom":{}},{"id":"sentinel","type":"ImageWMS","queryUrl":"http://kim.planetek.it:9080/geoserver/rheticus/wms","custom":{"LAYERS":"rheticus:slc"}},{"id":"ps","type":"RheticusApiRest","queryUrl":"http://kim.planetek.it:8081/api/v1/datasets/datasetid/pss/psid/measures?type=DL","custom":{"heatmap":"rheticus:ps_barritteri_raster","detail":"rheticus:ps","datasetid":"datasetid","psid":"psid","date":"data","measure":"measure"}}]}}
	});
