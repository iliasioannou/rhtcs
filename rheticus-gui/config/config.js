'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderTitle : '@@rheticusHeaderTitle',
		timeSlider : @@timeSlider,
		filters : @@filters,
		map : @@map,
		aoi : @@aoi,
		//custom environment configuration
		legends : @@legends,
		layers : @@layers
	});
