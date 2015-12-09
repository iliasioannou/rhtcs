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
    var typeMeasureAllowed = ["DL", "VAL", "VASDL"];

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
        console.log("");
        next();
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
        if (typeMeasure.length > 0 && typeMeasureAllowed.indexOf(typeMeasure) < 0){
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