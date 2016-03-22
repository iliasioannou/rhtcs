var dbConfig = require("./dbConfig.js");
var knex = require("knex")(dbConfig);
var bookshelf = require("bookshelf")(knex);
var moment = require('moment');

bookshelf.plugin("visibility");
bookshelf.plugin("virtuals");

// ------------ User and Deal -------------

var User = bookshelf.Model.extend({
    tableName: "user",
    hidden: ["password", "id"],

	deals: function(){
		return this.hasMany(Deal, "user_id");
	}
});

var Deal = bookshelf.Model.extend({
    tableName: "deal",
    hidden: ["id", "seller_id", "user_id", "geom"],
	dataset: function(){
			return this.hasMany(DatasetOfDeal, "deal_id");
		}
});

var DatasetOfDeal = bookshelf.Model.extend({
	tableName: "deal_dataset"
});

// ------------ Meteo station and measures -------------
var MeteoStation = bookshelf.Model.extend({
    tableName: "meteo_stations",
//	idAttribute: "id",
    hidden: ["codcountry", "lat", "lon", "elevation", "geom"],
	measures: function(){
			return this.hasMany(MeteoStationMeasure , "id_station");
		}
});

var MeteoStationMeasure = bookshelf.Model.extend({
    tableName: "meteo_stations_measure",
    hidden: ["id", "data"],
	virtuals: {
		aggregation: {
			get: function(){return "DAY"}
		},
	    day : {
            get : function () {
				//Terrible workaround
                return moment(this.get('data')).add("hours", 12).format("YYYY-MM-DD");
            }
        }		
	}
});

var MeteoStationMeasureAggregate = bookshelf.Model.extend({
    tableName: "vw_meteo_stations_measure",
    hidden: ["y", "m"],
	virtuals: {
		aggregation: {
			get: function(){return "MONTH"}
		}		
	}
});

var MeteoStationMeasures = bookshelf.Collection.extend({
    model: MeteoStationMeasure
});

var MeteoStationMeasureAggregates = bookshelf.Collection.extend({
    model: MeteoStationMeasureAggregate
});

var MeteoStations = bookshelf.Collection.extend(
	{
		model: MeteoStation
	})

// ------------ Dataset and Ps -------------
var Dataset = bookshelf.Model.extend({
    tableName: "ps_dataset_metadata",
	idAttribute: "datasetid",
    hidden: ["timestampinsert", "license"],
	algoParams: function(){
		return this.hasMany(AlgoParam, "datasetid");
	},
	products: function(){
		return this.hasMany(Product, "datasetid");
	}
});

var AlgoParam = bookshelf.Model.extend({
    tableName: "ps_dataset_metadata_algo_params",
    hidden: ["datasetid"]
});

var Product = bookshelf.Model.extend({
    tableName: "ps_dataset_products",
    hidden: ["datasetid"]
});

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
	User: User,
	MeteoStation: MeteoStation,
	//MeteoStations: MeteoStations,
	MeteoStationMeasure: MeteoStationMeasure,
	MeteoStationMeasureAggregate: MeteoStationMeasureAggregate,
    Dataset: Dataset,
    Ps: Ps,
    Pss: Pss,
    PsMeasure: PsMeasure,
    PsMeasures: PsMeasures
}

module.exports = public;
