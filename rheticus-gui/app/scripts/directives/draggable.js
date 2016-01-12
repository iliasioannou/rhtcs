'use strict';

angular.module('rheticus', [])
	.directive('draggable', function($document) {
		return function(scope, element, attr) { // jshint ignore:line
			var startX = 0, startY = 0, x = 0, y = 0;
			element.css({
				cursor: 'pointer'
			});
			element.on('mousedown', function(event) {
				element.css({
					border: '1px solid red'
				});
				// Prevent default dragging of selected content
				event.preventDefault();
				startX = event.screenX - x;
				startY = event.screenY - y;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				y = event.screenY - startY;
				x = event.screenX - startX;
				element.css({
					top: y + 'px',
					left:  x + 'px',
					border: '1px solid red'
				});
			}

			function mouseup() {
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);
				element.css({
					border: '0px solid red'
				});
			}
		};
	});
