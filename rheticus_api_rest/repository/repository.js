var dbConfig = require("./dbConfig.js");
var knex = require("knex")(dbConfig);
var bookshelf = require("bookshelf")(knex);

bookshelf.plugin("visibility");

var Ps = bookshelf.Model.extend({
    tableName: "ps",
    hidden: ["id", "lat", "lon", "geom"]
});

var PsMeasure = bookshelf.Model.extend({
    tableName: "ps_measure",
    //hidden: ["psid", "datasetid"]
    hidden: []
});

var Pss = bookshelf.Collection.extend({
    model: Ps
});


var PsMeasures = bookshelf.Collection.extend({
    model: PsMeasure
});

// Public
var public = {
    Ps: Ps,
    Pss: Pss,
    PsMeasure: PsMeasure,
    PsMeasures: PsMeasures
}

module.exports = public;
