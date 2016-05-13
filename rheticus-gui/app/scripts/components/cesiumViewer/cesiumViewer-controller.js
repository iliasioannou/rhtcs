'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:CesiumViewerCtrl
 * @description
 * # CesiumViewerCtrl
 * CesiumViewer Controller for rheticus project
 */
angular.module('rheticus')
    .controller('CesiumViewerCtrl',['$scope','configuration','olData',
    function ($scope,configuration,olData){

  		angular.extend(this,{
        "active2D": "true",
  			"openViewer" : function(){
          olData.getMap().then(function (map) {
            var extent = ol.proj.transformExtent( // jshint ignore:line
              map.getView().calculateExtent(map.getSize()), configuration.map.view.projection, "EPSG:4326"
            );
            //var extent = map.getView().calculateExtent(map.getSize());
            window.open(
              configuration.cesiumViewer.url+
              "?west="+extent[0]+
              "&south="+extent[1]+
              "&east="+extent[2]+
              "&north="+extent[3]+
              "&mapId="+configuration.cesiumViewer.mapId
            );
          });
  			}
  		});
    }]);
