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
// Start Server.
server.listen(server.get('port'), function() {
    console.log('Express server listening on port ' + server.get('port'));
});

/*
 * PROXY IN PRODUCTION
 */
var httpProxy = require('http-proxy');

var HASH_MAP_EXTERNAL_SERVICES = {
	"IFFI" : "http://www.geoservices.isprambiente.it/arcgis/services/IFFI/Progetto_IFFI_WMS_public/MapServer/WMSServer",
	//"AUTH" : "http://kim.planetek.it:8081/api/v1/authenticate?"
};

var proxyOptions = {
    changeOrigin: true
};

httpProxy.prototype.onError = function (err) {
	console.log(err);
};

var apiProxy = httpProxy.createProxyServer(proxyOptions);

// Grab all requests to the server with "/iffi".
server.all("/iffi*", function(req, res) {
    //console.log('Forwarding API requests to ' + HASH_MAP_EXTERNAL_SERVICES.IFFI);
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

// Grab all requests to the server with "/iffi".
server.all("/auth*", function(req, res) {
    //console.log('Forwarding API requests to ' + HASH_MAP_EXTERNAL_SERVICES.IFFI);
	req.url = req.url.replace('/auth/','');
	console.log("Forwarding API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.AUTH}/*, 
		function (res) {
			res.on('data', function (data) {
				console.log("data: "+data.toString());
			});
		}*/
	);
});