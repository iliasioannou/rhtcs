//API REST Vesion V1
// [protocol]://[host]/api/v1/dataset/....


var serverRouter = function(server) {
    var VERSION = "1.0.0";
    
    var serverConfig = require("../serverConfig");

    
    var dbConfig = require("../repository/dbConfig.js");
    var knex = require("knex")(dbConfig);

    var restify = require('restify');
    var promise = require("bluebird");
    var fs = require('fs');
	var validator = require('validator');

    var repository = require('../repository/repository.js');
    
    var dataFileRootPath =  __dirname + "/../data/";
    var psTypeMeasureAllowed = ["DL", "VAL", "VASDL"];


    server.use(function (req, res, next) {
        //console.log("*".repeat(50));
        console.log("*****************************************************");
        console.log("Server ver       : " + serverConfig.version);
        console.log("Api ver          : " + req.headers['accept-version']);
        console.log("Time request     : " + (new Date()).toISOString());
        console.log("Http method      : " + req.method);
        console.log("Htp origin      : " + req.header("Origin"));
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
        var userNameAnonymous = "anonymous";
        
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
        
		// Retrieve always the deal related to anonymous user
		var anonymousDealPromise = repository.User.forge({username: userNameAnonymous})
			.fetch({withRelated: ["deals"]});

		var userDealPromise =  repository.User.forge({username: userName})
			.fetch({withRelated: ["deals"]});

		var joinPromise = promise.join;
		joinPromise(anonymousDealPromise, userDealPromise,function(anonymousUser, user){
			var anonymousUserDeals = [];
			if (anonymousUser){
				anonymousUserDeals = anonymousUser.serialize().deals;
				console.log("\tDeal for anonymous user = %s", JSON.stringify(anonymousUserDeals));
			}
			else {
				console.log("\tProblem during retrieve anonymous user");
			}
			if (user){
				var userPassword = user.get("password");
				if(userPassword !== passwordPlain) {
					next(new restify.NotAuthorizedError());
				}
				else{
					// add anonymous user deals to user's deals
					user.related("deals").add(anonymousUserDeals, {merge: false});
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
			next(new restify.NotAuthorizedError());
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
	// Whitout parameter return all station
	// With location=LAT,LONG where LAT=+/-GG.MMMMM and LONG=GGG.MMMMM in SRID=4326
    server.get({ path: '/meteostations', version: VERSION }, function (req, res, next) {
		var LIMIT = 1;
		var SRID = 4326;
		var TO_SRID = 32633;
		var errorMessage4StrangeLocation = "location=LAT,LONG where LAT=+/-GG.MMMM [-90.0000,90.0000] and LONG=GGG.MMMM [-180.0000,180.0000] in SRID=" + SRID ;
        console.log("Elenco delle stazioni meteo");
        var location = req.query.location;
        console.log("\tLocation = %s", location);
        if (location !== undefined){
			var arrayCoord = location.split(",");
			if (arrayCoord.length == 2){
				var lat = parseFloat(arrayCoord[0]);
				var lon = parseFloat(arrayCoord[1]);
				if (!isNaN(lat) && !isNaN(lon)){
					console.log("\tLat = %s; Lon = %s", lat, lon);
					var querySelectDistanceDegree = "round(st_distance(ST_SetSRID(geom, " + SRID + "), 'SRID=" + SRID + ";POINT(" + lon + " " + lat + ")'::geometry)::numeric, 4) AS distance_degree";
					var querySelectDistanceMeter = "floor(st_distance(ST_Transform(ST_SetSRID(geom, " + SRID + "), " + TO_SRID + "), ST_Transform('SRID=" + SRID + ";POINT(" + lon + " " + lat + ")'::geometry, " + TO_SRID + "))) AS Distance_meter";
					var queryOrderBy = "st_distance(ST_SetSRID(geom, " + SRID + "), 'SRID=" + SRID + ";POINT(" + lon + " " + lat + ")'::geometry)";
					
					repository.MeteoStation.forge()
						.query(function(qb) {
							qb.offset(0).limit(LIMIT);
							})
						.query("select", ["*", knex.raw(querySelectDistanceDegree), knex.raw(querySelectDistanceMeter)])
						.query("orderBy", knex.raw(queryOrderBy), "ASC")
						.fetchAll()
						.then(function(collection){
							res.send(collection.toJSON());
						})
						.catch(function(error){
							console.log(error);
							next(new restify.BadRequestError(errorMessage4StrangeLocation));
						});       
				}
				else{
					next(new restify.BadRequestError(errorMessage4StrangeLocation));
					return;
				}
			}
			else{
				next(new restify.BadRequestError(errorMessage4StrangeLocation));
				return;
			}
        }
		else{
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
		}

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
	// Whitout parameter return all measures
	// Parameter: type, perdiod, aggregation
	var meteoTypeMeasureAllowed = ["TEMP", "RAIN"];
	var meteoTypeMeasureForQuery = new Array();
	meteoTypeMeasureForQuery["TEMP"] = "temperatura_media_c";
	meteoTypeMeasureForQuery["RAIN"] = "precipitazioni_mm";
	
	var meteoTypeMeasureAggregation = ["DAY", "MONTH"];
	var dateSeparator4Period = ","; 
/*
	var validationParamMethodMeasures = {
		resources: {
			idStation: {isRequired: true}
		},
		queries: {
			type: {isRequired: false, isIn: meteoTypeMeasureAllowed},
			period: {isRequired: false, contains: [dateSeparator4Period]}
		}		
	};
    server.get({ path: '/meteostations/:idStation/measures', version: VERSION, validation:  validationParamMethodMeasures}, function (req, res, next) {
*/
    server.get({ path: '/meteostations/:idStation/measures', version: VERSION}, function (req, res, next) {
        console.log("Misure della stazioni meteo");
		
		var errorMessage4StrangeType = "Unknow type measure. type=[" + meteoTypeMeasureAllowed + "]";
		var errorMessage4StrangeTypeAggregation = "Unknow type measure aggregation. type=[" + meteoTypeMeasureAggregation + "]";
		var errorMessage4StrangePeriod = "Unknow time period. period=from,to. Where from > to and from/to in format YYYY-MM-DD";

        var idStation = req.params.idStation;
        console.log("\tStation Id = %s", req.params.idStation);
        if (idStation == undefined || idStation == null){
            idStation = "";
		}

        var typeMeasure = req.query.type;
        console.log("\tMeasure type = %s", typeMeasure);
        if (typeMeasure === undefined || typeMeasure === null){
            typeMeasure = "";
        }
        if (typeMeasure.length > 0 && meteoTypeMeasureAllowed.indexOf(typeMeasure) < 0){
            next(new restify.InvalidArgumentError(errorMessage4StrangeType));
            return;
		}
       
        var typeMeasureAggregation = req.query.aggregation;
        console.log("\tMeasure type aggregation = %s", typeMeasureAggregation);
        if (typeMeasureAggregation === undefined || typeMeasureAggregation === null){
            typeMeasureAggregation = "";
        }
        if (meteoTypeMeasureAggregation.length > 0 && meteoTypeMeasureAggregation.indexOf(typeMeasureAggregation ) < 0){
            next(new restify.InvalidArgumentError(errorMessage4StrangeTypeAggregation));
            return;
		}
	   	
		var periodIsValid = false;	
		var period = req.query.period;
        console.log("\tPeriod = %s", period);
        if (period !== undefined){
			var arrayPeriod = period.split(dateSeparator4Period);
			if (arrayPeriod.length == 2){
				var from = validator.toDate(arrayPeriod[0]);
				var to = validator.toDate(arrayPeriod[1])
        		console.log("\tPeriod from = %s, to = %s", from, to);
				periodIsValid = (from !== null && to !== null && from < to && validator.isBefore(from) && validator.isBefore(to));
				if (periodIsValid == false){
					next(new restify.InvalidArgumentError(errorMessage4StrangePeriod));
					return;
				}
			}
			else{
				next(new restify.InvalidArgumentError(errorMessage4StrangePeriod));
				return;
			}
        }
        console.log("\tPeriod is valid = %s", periodIsValid);

 		var repo = null;		
		if (typeMeasureAggregation === "DAY"){
 			repo = repository.MeteoStationMeasure;		
		}
		else{
 			repo = repository.MeteoStationMeasureAggregate;		
		}

		repo.forge()
			//.query("select", ["*", "row_number() AS id"])
            .query(function queryBuilder(qb){
                qb.where("id_station", "=", idStation);
                if (typeMeasure.length > 0){
                    qb.andWhere("type", "=", meteoTypeMeasureForQuery[typeMeasure])
                }
				if (periodIsValid){
                    qb.andWhere("data ", ">=", from.toISOString())
                    qb.andWhere("data ", "<=", to)
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
				next(new restify.BadRequestError(errorMessage4StrangePeriod));
            });       
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
        }za
        console.log("\tStation Id = %s", req.params.idStation);
        console.log("\tMeasure type = %s", typeMeasure);
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
