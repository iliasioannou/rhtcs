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
  "MARINE" : "http://localhost:8080/marine",
  "DISPLACEMENT" : "http://localhost:8080/displacement",
	"IFFI" : "http://www.geoservices.isprambiente.it/arcgis/services/IFFI/Progetto_IFFI_WMS_public/MapServer/WMSServer",
	"RHETICUS_API" : "http://localhost:8081",
	"GEOSERVER" : "http://localhost:9080",
  "BASEMAP_REALVISTA" : "http://213.215.135.196/reflector/open/service"
};

var httpProxy = require('http-proxy');
httpProxy.prototype.onError = function (err) {
	console.log(err);
};

var proxyOptions = {
  changeOrigin: true
};
var apiProxy = httpProxy.createProxyServer(proxyOptions);

// To modify the proxy connection before data is sent, you can listen
// for the 'proxyReq' event. When the event is fired, you will receive
// the following arguments:
// (http.ClientRequest proxyReq, http.IncomingMessage req,
//  http.ServerResponse res, Object options). This mechanism is useful when
// you need to modify the proxy request before the proxy connection
// is made to the target.

// Grab proxyReq
apiProxy.on('proxyReq', function(proxyReq, req, res, options) {
  if (req.headers["authorization"]){
    delete req.headers["authorization"];
  }
});

// Grab proxyRes and add CORS
apiProxy.on('proxyRes', function (proxyRes, req, res) {
  //console.log(req.headers);
  proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  //console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

//Grab error messages
apiProxy.on('error', function (err, req, res) {
  res.end('Something went wrong. And we are reporting a custom error message.');
});

// Grab all requests to the server with "/displacement".
server.all("/displacement", function(req, res) {
	req.url = req.url.replace('/displacement','');
	console.log("Forwarding rheticus requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.DISPLACEMENT});
});

// Grab all requests to the server with "/marine".
server.all("/marine", function(req, res) {
	req.url = req.url.replace('/marine','');
	console.log("Forwarding rheticus requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.MARINE});
});

// Grab all requests to the server with "/iffi".
server.all("/iffi*", function(req, res) {
	req.url = req.url.replace('/iffi/','');
	console.log("Forwarding IFFI API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.IFFI});
});

// Grab all requests to the server with "/basemap".
server.all("/basemap*", function(req, res) {
	req.url = req.url.replace('/basemap/','');
	console.log("Forwarding BASEMAP REALVISTA API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.BASEMAP_REALVISTA});
});

// Grab all requests to the server with "/rheticusapi".
server.all("/rheticusapi*", function(req, res) {
	req.url = req.url.replace('/rheticusapi/','');
	console.log("Forwarding RHETICUS API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.RHETICUS_API});
});

// Grab all requests to the server with "/geoserver".
server.all("/geoserver*", function(req, res) {
  console.log("Forwarding Geoserver API requests to: "+req.url);
  //console.log(req.headers);
  if (req.headers["authorization"]){
    delete req.headers["authorization"];
  }
  if (req.headers["upgrade-insecure-requests"]){
    delete req.headers["upgrade-insecure-requests"];
  }
  //console.log(req.headers);
  //res.removeHeader("WWW-Authenticate");
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.GEOSERVER});
});

/*
 * Start Server.
 */
server.listen(server.get('port'), function() {
  console.log('Express server listening on port ' + server.get('port'));
});
