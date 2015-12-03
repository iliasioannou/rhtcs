var restify = require("restify");
var versioning = require("restify-url-semver");
var serverConfig = require("./serverConfig");

var server = restify.createServer({name: serverConfig.name});
server.use(restify.queryParser({ mapParams: false }));
var routes = require("./routes/routesV1.js")(server);

server.pre(versioning({ prefix: "/api" }))
server.pre(restify.pre.sanitizePath());
server.pre(restify.CORS());

server.listen(serverConfig.port, function () {
    console.log("<%s> server (version %s) listening at <%s>", server.name, serverConfig.version, server.url);
});


