var restify = require("restify");
var versioning = require("restify-url-semver");
var restifyValidation = require("node-restify-validation");
var serverConfig = require("./serverConfig");

var server = restify.createServer({name: serverConfig.name});
server.use(restify.queryParser({ mapParams: false }));
//server.use(restifyValidation.validationPlugin());

server.use(restifyValidation.validationPlugin({
	// Show errors as an array
	errorsAsArray: false,
	// Not exclude incoming variables not specified in validator rules
	forbidUndefinedVariables: false,
	//errorHandler: restify.errors.InvalidArgumentError
}));

var routes = require("./routes/routesV1.js")(server);

server.pre(versioning({ prefix: "/api" }))
server.pre(restify.pre.sanitizePath());
//server.pre(restify.CORS());

server.listen(serverConfig.port, function () {
    console.log("<%s> server (version %s) listening at <%s>", server.name, serverConfig.version, server.url);
});


