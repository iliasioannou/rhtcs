//API REST Vesion V1
// [protocol]://[host]/api/v1/dataset/....


var serverRouter = function(server) {
    var VERSION = "1.0.0";
    
    var serverConfig = require("../serverConfig");
    
    var dbConfig = require("../repository/dbConfig.js");
    var knex = require("knex")(dbConfig);

    var restify = require('restify');
    var Promise = require("bluebird");
    var fs = require('fs');

    var repository = require('../repository/repository.js');
    
    var dataFileRootPath =  __dirname + "/../data/";
    var psTypeMeasureAllowed = ["DL", "VAL", "VASDL"];

	var meteoTypeMeasureAllowed = ["TEMP", "RAIN"];
	var meteoTypeMeasureForQuery = new Array();
	meteoTypeMeasureForQuery["TEMP"] = "temperatura_media_c";
	meteoTypeMeasureForQuery["RAIN"] = "precipitazioni_mm";

    server.use(function (req, res, next) {
        //console.log("*".repeat(50));
        console.log("*****************************************************");
        console.log("Server ver       : " + serverConfig.version);
        console.log("Api ver          : " + req.headers['accept-version']);
        console.log("Time request     : " + (new Date()).toISOString());
        console.log("Http method      : " + req.method);
        console.log("Http origin      : " + req.header("Origin"));
        console.log("Http url         : " + req.url);
        console.log("Http User-Agent  : " + req.header("User-Agent"));
        console.log("Auth. username   : " + req.username);
        console.log("");
        next();
    });

    // ----------------------------------    
    // Check identity for user and return AOI
    server.get({ path: '/authenticate', version: VERSION }, function (req, res, next) {
        console.log("Check autentication");
        var userName = req.query.username;
        if (userName == undefined || userName == null){
            userName = "";
        }
        var passwordEncrypted = req.query.password;
        if (passwordEncrypted == undefined || passwordEncrypted == null){
            passwordEncrypted = "";
        }
        var passwordPlain = new Buffer(passwordEncrypted, 'base64').toString('ascii');
        console.log("\tUsername  = -%s-", userName);
        console.log("\tPassword  = -%s-", passwordPlain);
        
		repository.User.forge({username: userName})
			.fetch({withRelated: ["deals"]})
            .then(function(user){
				if (user){
					var userPassword = user.get("password");
					console.log("\tUser from db = %s", JSON.stringify(user));
					console.log("\tUser password from db = -%s-", userPassword);
					if(userPassword !== passwordPlain) {
						next(new restify.NotAuthorizedError());
					}
					else{
						console.log("\tUser is OK");
						res.send(user.toJSON());
					}
				}
				else {
					// Respond with { code: 'NotAuthorized', message: '' }
					next(new restify.NotAuthorizedError());
				}

            })
            .catch(function(error){
                console.log(error);
            });       
    });
	

    // ----------------------------------    
    // Info on Rheticus API Rest
    server.get({ path: '/info', version: VERSION }, function (req, res, next) {
        res.send({
            "server":
                {
                    "name": serverConfig.name,
                    "version": serverConfig.version
                },
            "api":
                {
                    "version": VERSION,
                    "info": "TODO" 
                }
        });
        next();
    });

    // ----------------------------------    
    // List Meteo Station
    server.get({ path: '/meteostations', version: VERSION }, function (req, res, next) {
        console.log("Elenco delle stazioni meteo");
        repository.MeteoStation.forge()
            .query(function queryBuilder(qb){
                qb.orderBy("id", "asc");
                })
            .fetchAll()
            .then(function(collection){
                res.send(collection.toJSON());
            })
            .catch(function(error){
                console.log(error);
            });       
        next();
    });

    // ----------------------------------    
    // Detail for Meteo Station
    server.get({ path: '/meteostations/:idStation', version: VERSION }, function (req, res, next) {
        console.log("Dettaglio della stazioni meteo");
        var idStation = req.params.idStation;
        if (idStation == undefined || idStation == null){
            idStation = "";
		}
        console.log("\tStation Id = %s", req.params.idStation);
        repository.MeteoStation.forge({id: idStation})
			.fetch()
            .then(function(station){
				if (station == null){
					next(new restify.NotFoundError("Unknow station. Sorry !"));
					return;
				}
				else{
					res.send(station.toJSON());
				}
            })
            .catch(function(error){
                console.log(error);
            });       
        next();
    });

    // ----------------------------------    
    // Measure for Meteo Station
    server.get({ path: '/meteostations/:idStation/measures', version: VERSION }, function (req, res, next) {
        console.log("Misure della stazioni meteo");
        var idStation = req.params.idStation;
        if (idStation == undefined || idStation == null){
            idStation = "";
		}
        var typeMeasure = req.query.type;
        if (typeMeasure == undefined || typeMeasure == null){
            typeMeasure = "";
        }
        if (typeMeasure.length > 0 && meteoTypeMeasureAllowed.indexOf(typeMeasure) < 0){
            next(new restify.BadRequestError("Unknow type measure. Sorry !"));
            return;
        }
        console.log("\tStation Id = %s", req.params.idStation);
        console.log("\tMeasure type = %s", typeMeasure);
        repository.MeteoStationMeasure.forge()
            .query(function queryBuilder(qb){
                qb.where("id_station", "=", idStation);
                if (typeMeasure.length > 0){
                    qb.andWhere("type", "=", meteoTypeMeasureForQuery[typeMeasure])
                }
                qb.orderBy("data", "asc");
                qb.orderBy("type", "asc");
                })
            .fetchAll()
            .then(function(collection){
                res.send(collection.toJSON());
            })
            .catch(function(error){
                console.log(error);
            });       
        next();
    });

    server.get({ path: '/meteostations/:idStation/measuresAgg', version: VERSION }, function (req, res, next) {
        console.log("Misure della stazioni meteo");
        var idStation = req.params.idStation;
        if (idStation == undefined || idStation == null){
            idStation = "";
		}
        var typeMeasure = req.query.type;
        if (typeMeasure == undefined || typeMeasure == null){
            typeMeasure = "";
        }
        if (typeMeasure.length > 0 && meteoTypeMeasureAllowed.indexOf(typeMeasure) < 0){
            next(new restify.BadRequestError("Unknow type measure. Sorry !"));
            return;
        }
/*
        var start = req.query.start;
        if (start == undefined || start == null){
            start = "";
        }
        var end = req.query.end;
        if (end == undefined || end== null){
            end = "";
        }
*/
        console.log("\tStation Id = %s", req.params.idStation);
        console.log("\tMeasure type = %s", typeMeasure);
//        console.log("\tMeasure start = %s", start);
//        console.log("\tMeasure end = %s", end);
        repository.MeteoStationMeasureAggregate.forge()
            .query(function queryBuilder(qb){
                qb.where("id_station", "=", idStation);
                if (typeMeasure.length > 0){
                    qb.andWhere("type", "=", meteoTypeMeasureForQuery[typeMeasure])
                }
                qb.orderBy("y", "asc");
                qb.orderBy("m", "asc");
                qb.orderBy("type", "asc");
                })
            .fetchAll()
            .then(function(collection){
                res.send(collection.toJSON());
            })
            .catch(function(error){
                console.log(error);
            });       
        next();
    });

    // ----------------------------------    
    // Elenco dei dataset
    server.get({ path: '/datasets', version: VERSION }, function (req, res, next) {
        console.log("Elenco dei dataset");
        repository.Ps.forge()
            .query(function queryBuilder(qb){
                qb.select("datasetid", knex.raw("COUNT(psid) AS CountPs")).from("ps").groupBy("datasetid")
                qb.orderBy("datasetid", "asc");
                })
            .fetchAll()
            .then(function(collection){
                res.send(collection.toJSON());
            })
            .catch(function(error){
                console.log(error);
            });       
        next();
    });

    // ----------------------------------    
    // Dettaglio di dataset
    server.get({ path: '/datasets/:idDataset', version: VERSION }, function (req, res, next) {
        console.log("Dettaglio del dataset");
        var idDataset = req.params.idDataset;
        if (idDataset == undefined || idDataset == null){
            idDataset = "";
        }
        console.log("\tDataset Id = %s", req.params.idDataset);
        repository.Dataset.forge({datasetid: idDataset})
			.fetch({withRelated: ["algoParams", "products"]})
            .then(function(dataset){
				if (dataset == null){
					next(new restify.NotFoundError("Unknow dataset. Sorry !"));
					return;
				}
				else{
					res.send(dataset.toJSON());
				}
            })
            .catch(function(error){
                console.log(error);
            });       
        next();
    });

    // ----------------------------------    
    // Elenco dei PS di un dataset
    server.get({ path: '/datasets/:idDataset/pss', version: VERSION }, function (req, res, next) {
        console.log("Elenco dei PS di un dataset");
        var idDataset = req.params.idDataset;
        if (idDataset == undefined || idDataset == null){
            idDataset = "";
        }
        console.log("\tDataset Id = %s", req.params.idDataset);
        repository.Ps.forge()
            .query({where: {datasetid: idDataset}})
            .fetchAll()
            .then(function(collection){
                res.send(collection.toJSON());
            })
            .catch(function(error){
                console.log(error);
            });
        next();
    });


    // ----------------------------------    
    // Dettaglio di un PS di un dataset
    server.get({path: '/datasets/:idDataset/pss/:idPs', version: VERSION }, function (req, res, next) {
        console.log("Dettaglio di un PS di un dataset");

        var idDataset = req.params.idDataset;
        if (idDataset == undefined || idDataset == null){
            idDataset = "";
        }
        var idPs = req.params.idPs;
        if (idPs == undefined || idPs == null){
            idPs = "";
        }
        console.log("\tDataset Id = %s", req.params.idDataset);
        console.log("\tPs Id      = %s", req.params.idPs);

		repository.Ps.forge()
            .query({where: {datasetid: idDataset}, andWhere: {psid: idPs}})
            .fetchAll()
            .then(function(collection){
                res.send(collection.toJSON());
            })
            .catch(function(error){
                console.log(error);
            });       
        next();
    });


    // ----------------------------------    
    // Misure di un PS di un dataset
    server.get({ path: '/datasets/:idDataset/pss/:idPs/measures', version: VERSION }, function (req, res, next) {
        console.log("Misure di un PS di un dataset");

        var idDataset = req.params.idDataset;
        if (idDataset == undefined || idDataset == null){
            idDataset = "";
        }
        var idPs = req.params.idPs;
        if (idPs == undefined || idPs == null){
            idPs = "";
        }
        var typeMeasure = req.query.type;
        if (typeMeasure == undefined || typeMeasure == null){
            typeMeasure = "";
        }
        if (typeMeasure.length > 0 && psTypeMeasureAllowed.indexOf(typeMeasure) < 0){
            next(new restify.BadRequestError("Unknow type measure. Sorry !"));
            return;
        }
        console.log("\tDataset Id   = %s", req.params.idDataset);
        console.log("\tPs Id        = %s", req.params.idPs);
        console.log("\tMeasure type = %s", typeMeasure);

        repository.PsMeasure.forge()
            .query(function queryBuilder(qb){
                qb.where("datasetid", "=", idDataset)
                    .andWhere("psid", "=", idPs);
                if (typeMeasure.length > 0){
                    qb.andWhere("type", "=", typeMeasure)
                }
                qb.orderBy("type", "asc");
                qb.orderBy("data", "asc");
                })
            .fetchAll()
            .then(function(collection){
                res.send(collection.toJSON());
            })
            .catch(function(error){
                console.log(error);
            });       
        next();
    });
}
 
module.exports = serverRouter;
