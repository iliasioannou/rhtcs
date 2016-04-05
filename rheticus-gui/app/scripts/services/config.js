'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderImage : "./images/RheticusLogo.png",
		timeSlider : {"domain":{"start":"2014-10-01T00:00:00Z","end":""},"brush":{"start":"2014-10-01T00:00:00Z","end":""},"attributes":{"datasetIdentifier":"datasetId"}},
		filters : {"speedSlider":{"init":"-10;10","from":-10,"to":10,"step":0.5,"dimension":" mm/year","scale":[-10,"|",-5,"|",0,"|",5,"|",10]},"coherenceSlider":{"init":"85;100","from":70,"to":100,"step":1,"dimension":" %","scale":[70,"|",80,"|",90,"|",100]}},
		map : {"center":{"lon":15.85,"lat":38.325,"zoom":14,"bounds":[],"projection":"EPSG:4326"},"query":{"zoom":7},"crs":"EPSG:3857"},
		dataProviders : [{"name":" Sentinel","checked":true},{"name":" Cosmo","checked":true},{"name":" TerraSAR-X","checked":true}],
		geocoder : {"url":"http://nominatim.openstreetmap.org/search?q=","params":"&limit=5&format=json&accept-language=en&polygon_geojson=1","paramsReverse":"&limit=1&format=json&zoom=18&accept-language=en","urlReverse":"http://nominatim.openstreetmap.org/reverse?"},
		cesiumViewer : {"url":"http://orbis.planetek.it/apps/rheticus","mapId":"RHETICUS_PS"},
		//custom environment configuration
		layers : {"baselayers":[{"name":"OpenStreetMap","group":"base","source":{"type":"OSM","crossOrigin":"null"},"active":false,"visible":true,"opacity":1,"layerOptions":{"attribution":"© OpenStreetMap contributors","url":"http://www.openstreetmap.org/copyright"}},{"name":"Ortofoto RealVista 1.0","group":"base","source":{"type":"TileWMS","crossOrigin":"null","urls":["http://locationHost/basemap"],"params":{"LAYERS":"rv1","TILED":true,"FORMAT":"image/jpeg"}},"active":true,"visible":true,"opacity":1,"layerOptions":{"attribution":"Imagery © Realvista contributors","url":"http://www.realvista.it/"}}],"overlays":{"olLayers":[{"id":"iffi","name":"Aree a rischio frana","group":"Overlays","source":{"type":"TileWMS","crossOrigin":"null","urls":["http://www.geoservices.isprambiente.it/arcgis/services/IFFI/Progetto_IFFI_WMS_public/MapServer/WMSServer"],"params":{"LAYERS":"1,2,3,21,22,24,33,34,36,97,98,99","TILED":true}},"active":true,"visible":false,"opacity":0.8,"layerOptions":{"attribution":"Progetto IFFI (Inventario dei Fenomeni Franosi in Italia) ISPRA","url":"http://www.progettoiffi.isprambiente.it"}},{"id":"sentinel","name":"Sentinel 1 Datasets GeoJSON","group":"Overlays","source":{"type":"GeoJSON","geojson":{"projection":"EPSG:3857","object":{}}},"style":{"fill":{"color":"rgba(255, 0, 0, 0.05)"},"stroke":{"color":"white","width":3}},"active":true,"visible":false,"opacity":0.8,"layerOptions":{"attribution":"","url":""}},{"id":"psCandidate","name":"Persistent Scatterers Candidate Map","group":"Overlays","source":{"type":"TileWMS","crossOrigin":"null","urls":["http://locationHost/geoserver/rheticus/gwc/service/wms"],"params":{"LAYERS":"rheticus:vw_ps_candidate","TILED":true},"serverType":"geoserver"},"active":true,"visible":false,"opacity":0.8,"layerOptions":{"attribution":"","url":""}},{"id":"ps","name":"Persistent Scatterers Map","group":"Overlays","source":{"type":"TileWMS","crossOrigin":"null","urls":["http://locationHost/geoserver/rheticus/gwc/service/wms"],"params":{"LAYERS":"rheticus:vw_ps","TILED":true},"serverType":"geoserver"},"active":true,"visible":true,"opacity":1,"layerOptions":{"attribution":"","url":""}}],"metadata":[{"id":"iffi","type":"ImageWMS","queryUrl":"http://locationHost/iffi","legend":{"title":"Landslide Maps","description":"Here you will control the visualization of landslide maps covering the area (IFFI catalog).Single-clicking a point in the landslide enables the access to the features of the landlside.","uom":"","url":{"tipologia_frana":"./images/Frane.png","area_frane_diffuse":"./images/Aree_frane_diffuse.png","piff":"./images/Punto_identificativo_frana.png"}},"custom":{"LAYERS":[{"id":"1","name":"comuni","queryable":false},{"id":"2","name":"province","queryable":false},{"id":"3","name":"regioni","queryable":false},{"id":"5","name":"Veneto_DGPV","queryable":true},{"id":"6","name":"Veneto_Aree_frane_diffuse","queryable":true},{"id":"7","name":"Veneto_Frane","queryable":true},{"id":"8","name":"Veneto_Punto_identificativo_frana","queryable":true},{"id":"10","name":"ValledAosta_DGPV","queryable":true},{"id":"11","name":"ValledAosta_Aree_frane_diffuse","queryable":true},{"id":"12","name":"ValledAosta_Frane","queryable":true},{"id":"13","name":"ValledAosta_Frane_Lineari","queryable":true},{"id":"14","name":"ValledAosta_Punto_identificativo_frana","queryable":true},{"id":"16","name":"Umbria_Aree_frane_diffuse","queryable":true},{"id":"17","name":"Umbria_Frane","queryable":true},{"id":"18","name":"Umbria_Punto_identificativo_frana","queryable":true},{"id":"20","name":"Trento_DGPV","queryable":true},{"id":"21","name":"Trento_Aree_frane_diffuse","queryable":true},{"id":"22","name":"Trento_Frane","queryable":true},{"id":"23","name":"Trento_Frane_Lineari","queryable":true},{"id":"24","name":"Trento_Punto_identificativo_frana","queryable":true},{"id":"26","name":"Toscana_DGPV","queryable":true},{"id":"27","name":"Toscana_Aree_frane_diffuse","queryable":true},{"id":"28","name":"Toscana_Frane","queryable":true},{"id":"29","name":"Toscana_Frane_Lineari","queryable":true},{"id":"30","name":"Toscana_Punto_identificativo_frana","queryable":true},{"id":"32","name":"Sicilia_DGPV","queryable":true},{"id":"33","name":"Sicilia_Aree_frane_diffuse","queryable":true},{"id":"34","name":"Sicilia_Frane","queryable":true},{"id":"35","name":"Sicilia_Frane_Lineari","queryable":true},{"id":"36","name":"Sicilia_Punto_identificativo_frana","queryable":true},{"id":"38","name":"Sardegna_DGPV","queryable":true},{"id":"39","name":"Sardegna_Aree_frane_diffuse","queryable":true},{"id":"40","name":"Sardegna_Frane","queryable":true},{"id":"41","name":"Sardegna_Frane_Lineari","queryable":true},{"id":"42","name":"Sardegna_Punto_identificativo_frana","queryable":true},{"id":"44","name":"Puglia_Aree_frane_diffuse","queryable":true},{"id":"45","name":"Puglia_Frane","queryable":true},{"id":"46","name":"Puglia_Frane_Lineari","queryable":true},{"id":"47","name":"Puglia_Punto_identificativo_frana","queryable":true},{"id":"48","name":"Piemonte_DGPV","queryable":true},{"id":"49","name":"Piemonte_Aree_frane_diffuse","queryable":true},{"id":"50","name":"Piemonte_Frane","queryable":true},{"id":"51","name":"Piemonte_Frane_Lineari","queryable":true},{"id":"52","name":"Piemonte_Punto_identificativo_frana","queryable":true},{"id":"54","name":"Molise_DGPV","queryable":true},{"id":"55","name":"Molise_Aree_frane_diffuse","queryable":true},{"id":"56","name":"Molise_Frane","queryable":true},{"id":"57","name":"Molise_Punto_identificativo_frana","queryable":true},{"id":"59","name":"Marche_DGPV","queryable":true},{"id":"60","name":"Marche_Aree_frane_diffuse","queryable":true},{"id":"61","name":"Marche_Frane","queryable":true},{"id":"63","name":"Marche_Punto_identificativo_frana","queryable":true},{"id":"64","name":"Lombardia_DGPV","queryable":true},{"id":"65","name":"Lombardia_Aree_frane_diffuse","queryable":true},{"id":"66","name":"Lombardia_Frane","queryable":true},{"id":"67","name":"Lombardia_Frane_Lineari","queryable":true},{"id":"68","name":"Lombardia_Punto_identificativo_frana","queryable":true},{"id":"70","name":"Liguria_DGPV","queryable":true},{"id":"71","name":"Liguria_Aree_frane_diffuse","queryable":true},{"id":"72","name":"Liguria_Frane","queryable":true},{"id":"73","name":"Liguria_Frane_Lineari","queryable":true},{"id":"74","name":"Liguria_Punto_identificativo_frana","queryable":true},{"id":"76","name":"Lazio_DGPV","queryable":true},{"id":"77","name":"Lazio_Aree_frane_diffuse","queryable":true},{"id":"78","name":"Lazio_Frane","queryable":true},{"id":"79","name":"Lazio_Punto_identificativo_frana","queryable":true},{"id":"81","name":"FriuliVeneziaGiulia_DGPV","queryable":true},{"id":"82","name":"FriuliVeneziaGiulia_Aree_frane_diffuse","queryable":true},{"id":"83","name":"FriuliVeneziaGiulia_Frane","queryable":true},{"id":"84","name":"FriuliVeneziaGiulia_Punto_identificativo_frana","queryable":true},{"id":"86","name":"EmiliaRomagna_DGPV","queryable":true},{"id":"87","name":"EmiliaRomagna_Frane","queryable":true},{"id":"88","name":"EmiliaRomagna_Punto_identificativo_frana","queryable":true},{"id":"90","name":"Campania_DGPV","queryable":true},{"id":"91","name":"Campania_Aree_frane_diffuse","queryable":true},{"id":"92","name":"Campania_Frane","queryable":true},{"id":"93","name":"Campania_Frane_Lineari","queryable":true},{"id":"94","name":"Campania_Punto_identificativo_frana","queryable":true},{"id":"96","name":"Calabria_DGPV","queryable":true},{"id":"97","name":"Calabria_Aree_frane_diffuse","queryable":true},{"id":"98","name":"Calabria_Frane","queryable":true},{"id":"99","name":"Calabria_Punto_identificativo_frana","queryable":true},{"id":"101","name":"Bolzano_DGPV","queryable":true},{"id":"102","name":"Bolzano_Aree_frane_diffuse","queryable":true},{"id":"103","name":"Bolzano_Frane","queryable":true},{"id":"104","name":"Bolzano_Frane_Lineari","queryable":true},{"id":"105","name":"Bolzano_Punto_identificativo_frana","queryable":true},{"id":"107","name":"Basilicata_Aree_frane_diffuse","queryable":true},{"id":"108","name":"Basilicata_Frane","queryable":true},{"id":"109","name":"Basilicata_Punto_identificativo_frana","queryable":true},{"id":"111","name":"Abruzzo_DGPV","queryable":true},{"id":"112","name":"Abruzzo_Aree_frane_diffuse","queryable":true},{"id":"113","name":"Abruzzo_Frane","queryable":true},{"id":"114","name":"Abruzzo_Punto_identificativo_frana","queryable":true}],"ATTRIBUTES":{"_DGPV":[],"_Aree_frane_diffuse":["autorita","movimento","attivita","litologia","uso_suolo","metodo","danno","data","causa","interventi"],"_Frane":["autorita","movimento","attivita","litologia","uso_suolo","metodo","danno","data","causa","interventi"],"_Frane_Lineari":[],"_Punto_identificativo_frana":["autorita","movimento","attivita","litologia","uso_suolo","metodo","danno","data","causa","interventi"]}}},{"id":"sentinel","type":"ImageWMS","queryUrl":"http://locationHost/geoserver/rheticus/gwc/service/wms","legend":{"title":"Sentinel Catalog","description":"Here you will query the whole Sentinel-1 (S1) catalog by single-clicking a point on the map.Then you will check the S1 population and dataset identification for PS processing. ","uom":"","url":{"nothing":""}},"custom":{"LAYERS":[{"id":"rheticus:slc","name":"sentinel 1","queryable":true}]}},{"id":"psCandidate","type":"ImageWMS","queryUrl":"http://locationHost/geoserver/rheticus/gwc/service/wms","legend":{"title":"Displacement Maps","description":"Here you will find the list of displacement maps covering the area.Choose your map and single-click each point of the map to enable the access to the measurements. ","uom":"[mm/year]","url":{"velocity":"./images/legend_vel_ps.png"}},"custom":{"LAYERS":[{"id":"rheticus:vw_ps_candidate","name":"Persistent Scatterers","queryable":true}]}},{"id":"ps","type":"ImageWMS","queryUrl":"http://locationHost/geoserver/rheticus/gwc/service/wms","legend":{"title":"Displacement Maps","description":"Here you will find the list of displacement maps covering the area.Choose your map and single-click each point of the map to enable the access to the measurements. ","uom":"[mm/year]","url":{"velocity":"./images/legend_vel_ps.png"}},"custom":{"LAYERS":[{"id":"rheticus:vw_ps","name":"Persistent Scatterers","queryable":true}]}}]}},
		rheticusAPI : {"host":"http://locationHost/rheticusapi/api/v1","dataset":{"path":"/datasets/#datasetid","datasetid":"#datasetid"},"measure":{"path":"/datasets/#datasetid/pss/#psid/measures?type=DL&periods=#periods","datasetid":"#datasetid","psid":"#psid","periods":"#periods","properties":{"datasetid":"datasetid","psid":"psid","date":"data","measure":"measure"}},"authentication":{"path":"/authenticate?username=#username&password=#password","username":"#username","password":"#password"},"weather":{"getStationId":{"path":"/meteostations?location=#lat,#lon","lat":"#lat","lon":"#lon"},"getWeatherMeasuresByStationId":{"path":"/meteostations/#stationid/measures?type=RAIN&aggregation=DAY&period=#begindate,#enddate","stationid":"#stationid","begindate":"#begindate","enddate":"#enddate"}}}
	});
