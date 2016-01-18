/*
 * APP DISTRIBUTION ON NODE JS SERVER
 */
var express = require('express');
var server = express();

/*** Basic Auth for Production ***/
var basicAuth = require('basic-auth');
var usr = "pkrheticususer";
var pwd = "rheticussupersecretpassword123";

var auth = function(req, res, next){
  var user = basicAuth(req);
  if(user && user.name && (user.name==usr) && user.pass && (user.pass==pwd)) {
    return next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }
}
server.use(auth);

server.set('port', 80);
server.use(express.static(__dirname + '/'));
server.get('/',function(req, res) {
  res.sendfile('./index.html');
});

/*
 * PROXY CONFIGURATION
 */
var HASH_MAP_EXTERNAL_SERVICES = {
	"IFFI" : "http://www.geoservices.isprambiente.it/arcgis/services/IFFI/Progetto_IFFI_WMS_public/MapServer/WMSServer",
	"RHETICUS_API" : "http://metis.planetek.it:8081",
	"GEOSERVER" : "http://metis.planetek.it:9080"
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

//apiProxy.on('proxyReq', function(proxyReq, req, res, options) {
//	proxyReq.setHeader('Authorization', '');
//});

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
/*
// Grab all requests to the server with "/auth".
server.all("/auth*", function(req, res) {
	req.url = req.url.replace('/auth/','');
	console.log("Forwarding API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.AUTH});
});
*/
// Grab all requests to the server with "/rheticusapi".
server.all("/rheticusapi*", function(req, res) {
	req.url = req.url.replace('/rheticusapi/','');
	console.log("Forwarding API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.RHETICUS_API});
});
// Grab all requests to the server with "/geoserver".
server.all("/geoserver*", function(req, res) {
	console.log("Forwarding API requests to: "+req.url);
	apiProxy.web(req, res, {target: HASH_MAP_EXTERNAL_SERVICES.GEOSERVER});
});

/*
 * Start Server.
 */
server.listen(server.get('port'), function() {
  console.log('Express server listening on port ' + server.get('port'));
});
