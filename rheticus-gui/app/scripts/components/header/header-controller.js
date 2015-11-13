'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
.controller('HeaderCtrl', ['$scope','configuration', function ($scope,configuration) {
    angular.extend($scope, {
        filterPopupTemplateName: "scripts/components/filter/filter-view.html",
        conf: configuration
    });
    
    angular.extend($scope, {
        dsModel: [],
        selectedDatasets: [],
        timeModel: "1",
        speedModel: $scope.configuration.speedModel,
        speedOptions: {
            from: 0,
            to: 20,
            step: 1,
            dimension: " mm/year",
            scale: [0, '|', 5, '|', 10, '|', 15, '|', 20],
            css: {
                background: {"background-color": "silver"},
                before: {"background-color": "purple"},
                default: {"background-color": "white"},
                after: {"background-color": "green"},
                pointer: {"background-color": "red"}
            },
            callback: function(value, released) {
                // useful when combined with 'realtime' option 
                // released it triggered when mouse up 
                console.log("callback: "+value + " " + released);
                $scope.configuration.speedModel = value;
            }
        },
        coherenceModel: "80",
        coherenceOptions: {
            from: 75,
            to: 100,
            step: 0.5,
            dimension: " %",
            scale: [75, '|', 90, '|', 100],
            css: {
                background: {
                    "background-color": "silver"
                },
                before: {
                    "background-color": "purple"
                },
                default: {
                    "background-color": "white"
                },
                after: {
                    "background-color": "green"
                },
                pointer: {
                    "background-color": "red"
                }
            }
        },

    });
    /*
    $scope.$watch("datasets", function (datasets) {
        if (datasets)
            $scope.wms.source.params.CQL_FILTER = "dataset_id=" + dataset;
    }, true);
    */

}]);