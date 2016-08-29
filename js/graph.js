// Graphing with D3

firstTime = true;

function drawGraph() {
	var radius = 5;

	var svg = d3.selectAll("svg#graph").selectAll("#points");
	var w = parseInt($(".span12").css('width'));
	var h = 300;
	var space = w/13.0;
	
	var city1 = $("#primaryCity").val();
	var city2 = $("#secondCity").val();
	
	d3.select("#city1name").text(city1);
	d3.select("#city2name").text(city2);
	
	var city1data = [];
	for (var m = 0; m < 12; m++) {
		var n = m;
		if (seasonAdjust && data[city1]["country"]=="NZ") n = (m + 6) % 12;
		city1data.push(data[city1]["rainfall"][mode][n]);
	}
	var city2data = [];
	for (var m = 0; m < 12; m++) {
		var n = m;
		if (seasonAdjust && data[city2]["country"]=="NZ") n = (m + 6) % 12;
		city2data.push(data[city2]["rainfall"][mode][n]);
	}
	

	var maxVal = d3.max([d3.max(city1data),d3.max(city2data)]);
	
	var yscale = d3.scale.linear().domain([0,maxVal]).range([280, 30]).nice();
	
	var line = d3.svg.line()
		.x(function(d,i) { return space*(i+1); })
		.y(function(d) { return yscale(d); });
	
	if (firstTime) {
		firstTime = false;
		svg.append("svg:path").attr("d", line(city1data));
	}
	
	var city1Points = svg.selectAll(".city1point").data(city1data);
	var city2Points = svg.selectAll(".city2point").data(city2data);
	
	city1Points.enter().append("circle")
		.attr({r: radius, fill: "blue"})
		.attr("class", "city1point")
		.attr("cx", function(d,i) { return space*(i+1); })
		.attr("cy", function(d,i) { return yscale(d); })
		.on("mouseover", function(d,i) {
			d3.select(this)
				.classed("over",true)
				.attr("r", 20);
			})
		.on("mouseout", function(d,i) {
			d3.select(this)
				.classed("over",false)
				.attr("r", 10);
			});
			
	city2Points.enter().append("circle")
		.attr({r: radius, fill: "red"})
		.attr("class", "city2point")
		.attr("cx", function(d,i) { return space*(i+1); })
		.attr("cy", function(d,i) { return yscale(d); })
		.on("mouseover", function(d,i) {
			d3.select(this)
				.classed("over",true)
				.attr("r", 20);
			})
		.on("mouseout", function(d,i) {
			d3.select(this)
				.classed("over",false)
				.attr("r", 10);
			});
		
	// Update elements in dataModel
  city1Points.transition()
		.duration(300)
		.attr("cx", function(d,i) { return space*(i+1); })
		.attr("cy", function(d,i) { return yscale(d); });
	svg.selectAll("path")
		.data(city1data)
		.attr("d",line);
	city2Points.transition()
		.duration(300)
		.attr("cx", function(d,i) { return space*(i+1); })
		.attr("cy", function(d,i) { return yscale(d); });
}