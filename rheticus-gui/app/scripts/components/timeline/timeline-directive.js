'use strict';

/**
 * @ngdoc function
 * @name rheticus.directive:d3Bars
 * @description
 * # d3Bars
 * Directive of the rheticus
 */

angular.module('rheticus')
	.directive('d3Bars', [function() {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				data: "="
			},
			link: function(scope, ele, attrs) {
				//data
				var lanes = ["Dataset1","Dataset2","Dataset3"],
					laneLength = lanes.length,
					items = [{"lane": 0, "id": "", "start": "2014-11-31", "end": "2014-12-10"},
							{"lane": 1, "id": "", "start": "2015-10-28", "end": "2015-03-10"},
							{"lane": 2, "id": "", "start": "2015-03-31", "end": "2014-04-10"}
							],
					timeBegin = new Date(2014,10,3),
					timeEnd = new Date();
				
				var m = [5, 20, 5, 100], //top right bottom left
					w = 960 - m[1] - m[3],
					/*h = 200 - m[0] - m[2],*/
					miniHeight = laneLength * 10 + 10,
					mainHeight = 0;/*h - miniHeight - 50;*/

				//scales
				var format = d3.time.format("%Y-%m-%d");
				var x = d3.time.scale()
					.domain([timeBegin, timeEnd])
					.range([0, w])
					.nice(d3.time.month);
				var x1 = d3.time.scale()
					.range([0, w])
					.nice(d3.time.month);
				var y1 = d3.scale.linear()
					.domain([0, laneLength])
					.range([0, mainHeight]);
				var y2 = d3.scale.linear()
					.domain([0, laneLength])
					.range([0, miniHeight]);
				
				var chart = d3.select(ele[0])
					.append("svg")
					.attr("width", w + m[1] + m[3])
					.attr("height", miniHeight + m[0] + m[2]+15)
					.attr("class", "chart");

				chart.append("defs").append("clipPath")
					.attr("id", "clip")
					.append("rect")
					.attr("width", w)
					.attr("height", mainHeight);
	/*
				var main = chart.append("g")
					.attr("transform", "translate(" + m[3] + "," + m[0] + ")")
					.attr("width", w)
					.attr("height", mainHeight)
					.attr("class", "main");
	*/
				var mini = chart.append("g")
					.attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
					.attr("width", w)
					.attr("height", miniHeight)
					.attr("class", "mini");
						
				/*	
				angular.forEach(scope.data, function (item, index) {
					  svg.append('rect')
					.attr('height', 20)
					.attr('width', item.score)
					.attr('x', 0)
					.attr('y', 20*index)
					.attr('fill', item.color);
				  })
				  */
	/*
				//main lanes and texts
				main.append("g").selectAll(".laneLines")
					.data(items)
					.enter().append("line")
					.attr("x1", m[1])
					.attr("y1", function(d) {return y1(d.lane);})
					.attr("x2", w)
					.attr("y2", function(d) {return y1(d.lane);})
					.attr("stroke", "lightgray")

				main.append("g").selectAll(".laneText")
					.data(lanes)
					.enter().append("text")
					.text(function(d) {return d;})
					.attr("x", -m[1])
					.attr("y", function(d, i) {return y1(i + .5);})
					.attr("dy", ".5ex")
					.attr("text-anchor", "end")
					.attr("class", "laneText");
	*/
				//mini lanes and texts
				mini.append("g")
					.selectAll(".laneLines")
					.data(items)
					.enter().append("line")
					.attr("x1", m[1])
					.attr("y1", function(d) {return y2(d.lane);})
					.attr("x2", w)
					.attr("y2", function(d) {return y2(d.lane);})
					.attr("stroke", "darkgray");

				mini.append("g")
					.selectAll(".laneText")
					.data(lanes)
					.enter().append("text")
					.text(function(d) {return d;})
					.attr("x", -m[1])
					.attr("y", function(d, i) {return y2(i + 0.5);})
					.attr("dy", ".5ex")
					.attr("text-anchor", "end")
					.attr("class", "laneText");
	/*
				var itemRects = main.append("g")
					.attr("clip-path", "url(#clip)");
	*/
				//mini item rects
				mini.append("g")
					.selectAll("miniItems")
					.data(items)
					.enter().append("rect")
					.attr("class", function(d) {return "miniItem" + d.lane;})
					.attr("x", function(d) {return x(format.parse(d.start));})
					.attr("y", function(d) {return y2(d.lane + 0.5) - 5;})
					.attr("width", function(d) {return x(10);})
					.attr("height", 10);

				//mini labels
				mini.append("g")
					.selectAll(".miniLabels")
					.data(items)
					.enter().append("text")
					.text(function(d) {return d.id;})
					.attr("x", function(d) {return x(format.parse(d.start));})
					.attr("y", function(d) {return y2(d.lane + .5);})
					.attr("dy", ".5ex");

				// draw the x axis
				/*var xDateAxis = d3.svg.axis()
					.scale(x)
					.orient('bottom')
					.ticks(d3.time.days,7)
					.tickFormat(d3.time.format('%b %d'))
					.tickSize(6, 0, 0);*/
/*
				var xMonthAxis = d3.svg.axis()
					.scale(x)
					.orient('bottom')
					.ticks(d3.time.months, 1)
					.tickFormat(d3.time.format('%b %Y'))
					.tickSize(15, 0, 0);
/*
				mini.append('g')
					.attr('transform', 'translate(0,' + miniHeight + ')')
					.attr('class', 'axis date')
					.call(xDateAxis);*/
				
				var units = d3.svg.axis()
					.scale(x)
					.orient('bottom')
					.ticks(d3.time.months, 1)
					.tickSize(5,10,1)
					.tickFormat(d3.time.format('%b %Y'));
					//.tickValues([timeBegin, timeEnd]);
					
				
				mini.append('g')
					.attr('transform', 'translate(0,' + miniHeight + ')')
					.attr('class', 'axis date')
					.call(units)
					.selectAll('text')
					.attr('dx', 1)	
					.attr('dy', 7);	

					
				//brush
				var brush = d3.svg.brush()
					.x(x)
					.on("brush", display);

				mini.append("g")
					.attr("class", "x brush")
					.call(brush)
					.selectAll("rect")
					.attr("y", 1)
					.attr("height", miniHeight - 1);

				display();

				function display() {
					//TODO
				}
			}
		};
	}])