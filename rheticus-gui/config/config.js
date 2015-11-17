'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderTitle : '@@rheticusHeaderTitle',
		timeSlider : @@timeSlider,
		filters : @@filters,
		datasets : @@datasets,
		map : @@map,
		//custom environment configuration
		legends : @@legends,
		layers : @@layers
	});
