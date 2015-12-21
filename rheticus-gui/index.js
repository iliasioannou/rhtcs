/*
 * APP DISTRIBUTION ON NODE JS SERVER
 */
var express = require('express');
var server = express();
server.set('port', 8080);
server.use(express.static(__dirname + '/'));
server.get('/',function(req, res) {
    res.sendfile('./index.html');
});

/*
 * PROXY CONFIGURATION
 */
var HASH_MAP_EXTERNAL_SERVICES = {
	"IFFI" : "http://www.geoservices.isprambiente.it/arcgis/services/IFFI/Progetto_IFFI_WMS_public/MapServer/WMSServer",
	"RHETICUS_API" : "http://kim.planetek.it:8081",
	"GEOSERVER" : "http://kim.planetek.it:9080"
};

var httpProxy = require('http-proxy');
httpProxy.prototype.onError = function (err) {
	console.log(err);
};

var proxyOptions = {
    changeOrigin: true
};
var apiProxy = httpProxy.createProxyServer(proxyOptions);

// Grab all requests to the server with "/iffi".
server.all("/iffi*", function(req, res) {
	req.url = req.url.replace('/iffi/','');
	console.log("Forwarding API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.IFFI}/*, 
		function (res) {
			res.on('data', function (data) {
				console.log("data: "+data.toString());
			});
		}*/
	);
});
// Grab all requests to the server with "/rheticusapi".
server.all("/rheticusapi*", function(req, res) {
	req.url = req.url.replace('/rheticusapi/','');
	console.log("Forwarding API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.RHETICUS_API});
});
// Grab all requests to the server with "/geoserver".
server.all("/geoserver*", function(req, res) {
	//req.url = req.url.replace('/geoserver/','');
	console.log("Forwarding API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.GEOSERVER});
});

/*
 * Start Server.
 */
server.listen(server.get('port'), function() {
    console.log('Express server listening on port ' + server.get('port'));
});