'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderTitle : '@@rheticusHeaderTitle',
		timeSlider : @@timeSlider,
		filters : @@filters,
		datasets : @@datasets,
		//custom environment configuration
		legends : @@legends,
		maps : @@maps
	});
