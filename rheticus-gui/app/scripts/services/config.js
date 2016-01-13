'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderImage : "./images/RheticusLogo.png",
		timeSlider : {"domain":{"start":"2014-10-01T00:00:00Z","end":""},"brush":{"start":"2014-10-01T00:00:00Z","end":""},"attributes":{"datasetIdentifier":"datasetId"}},
		filters : {"speedSlider":{"init":"-10;10","from":-10,"to":10,"step":0.5,"dimension":" mm/year","scale":[-10,"|",-5,"|",0,"|",5,"|",10]},"coherenceSlider":{"init":"0;100","from":0,"to":100,"step":1,"dimension":" %","scale":[0,"|",25,"|",50,"|",75,"|",100]}},
		map : {"center":{"lon":15.85,"lat":38.325,"zoom":14,"bounds":[],"projection":"EPSG:4326"},"query":{"zoom":16},"crs":"EPSG:3857"},
		aoi : [{"name":" Demo_CSK_Barritteri","center":{"lon":15.8461207,"lat":38.3290608,"zoom":14},"station":"IT-LICF"},{"name":" Demo_CSK_Trento","center":{"lon":11.1257601,"lat":46.0664228,"zoom":12},"station":"IT-LIVP"}],
		dataProviders : [{"name":" Sentinel"},{"name":" Cosmo"}],
		geocoder : {"url":"http://nominatim.openstreetmap.org/search?q=","params":"&limit=5&format=json","paramsReverse":"&limit=1&format=json&zoom=18","urlReverse":"http://nominatim.openstreetmap.org/reverse?"},
		//custom environment configuration
		layers : {"baselayers":[{"name":"OpenStreetMap","group":"base","source":{"type":"OSM"},"active":false,"opacity":1,"layerOptions":{"attribution":"© OpenStreetMap contributors","url":"http://www.openstreetmap.org/copyright"}},{"name":"Ortofoto RealVista 1.0","group":"base","source":{"type":"TileWMS","crossOrigin":"null","urls":["http://kim.planetek.it:9080/geoserver/rheticus/gwc/service/wms"],"params":{"LAYERS":"rheticus:rv1","TILED":true},"serverType":"geoserver"},"active":true,"opacity":1,"layerOptions":{"attribution":"Imagery © Realvista contributors","url":"http://www.realvista.it/"}}],"overlays":{"olLayers":[{"id":"iffi","name":"Aree a rischio frana","group":"Overlays","source":{"type":"TileWMS","crossOrigin":"null","urls":["http://www.geoservices.isprambiente.it/arcgis/services/IFFI/Progetto_IFFI_WMS_public/MapServer/WMSServer"],"params":{"LAYERS":"1,2,3,21,22,24,97,98,99","TILED":true}},"active":false,"opacity":0.8,"layerOptions":{"attribution":"Progetto IFFI (Inventario dei Fenomeni Franosi in Italia) ISPRA","url":"http://www.progettoiffi.isprambiente.it"}},{"id":"sentinel","name":"Sentinel 1 Datasets GeoJSON","group":"Overlays","source":{"type":"GeoJSON","geojson":{"projection":"EPSG:3857","object":{}}},"style":{"fill":{"color":"rgba(255, 0, 0, 0.05)"},"stroke":{"color":"white","width":3}},"active":false,"opacity":0.8,"layerOptions":{"attribution":"","url":""}},{"id":"ps","name":"Persistent Scatterers Map","group":"Overlays","source":{"type":"TileWMS","crossOrigin":"null","urls":["http://kim.planetek.it:9080/geoserver/rheticus/gwc/service/wms"],"params":{"LAYERS":"rheticus:ps","TILED":true},"serverType":"geoserver"},"active":true,"opacity":1,"layerOptions":{"attribution":"","url":""}}],"metadata":[{"id":"iffi","type":"ImageWMS","queryUrl":"http://kim.planetek.it:8080/iffi","legend":{"title":"Landslide Maps","description":"Here you will control the visualization of landslide maps covering the area (IFFI catalog).Single-clicking a point in the landslide enables the access to the features of the landlside.","uom":"","url":{"tipologia_frana":"./images/Frane.png","area_frane_diffuse":"./images/Aree_frane_diffuse.png","piff":"./images/Punto_identificativo_frana.png"}},"custom":{"LAYERS":[{"id":"1","name":"comuni"},{"id":"2","name":"province"},{"id":"3","name":"regioni"},{"id":"5","name":"Veneto_DGPV"},{"id":"6","name":"Veneto_Aree_frane_diffuse"},{"id":"7","name":"Veneto_Frane"},{"id":"8","name":"Veneto_Punto_identificativo_frana"},{"id":"10","name":"ValledAosta_DGPV"},{"id":"11","name":"ValledAosta_Aree_frane_diffuse"},{"id":"12","name":"ValledAosta_Frane"},{"id":"13","name":"ValledAosta_Frane_Lineari"},{"id":"14","name":"ValledAosta_Punto_identificativo_frana"},{"id":"16","name":"Umbria_Aree_frane_diffuse"},{"id":"17","name":"Umbria_Frane"},{"id":"18","name":"Umbria_Punto_identificativo_frana"},{"id":"20","name":"Trento_DGPV"},{"id":"21","name":"Trento_Aree_frane_diffuse"},{"id":"22","name":"Trento_Frane"},{"id":"23","name":"Trento_Frane_Lineari"},{"id":"24","name":"Trento_Punto_identificativo_frana"},{"id":"26","name":"Toscana_DGPV"},{"id":"27","name":"Toscana_Aree_frane_diffuse"},{"id":"28","name":"Toscana_Frane"},{"id":"29","name":"Toscana_Frane_Lineari"},{"id":"30","name":"Toscana_Punto_identificativo_frana"},{"id":"32","name":"Sicilia_DGPV"},{"id":"33","name":"Sicilia_Aree_frane_diffuse"},{"id":"34","name":"Sicilia_Frane"},{"id":"35","name":"Sicilia_Frane_Lineari"},{"id":"36","name":"Sicilia_Punto_identificativo_frana"},{"id":"38","name":"Sardegna_DGPV"},{"id":"39","name":"Sardegna_Aree_frane_diffuse"},{"id":"40","name":"Sardegna_Frane"},{"id":"41","name":"Sardegna_Frane_Lineari"},{"id":"42","name":"Sardegna_Punto_identificativo_frana"},{"id":"44","name":"Puglia_Aree_frane_diffuse"},{"id":"45","name":"Puglia_Frane"},{"id":"46","name":"Puglia_Frane_Lineari"},{"id":"47","name":"Puglia_Punto_identificativo_frana"},{"id":"48","name":"Piemonte_DGPV"},{"id":"49","name":"Piemonte_Aree_frane_diffuse"},{"id":"50","name":"Piemonte_Frane"},{"id":"51","name":"Piemonte_Frane_Lineari"},{"id":"52","name":"Piemonte_Punto_identificativo_frana"},{"id":"54","name":"Molise_DGPV"},{"id":"55","name":"Molise_Aree_frane_diffuse"},{"id":"56","name":"Molise_Frane"},{"id":"57","name":"Molise_Punto_identificativo_frana"},{"id":"59","name":"Marche_DGPV"},{"id":"60","name":"Marche_Aree_frane_diffuse"},{"id":"61","name":"Marche_Frane"},{"id":"63","name":"Marche_Punto_identificativo_frana"},{"id":"64","name":"Lombardia_DGPV"},{"id":"65","name":"Lombardia_Aree_frane_diffuse"},{"id":"66","name":"Lombardia_Frane"},{"id":"67","name":"Lombardia_Frane_Lineari"},{"id":"68","name":"Lombardia_Punto_identificativo_frana"},{"id":"70","name":"Liguria_DGPV"},{"id":"71","name":"Liguria_Aree_frane_diffuse"},{"id":"72","name":"Liguria_Frane"},{"id":"73","name":"Liguria_Frane_Lineari"},{"id":"74","name":"Liguria_Punto_identificativo_frana"},{"id":"76","name":"Lazio_DGPV"},{"id":"77","name":"Lazio_Aree_frane_diffuse"},{"id":"78","name":"Lazio_Frane"},{"id":"79","name":"Lazio_Punto_identificativo_frana"},{"id":"81","name":"FriuliVeneziaGiulia_DGPV"},{"id":"82","name":"FriuliVeneziaGiulia_Aree_frane_diffuse"},{"id":"83","name":"FriuliVeneziaGiulia_Frane"},{"id":"84","name":"FriuliVeneziaGiulia_Punto_identificativo_frana"},{"id":"86","name":"EmiliaRomagna_DGPV"},{"id":"87","name":"EmiliaRomagna_Frane"},{"id":"88","name":"EmiliaRomagna_Punto_identificativo_frana"},{"id":"90","name":"Campania_DGPV"},{"id":"91","name":"Campania_Aree_frane_diffuse"},{"id":"92","name":"Campania_Frane"},{"id":"93","name":"Campania_Frane_Lineari"},{"id":"94","name":"Campania_Punto_identificativo_frana"},{"id":"96","name":"Calabria_DGPV"},{"id":"97","name":"Calabria_Aree_frane_diffuse"},{"id":"98","name":"Calabria_Frane"},{"id":"99","name":"Calabria_Punto_identificativo_frana"},{"id":"101","name":"Bolzano_DGPV"},{"id":"102","name":"Bolzano_Aree_frane_diffuse"},{"id":"103","name":"Bolzano_Frane"},{"id":"104","name":"Bolzano_Frane_Lineari"},{"id":"105","name":"Bolzano_Punto_identificativo_frana"},{"id":"107","name":"Basilicata_Aree_frane_diffuse"},{"id":"108","name":"Basilicata_Frane"},{"id":"109","name":"Basilicata_Punto_identificativo_frana"},{"id":"111","name":"Abruzzo_DGPV"},{"id":"112","name":"Abruzzo_Aree_frane_diffuse"},{"id":"113","name":"Abruzzo_Frane"},{"id":"114","name":"Abruzzo_Punto_identificativo_frana"}]}},{"id":"sentinel","type":"ImageWMS","queryUrl":"http://kim.planetek.it:8080/geoserver/rheticus/wms","legend":{"title":"Sentinel Catalog","description":"Here you will query the whole Sentinel-1 (S1) catalog by single-clicking a point on the map.Then you will check the S1 population and dataset identification for PS processing. ","uom":"","url":{"nothing":""}},"custom":{"LAYERS":[{"id":"rheticus:slc","name":"sentinel 1"}]}},{"id":"ps","type":"ImageWMS","queryUrl":"http://kim.planetek.it:8080/geoserver/rheticus/wms","legend":{"title":"Displacement Maps","description":"Here you will find the list of displacement maps covering the area.Choose your map and single-click each point of the map to enable the access to the measurements. ","uom":"[mm/year]","url":{"velocity":"./images/legend_vel_ps.png"}},"custom":{"LAYERS":[{"id":"rheticus:ps","name":"Persistent Scatterers"}],"heatmap":"rheticus:ps","detail":"rheticus:ps","measureUrl":"http://kim.planetek.it:8080/rheticusapi/api/v1/datasets/datasetid/pss/psid/measures?type=DL","datasetid":"datasetid","psid":"psid","date":"data","measure":"measure"}}]}},
		authentication : {"url":"http://kim.planetek.it:8080/rheticusapi/api/v1/authenticate?"},
		weatherAPI : {"url":"http://kim.planetek.it:8080/rheticusapi/api/v1/meteostations/"}
	});
