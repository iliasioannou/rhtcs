'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the rheticus
 */

angular.module('rheticus')
	.controller('HeaderCtrl',['configuration',function (configuration){
		angular.extend(this,{
			"rheticusHeaderImage" : configuration.rheticusHeaderImage
		});
	}]);