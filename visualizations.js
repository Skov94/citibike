//Width and height
var w_map = 400;
var h_map = 600;
var w_map2 = 850;
var h_map2 = 650;
var w_bar= 450;
var h_bar = 200;

var padding = 40;

//Define path generator (for start stations), using the mercator projection
var projection = d3.geoMercator()
		.translate([w_map/2, h_map/2])
		.scale([500*w_map])
		.center([-74.0650,40.7207]); 
			
var path = d3.geoPath()
			 .projection(projection);
			 
//Define path generator (for all stations), using the mercator projection
var projection1 = d3.geoMercator()
		.translate([w_map2/2, h_map2/2])
		.scale([850*w_map])
		.center([-74.03520,40.72557]); 
			
var path1 = d3.geoPath()
			 .projection(projection1);
			 
//define borough colors
var color = [,"rgb(63,72,77)",
			"rgb(243,142,50)", "rgb(246,99,36)", "rgb(21,108,108)","rgb(21,108,1)"];

// Define the div for the tooltip for start stations
var div = d3.select("#area_map").append("div")	
	.attr("class", "tooltip")				
	.style("opacity", 0);
	
// Define the div for the tooltip for all stations
var div1 = d3.select("#area_jcny_map").append("div")	
	.attr("class", "tooltip")
	.style("height", "100px")
	.style("width", "110px")
	.style("opacity", 0);
	
// Define the div for the tooltip for the routes
var div2 = d3.select("#area_jcny_map").append("div")	
	.attr("class", "tooltip")
	.style("height", "150px")
	.style("width", "150px")
	.style("background", "white")
	.style("opacity", 0);


//create svgs
var svg_map = d3.select("#area_map")
			.append("svg")
			.attr("width", w_map)
			.attr("height", h_map);
			
var svg_bar1 = d3.select("#area_bar1")
			.append("svg")
			.attr("width", w_bar)
			.attr("height", h_bar);

var svg_bar2 = d3.select("#area_bar2")
			.append("svg")
			.attr("width", w_bar)
			.attr("height", h_bar);

var svg_bar3 = d3.select("#area_bar3")
			.append("svg")
			.attr("width", w_bar)
			.attr("height", h_bar);
			
var svg_nyjc_map = d3.select("#area_jcny_map")
			.append("svg")
			.attr("width", w_map2)
			.attr("height", h_map2)
			 .attr("class", "graph-svg-component");


//Function for converting CSV values from strings to Dates and numbers
var rowConverter_start = function(d) {

	return {Longitude: +d.Start_Station_Longitude,
			Latitude: +d.Start_Station_Latitude,
			Station: d.Start_Station_Name,
	};

}

var rowConverter_all = function(d) {

	return {Longitude: +d.End_Station_Longitude,
			Latitude: +d.End_Station_Latitude,
			Station: d.End_Station_Name,
	};

}

var rowConverter_trips = function(d) {

	return {Station: d.Start_Station_Name,
			End_station: d.End_Station_Name,
			Longitude: +d.Start_Station_Longitude,
			Latitude: +d.Start_Station_Latitude,
			Age: +d.Age,
			Gender: +d.Gender,
			Hour: +d.Start_Time_Hour,
			Day: +d.Start_Time_Weekday,
			Month: +d.Start_Time_Month,
	};

}

 var formatNumber = d3.format(",d");

//arrays used for creating the tick text
var week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


//Define and create x-axes	
//month axis
var xScale_month = d3.scaleLinear()
	.domain([1,13])
	.range([1.5*padding, w_bar-2*padding])

var xAxis_month = d3.axisBottom(xScale_month)
	.tickFormat(function(d, i){
		return month[i]
	})
	.ticks(12)
	.tickSize(0);

svg_bar1.append("g")
	.attr("class", "xaxis")
	.attr("transform", "translate(0," + (h_bar - padding) + ")")
	.call(xAxis_month)
 .selectAll("text")
	.attr("y", 6)
	.attr("x", 5)
	.style("text-anchor", "start");	

//create axis labels
svg_bar1.append("text")
	.attr("class", "axislabel")
	.attr("transform", "rotate(-90)")
	.attr("y", 2)
	.attr("x",0 - (h_bar / 2))
	.attr("dy", "1em")
	.text("# of started trips"); 
	
svg_bar1.append("text")  
	.attr("class", "axislabel")
	.attr("transform", "translate(" + (w_bar/2) + " ," + (h_bar-0.1*padding) + ")")
	.text("Month");
	

//day-axis
var xScale_day = d3.scaleLinear()
	.domain([1,8])
	.range([1.5*padding, w_bar-2*padding])

var xAxis_day = d3.axisBottom(xScale_day)
	.tickFormat(function(d, i){
		return week[i]
	})
	.ticks(7)
	.tickSize(0);

svg_bar2.append("g")
	.attr("class", "xaxis")
	.attr("transform", "translate(0," + (h_bar - padding) + ")")
	.call(xAxis_day)
 .selectAll("text")
	.attr("y", 6)
	.attr("x", 12)
	.style("text-anchor", "start");	
	
//create axis labels
svg_bar2.append("text")
	.attr("class", "axislabel")
	.attr("transform", "rotate(-90)")
	.attr("y", 2)
	.attr("x",0 - (h_bar / 2))
	.attr("dy", "1em")
	.text("# of started trips"); 
	
svg_bar2.append("text")  
	.attr("class", "axislabel")
	.attr("transform", "translate(" + (w_bar/2) + " ," + (h_bar-0.1*padding) + ")")
	.text("Day");

//hour-axis
var xScale_hour = d3.scaleLinear()
	.domain([0,24])
	.range([1.5*padding, w_bar-2*padding]);

var xAxis_hour = d3.axisBottom(xScale_hour)
	.ticks(25);

svg_bar3.append("g")
	.attr("class", "xaxis")
	.attr("transform", "translate(0," + (h_bar - padding) + ")")
	.call(xAxis_hour);

//create axis labels
svg_bar3.append("text")
	.attr("class", "axislabel")
	.attr("transform", "rotate(-90)")
	.attr("y", 2)
	.attr("x",0 - (h_bar / 2))
	.attr("dy", "1em")
	.text("# of started trips"); 
	
svg_bar3.append("text")  
	.attr("class", "axislabel")
	.attr("transform", "translate(" + (w_bar/2) + " ," + (h_bar-0.1*padding) + ")")
	.text("Time of day");
	
//define range of y-axes:
var yScale_hour = d3.scaleLinear()
	.range([h_bar-padding, padding]);

var yScale_day = d3.scaleLinear()
	.range([h_bar-padding, padding]);

var yScale_month = d3.scaleLinear()
	.range([h_bar-padding, padding]);

//create title 
svg_map.append("text")
			.attr("x", (w_map / 2))             
			.attr("y", 20)
			.attr("text-anchor", "middle")   
			.text("Jersey City bike stations");
		
//Load in GeoJSON data for showing start station
d3.json("new_jersey.json", function(json) {
	
  //Bind data and create one path per GeoJSON feature
  svg_map.selectAll("path")
	   .data(json.features)
	   .enter()
	   .append("path")
	   .attr("d", path)
	   .style("stroke","white")
	   .style("stroke-width","1px")
	   .style("fill",color[4]);
	
  //load in GeoJSON data for showing all stations 
  d3.json("boroughs-jc.json", function(all_json){
  
	 //Bind data and create one path per GeoJSON feature
	svg_nyjc_map.selectAll("path")
	   .data(all_json.features)
	   .enter()
	   .append("path")
	   .attr("d", path1)
	   .style("stroke","grey")
	   .style("stroke-width","1px")
	   .style("fill",color[1]);
		
	//create borough labels
	svg_nyjc_map.append("text")
		.attr("class", "borough_label")
		.attr("x", (w_map / 2 - 35))             
		.attr("y", 260)
		.text("Jersey City");
		
	svg_nyjc_map.append("text")
		.attr("class", "borough_label")
		.attr("x", w_map2-235)             
		.attr("y", 120)
		.text("Manhatten");
		
	svg_nyjc_map.append("text")
		.attr("class", "borough_label")
		.attr("x", w_map2-125)             
		.attr("y", 560)
		.text("Brooklyn");
		
		
	//load in JC 2017 used city bike start stations
	d3.csv("start_stations.csv", rowConverter_start, function(data){
	
	  //load in JC 2017 used city bike all stations
	  d3.csv("all_stations_u.csv", rowConverter_all, function(all_data){
	
		//load in JC 2017 trip data
		d3.csv("All_data_u.csv",rowConverter_trips, function(trip_data){
		
			//create a legend explaining the colors of the stations in the map with all stations (red: mostly a drop of station, green: mostly a pick up station)
			//Append a defs (for definition) element to your SVG
			var defs = svg_nyjc_map.append("defs");

			//Append a linearGradient element to the defs and give it a unique id
			var linearGradient = defs.append("linearGradient")
			.attr("id", "linear-gradient");
		
			//Horizontal gradient
			linearGradient
				.attr("x1", "0%")
				.attr("y1", "0%")
				.attr("x2", "100%")
				.attr("y2", "0%");
			
			//Set the color for different percents by using the percent to color function
			linearGradient.selectAll("stop")
				.data([
					{offset: "0%", color: perc2color(0)},
					{offset: "12.5%", color: perc2color(12.5)},
					{offset: "25%", color: perc2color(25)},
					{offset: "37.5%", color: perc2color(37.5)},
					{offset: "50%", color: perc2color(50)},
					{offset: "62.5%", color: perc2color(62.5)},
					{offset: "75%", color: perc2color(75)},
					{offset: "87.5%", color: perc2color(87.5)},
					{offset: "100%", color: perc2color(100)}
				])
				.enter().append("stop")
				.attr("offset", function(d) { return d.offset; })
				.attr("stop-color", function(d) { return d.color; });

			//Draw the rectangle and fill with gradient
			svg_nyjc_map.append("rect")
				.attr("width",300)
				.attr("height", 20)
				.attr("transform", "translate(10,10)")
				.style("fill", "url(#linear-gradient)");
				
			//create text explaining the gradient
			svg_nyjc_map.append("text")
				.attr("class", "gradient_text")
				.attr("x", 10)             
				.attr("y", 40)
				.text("Mainly a dropoff station");
		
			svg_nyjc_map.append("text")
				.attr("class", "gradient_text")
				.attr("x", 200)             
				.attr("y", 40)
				.text("Mainly a pickup station");
			
		
			// Create the crossfilter for the relevant dimensions and groups.
			var cf = crossfilter(trip_data),
				all = cf.groupAll(),
				dim_hour = cf.dimension(function(d){ return d.Hour; }),
				group_hour = dim_hour.group(),
				dim_day = cf.dimension(function(d){ return d.Day; }),
				group_day = dim_day.group(),
				dim_month = cf.dimension(function(d){ return d.Month; }),
				group_month = dim_month.group(),
				dim_gender = cf.dimension(function(d){ return d.Gender; }),
				group_gender = dim_gender.group(),
				dim_age = cf.dimension(function(d){ return d.Age; }),
				group_age = dim_age.group(),
				dim_station = cf.dimension(function(d){ return d.Station; }),
				group_station = dim_station.group(),	
				dim_start_end = cf.dimension(function(d){ return d.Station + '-' + d.End_station;}),
				group_start_end = dim_start_end.group();							
			
			//number of total trips (printed on top)
			 d3.selectAll("#total")
				.text(formatNumber(cf.size()));
				
			//initially all are selected (active)
			d3.select("#active1")
				.text(formatNumber(cf.size()));
				
			//create brush for the map (must be done before drawing stations - otherwise tooltips cant be seen - note that it then isn't possible to start the brush on a station)
			var brush_map = d3.brush()
				.on("brush", brushmove_map)
				.on("end", brushend_map);
					
			var brushg_map = svg_map.append("g")
				.attr("class", "brush_map")
				.call(brush_map);

		
			//create circle element for each start station on the map only containing Jersey City
			var stations = svg_map.append("g")
				.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("class", "station_brushed")
				.attr("cx", function(d){                       //position circles by projecting the geocoordinate

					return projection([d.Longitude,d.Latitude])[0];
			
				})
				.attr("cy", function(d){
					
					return projection([d.Longitude,d.Latitude])[1];
							
				})
				.attr("r",function(d){
				
					//scale the radius based on the number of trips made from that station
					//find the station that we are drawing a circle for in the grouping
					var obj = group_station.all().find(o => o.key === d.Station);
					
					//we wish to scale the number of trips into a range where all circles are visible, but the size indicates which stations are most used for the selection (this is determined to be [2,10])
					
					//minimum and maximum number of trips as a radius
					var min =  d3.min(group_station.all(), function(d) { return Math.sqrt(d.value); })
					var max =  d3.max(group_station.all(), function(d) { return Math.sqrt(d.value); })
				
					//return number of trips scaled down
					if (obj.value == 0){
							
						return 0;    //no visible circle if no trips were made from that station
							
					} else {
						return  ((13.0-1.5)*(Math.sqrt(obj.value)-min))/(max-min)+1.5;     //scaled radius
					
					}
					
			
				})
				.on("mouseover", function(d) {		   //create tooltip that states station name, and trips made from that station 
					div.transition()		
						.duration(200)		
						.style("opacity", .9);		
					div.html(function(){
						
						//find the number of trips made from the given station
						var obj = group_station.all().find(o => o.key ===d.Station);
													
						return ("<b>"+d.Station+"</b>" + "<br/> <br/>" + obj.value +  " trip(s) started from this station for the given time/age/gender")	
					})
						.style("left", (d3.event.pageX + 10) + "px")		
						.style("top", (d3.event.pageY + 10) + "px");	
					})					
				.on("mouseout", function(d) {		
					div.transition()		
						.duration(500)		
						.style("opacity", 0);	
				});
				
				
			//find the initial top x routes						
			var coordinate_pairs = coordPairs();
			
			//compute the min and max inflow/outflow which is used for scaling the radius
			var min = computeMin(coordinate_pairs);
			var max = computeMax(coordinate_pairs);						
			
			//create circle element for all stations (both JC and NY (Manhatten, Brooklyn)) - and scale the ones that are on the top x routes
			var stations_all = svg_nyjc_map.append("g")
				.selectAll("circle")
				.data(all_data)
				.enter()
				.append("circle")
				.attr("cx", function(d){                       //position circles by projecting the geocoordinate

					return projection1([d.Longitude,d.Latitude])[0];
			
				})
				.attr("cy", function(d){
					
					return projection1([d.Longitude,d.Latitude])[1];
							
				})
				.attr("fill", function(d){
				
					//return a shade between red and green (green is mostly a hotspot for picking up bikes (start station) and red is for leaving bikes (end station))
					//this is only done for the stations that are on the x most used routes
																							
					//find the trips where the given station is origin
					var obj_o = coordinate_pairs.filter(o => o != 'no_line' && o[0][2] === d.Station);
					
					//find the trips where the given station is destination
					var obj_d = coordinate_pairs.filter(o => o != 'no_line' && o[1][2] === d.Station);
					
					//add up the trips starting at the station
					var start_sum = 0;
					for (var i = 0; i< obj_o.length; i++){
						start_sum += obj_o[i][0][3];
					}
					
					//add up the trips ending at the station
					var end_sum = 0;
					for (var i = 0; i< obj_d.length; i++){
						end_sum += obj_d[i][0][3];
					}
											
					//return the color (grey if it isn't on one of the top x routes)
					if(start_sum == 0 && end_sum == 0){
						return "rgb(204,204,204)";
					} else {
						
						//return the shade (low percentage=red (mostly end station), high percentage=green (mostly start station))
						return perc2color((start_sum)/(start_sum+end_sum)*100);
						
					}
				
				})
				.attr("r",function(d){
					
						
					//find the trips where the given station is origin
					var obj_o = coordinate_pairs.filter(o => o != 'no_line' && o[0][2] === d.Station);
					
					//find the trips where the given station is destination
					var obj_d = coordinate_pairs.filter(o => o != 'no_line' && o[1][2] === d.Station);
					
					//we wish to scale the inflow+outflow (how much of a hot spot the station is) into a range where all circles are visible ([1.5,13]
					
					//first we find the inflow+outflow for the given station
					//add up the trips starting at the station
					var start_sum = 0;
					for (var i = 0; i< obj_o.length; i++){
						start_sum += obj_o[i][0][3];
					}
					
					//add up the trips ending at the station
					var end_sum = 0;
					for (var i = 0; i< obj_d.length; i++){
						end_sum += obj_d[i][0][3];
					}
					
					var inflow_outflow = start_sum + end_sum;

					
					//return the radius (1 if it isn't on one of the top 100 routes)
					if(inflow_outflow == 0){
					
						return 1;
						
					} else {
					
						//return the scaled radius based on the minimum and maximum in/outflow
						return ((15.0-1.5)*(inflow_outflow-min))/(max-min)+1.5;    

						
					}
				
				})
				.on("mouseover", function(d) {		   //create tooltip that states station name, and trips starting and ending here from that station - based on the top x routes 
					div1.transition()		
						.duration(200)		
						.style("opacity", .9);		
					div1.html(function(){
															
							//has to be recomputed for it to change in the mouseover-tooltip
							var coordinate_pairs = coordPairs();
							
							//find the trips where the given station is origin
							var obj_o = coordinate_pairs.filter(o => o != 'no_line' && o[0][2] === d.Station);
															
							//find the trips where the given station is destination
							var obj_d = coordinate_pairs.filter(o => o != 'no_line' && o[1][2] === d.Station);
													
							//first we find the inflow+outflow for the given station
							//add up the trips starting at the station
							var startsum = 0;
							for (var i = 0; i< obj_o.length; i++){
								startsum += obj_o[i][0][3];
							}
					
							//add up the trips ending at the station
							var endsum = 0;
							for (var i = 0; i< obj_d.length; i++){
								endsum += obj_d[i][0][3];
							}
							
													
						return ("<b>"+d.Station+"</b> <br/> <br/> # of pickups: " + startsum + "<br/> <br/> # of dropoffs: " + endsum )	

					})
						.style("left", (d3.event.pageX + 10) + "px")		
						.style("top", (d3.event.pageY + 10) + "px");	
					})					
				.on("mouseout", function(d) {		
					div1.transition()		
						.duration(500)		
						.style("opacity", 0);	
				});
				
			
			//draw the line - we don't want to draw lines between all x routes (we choose to draw 25)						
			var routes = svg_nyjc_map.selectAll("line")
				.data(coordinate_pairs.slice(0,Math.round(0.25*coordinate_pairs.length)))
				.enter()
				.append("line")
				.attr("x1", function(d){if(d[0]!='no_line'){return projection1(d[0])[0];}})
				.attr("y1", function(d){if(d[0]!='no_line'){return projection1(d[0])[1];}})
				.attr("x2", function(d){if(d[0]!='no_line'){return projection1(d[1])[0];}})
				.attr("y2", function(d){if(d[0]!='no_line'){return projection1(d[1])[1];}})
				.attr("class", "routes")
				.on("mouseover", function(d) {		   //create tooltip that states routes (start -> end, end -> start) and number of trips
					div2.transition()		
						.duration(200)		
						.style("opacity", .9);		
					div2.html(function(){
																					
						return ("<b>"+d[0][2] + "&rarr;" + d[1][2] + ":</b> </br></br>" + d[0][3] + " trips </br></br> <b>" +d[1][2] + "&rarr;" + d[0][2] + ":</b> </br></br>" + d[1][3] + " trips" )	
					})
						.style("left", (d3.event.pageX + 10) + "px")		
						.style("top", (d3.event.pageY + 10) + "px");	
					})					
				.on("mouseout", function(d) {		
					div2.transition()		
						.duration(500)		
						.style("opacity", 0);	
				});
				

				
				//create bars for the histograms
				//MONTH		
				//Scale the range of the data in the y domain
				yScale_month.domain([0, d3.max(group_month.all(), function(d) { return d.value; })]);
			
				//add the y Axis
				svg_bar1.append("g")
					.attr("class", "yaxis")
					.attr("transform", "translate(" + 1.5*padding + ", 0)")
					.call(d3.axisLeft(yScale_month).ticks(5));
			
				// append the bar rectangles to the svg element
				rect_month = svg_bar1.selectAll("rect")
					.data(group_month.all())
					.enter()
					.append("rect")
					.attr("class", "brushed")
					.attr("transform", function(d, i) {return "translate(" + (xScale_month(i+1)) + "," + yScale_month(d.value) + ")"; })  
					.attr("x",1.5)
					.attr("width", function(d,i) {    //we subtract and transform in the x-dir to make bars slimmer

						return xScale_month(i+1) - xScale_month(i)-2 ; 
						
					})
					.attr("height", function(d) { return h_bar - yScale_month(d.value) - padding });
				
				//WEEKDAY
				//Scale the range of the data in the y domain
				yScale_day.domain([0, d3.max(group_day.all(), function(d) { return d.value; })]);
			
				//add the y Axis
				svg_bar2.append("g")
					.attr("class", "yaxis")
					.attr("transform", "translate(" + 1.5*padding + ", 0)")
					.call(d3.axisLeft(yScale_day).ticks(5));
			
				// append the bar rectangles to the svg element
				rect_day = svg_bar2.selectAll("rect")
					.data(group_day.all())
					.enter()
					.append("rect")
					.attr("class", "brushed")
					.attr("transform", function(d,i) {return "translate(" + (xScale_day(i+1)) + "," + yScale_day(d.value) + ")"; })  
					.attr("x",1.5)
					.attr("width", function(d,i) { 
						
						return xScale_day(i+1) - xScale_day(i)-2 ;
						
					})
					.attr("height", function(d) { return h_bar - yScale_day(d.value) - padding });
					
				//HOUR
				//Scale the range of the data in the y domain
				yScale_hour.domain([0, d3.max(group_hour.all(), function(d) { return d.value; })]);
			
				//add the y Axis
				svg_bar3.append("g")
					.attr("class", "yaxis")
					.attr("transform", "translate(" + 1.5*padding + ", 0)")
					.call(d3.axisLeft(yScale_hour).ticks(5));
			
				//append the bar rectangles to the svg element
				rect_hour = svg_bar3.selectAll("rect")
					.data(group_hour.all())
					.enter()
					.append("rect")
					.attr("class", "brushed")
					.attr("transform", function(d,i) {return "translate(" + (xScale_hour(i)) + "," + yScale_hour(d.value) + ")"; })  
					.attr("x",1.5)
					.attr("width", function(d,i) {
						
						return xScale_hour(i+1) - xScale_hour(i) - 2;    
						
					})
					.attr("height", function(d) { return h_bar - yScale_hour(d.value) - padding });
												
				//create brushes for the 3 graphs
				var brush_month = d3.brushX()
					.extent([[xScale_month.range()[0], padding],[xScale_month.range()[1],h_bar-padding ]]) //extent of brush (top left corner, bottom right corner)
					.on("brush", brushmove)
					.on("end", brushend);
				
				var brushg_month = svg_bar1.append("g")
					.attr("class","brush")
					.attr("id","month_brush")
					.call(brush_month);
				
				var brush_day = d3.brushX()
					.extent([[xScale_day.range()[0], padding],[xScale_day.range()[1],h_bar-padding ]]) //extent of brush (top left corner, bottom right corner)
					.on("brush", brushmove)
					.on("end", brushend);
				
				var brushg_day = svg_bar2.append("g")
					.attr("class","brush")
					.attr("id","day_brush")
					.call(brush_day)
					.call(brush_day.move,[xScale_day(1),xScale_day(6)]);
					
				var brush_hour = d3.brushX()
					.extent([[xScale_hour.range()[0], padding],[xScale_hour.range()[1],h_bar-padding ]]) //extent of brush (top left corner, bottom right corner)
					.on("brush", brushmove)
					.on("end", brushend);
				
				var brushg_hour = svg_bar3.append("g")
					.attr("class","brush")
					.attr("id","hour_brush")
					.call(brush_hour);

				//function describing what happens when brushing
				function brushmove(){
											
					if(d3.event.selection != null){
					
						var xScale, dim, rect;
					
						//figure out if it is the month, day or hour brush that is being used and assign the proper xScale and dimension:
						if(d3.select(this).attr('id') === 'month_brush') { 
						
							xScale = xScale_month;
							dim = dim_month;
							rect = rect_month;
							
						} else if(d3.select(this).attr('id') === 'day_brush'){
						
							xScale = xScale_day;
							dim = dim_day;
							rect = rect_day;
							
						} else {
						
							xScale = xScale_hour;
							dim = dim_hour;
							rect = rect_hour;
							
						}
					
						//map the coordinates of the brushs' ends to the month numbers
						var d0 = d3.event.selection.map(xScale.invert),
							d1 = [Math.round(d0[0]),Math.round(d0[1])];
							

						// If empty when rounded, use floor & ceil instead.
						if (d1[0] >= d1[1]) {
							d1[0] = Math.floor(d0[0]);
							d1[1] = Math.ceil(d0[1]);
						}
														
						
						//filter month dimension such that it is within the brush (if the brush only is on one month we can't filter it as a range)
						if (d1[0] == (d1[1]-1)){
						
							dim.filter(d1[0]);     //one month
					
						} else {
						
							dim.filter([d1[0],d1[1]]);    //a range, we actually filter d1[0],d1[1]-1, because the brush counts the spaces between month
					
						}
						
						//first set all rects to non brushed
						rect.attr("class", "non_brushed");
						
						//filter rects such that chosen ones are styled differently
						rect.filter(function(i){
							
							return i.key >= d1[0] && i.key <=d1[1]-1;
						
						})
						.attr("class", "brushed")
						
					
					}
					
					//update everything
					renderAll();
					
					
				}
				
				//function describing what happens when done brushing
				function brushend(){
				
					if (!d3.event.sourceEvent) return; // Only transition after input.
					
					
					var xScale, dim, svg;
					
					//figure out if it is the month, day or hour brush that is being used and assign the proper xScale, svg and dimension:
					if(d3.select(this).attr('id') === 'month_brush') { 
						
						xScale = xScale_month;
						dim = dim_month;
						svg = svg_bar1;
							
					} else if(d3.select(this).attr('id') === 'day_brush') {
						
						xScale = xScale_day;
						dim = dim_day;
						svg = svg_bar2;
							
					} else {
						
						xScale = xScale_hour;
						dim = dim_hour;
						svg = svg_bar3;
							
					}
					
					//if there at brushend is no selection, it is because the user has clicked outside the brush without dragging a new brush
					//we will in that case make sure that there is no filter on the dimension, and that all rects are styled as brushed
					if (!d3.event.selection){
						
						svg.selectAll(".non_brushed").attr("class", "brushed")
						dim.filterAll();
						renderAll();
						return;

					} 
						
					//find the ends of the brush
					var d0 = d3.event.selection.map(xScale.invert),
					d1 = [Math.round(d0[0]),Math.round(d0[1])];

					// If empty when rounded, use floor & ceil instead.
					if (d1[0] >= d1[1]) {
						d1[0] = Math.floor(d0[0]);
						d1[1] = Math.ceil(d0[1]);
					}
					
					//transition such that only whole months are brushed
					d3.select(this).transition().call(d3.event.target.move, d1.map(xScale));
				
						
				}
				
				//function describing what happens when brushing on map
				function brushmove_map(){
				
					if(d3.event.selection != null){
					
						//find coordinates describing the corners of the brush
						brush_coords = d3.brushSelection(this);
						
						//set all stations to non-brushed
						stations.attr("class","station_non_brushed");
						
						//filter the stations, such that the brushed ones are styled differently
						stations.filter(function(){
						
							//find position of station
							var cx = d3.select(this).attr("cx"),
								cy = d3.select(this).attr("cy");
								
							//return true/false describing whether station is within brush
							return brush_coords[0][0] <= cx && cx <= brush_coords[1][0] && brush_coords[0][1] <= cy && cy <= brush_coords[1][1];
						
						})
						.attr("class","station_brushed");
						
						//create array of chosen stations
						var brushed_stations = [];
						
						svg_map.selectAll(".station_brushed").each(function(d){
															
							brushed_stations.push(d.Station);
						
						});
						
						
						//filter the data based on the brushed stations and update all data
						dim_station.filterFunction(function(d) { return brushed_stations.indexOf(d) > -1;});
						renderAll();
						
					}
					
				}
				
				//function describing what happens when done brushing on map
				function brushend_map(){
				
					//if there is no selection at brushend, the user has clicked outside the brush, and we then draw all points 
					if(d3.event.selection == null){
					
						//set all stations to brushed
						svg_map.selectAll(".station_non_brushed").attr("class","station_brushed");
						dim_station.filterAll();
						renderAll();
					
					}
				
				}
				
				//function that finds the minimum inflow+outflow
				function computeMin(coordinate_pairs){
					
					//find the minimum inflow+outflow of all of the stations on the top 100 routes
						var min =  d3.min(all_data, function(d) { 
						
							//find the trips where the given station is origin
							var objo = coordinate_pairs.filter(o =>  o != 'no_line' && o[0][2] === d.Station);
					
							//find the trips where the given station is destination
							var objd = coordinate_pairs.filter(o => o != 'no_line' &&  o[1][2] === d.Station);
							
					
							//find the inflow+outflow for the given station (just equals zero if no trips has the given station as origin or destination)
							var start_sum = 0;
							for (var i = 0; i< objo.length; i++){
								start_sum += objo[i][0][3];
							}
					
							//add up the trips ending at the station
							var end_sum = 0;
							for (var i = 0; i< objd.length; i++){
								end_sum += objd[i][0][3];
							}
							
							return start_sum+end_sum; 
							
						
						})
						
						return min;
				
				}
				
				//function that finds the max inflow+outflow
				function computeMax(coordinate_pairs){
					
					//find the max inflow+outflow of all of the stations on the top x routes
						var max =  d3.max(all_data, function(d) { 
						
							//find the trips where the given station is origin
							var objo = coordinate_pairs.filter(o =>  o != 'no_line' &&  o[0][2] === d.Station);
					
							//find the trips where the given station is destination
							var objd = coordinate_pairs.filter(o =>  o != 'no_line' &&  o[1][2] === d.Station);
							
					
							//find the inflow+outflow for the given station (just equals zero if no trips has the given station as origin or destination)
							var start_sum = 0;
							for (var i = 0; i< objo.length; i++){
								start_sum += objo[i][0][3];
							}
					
							//add up the trips ending at the station
							var end_sum = 0;
							for (var i = 0; i< objd.length; i++){
								end_sum += objd[i][0][3];
							}
						
							
							return start_sum+end_sum; 
							
						
							
						
						})
						
						return max;
				
				}
				
				function coordPairs(){
				
					var coordinate_pairs = [];
				
					group_start_end.top(100).forEach(function(d){
			
						//find start and end station							
						var start_station = all_data.find(o => o.Station === d.key.match(/.+\w-/)[0].slice(0,-1));
						var end_station = all_data.find(o => o.Station === d.key.substr(start_station.Station.length+1,d.key.length)); 
				
						//if the end station isn't defined (e.g "Hs Don't Use" is used many times) or if no start -> end trips are made - we dont want to draw a line
						if(!end_station || d.value == 0){ 
					
							//used to make sure that no line is drawn (otherwise it will just keep old lines, such that there always is drawn x lines)
							coordinate_pairs.push(['no_line'])
					
						} else {
				
							//find the number of trips made from end station to start (if there are any in the top x list)
							var end_station_group = group_start_end.top(100).find(x => x.key === end_station.Station.concat('-').concat(start_station.Station));
					
							if(end_station_group){    //if there are trips from end -> start we save them 
													
								//save coordinates of start and end station + start and end station names + trips made from start -> end 
								coordinate_pairs.push([[start_station.Longitude,start_station.Latitude, start_station.Station, d.value],[end_station.Longitude,end_station.Latitude, end_station.Station,end_station_group.value]]);
					
							}else{  //if no trips are made we set them to zero
					
								coordinate_pairs.push([[start_station.Longitude,start_station.Latitude, start_station.Station, d.value],[end_station.Longitude,end_station.Latitude, end_station.Station, 0]]);
					
							}
				
						}

					})
					
					return coordinate_pairs;
					
				}
				
				//function that re-renders everything (calls update function for all three graphs and for the stations + updates text specifying number of trips)
				function renderAll(){
					
					renderGraphs(svg_bar1, xScale_month, yScale_month, group_month,1)
					renderGraphs(svg_bar2, xScale_day, yScale_day, group_day,1)
					renderGraphs(svg_bar3, xScale_hour, yScale_hour, group_hour,0)
					
					renderStation()
																					
					//number of selected trips (printed on top)
					 d3.select("#active1").text(formatNumber(all.value()));
					 
					 //render the other map (lines and stations)
					 renderRoutes_and_stations()
				
				}
				
				//function that updates the size of stations based on the number of trips started from them
				function renderStation(){
				
					svg_map.selectAll("circle")
						.data(data)
						.transition()
						.duration(1000)
						.attr("r",function(d){
						
				
							//scale the radius based on the number of trips made from that station
							//find the station that we are drawing a circle for in the grouping
							var obj = group_station.all().find(o => o.key === d.Station);
						
							var min =  d3.min(group_station.all(), function(d) { return Math.sqrt(d.value); })
							var max =  d3.max(group_station.all(), function(d) { return Math.sqrt(d.value); })
				
							//return number of trips scaled down
							if (obj.value == 0 || isNaN(obj.value)){
							
								return 0;    //no visible circle if no trips were made from that station
							
							} else {
								
								return ((13.0-1.5)*(Math.sqrt(obj.value)-min))/(max-min)+1.5;     //scaled radius
					
							}
				
						
			
						});
				
					
				}
				
				//function that updates graphs (hour, day, month) after changing the age or gender:
				function renderGraphs(svg, xScale, yScale, group, add){
				
					//update the yscale 
					yScale.domain([0, d3.max(group.all(), function(d) { return d.value; })]);
					
					//update the y axis
					svg.select(".yaxis")
						.transition()
						.duration(1000)
						.call(d3.axisLeft(yScale));
						
					//update the height of the bars for hour
					svg.selectAll("rect")
						.data(group.all())
						.transition()
						.duration(1000)
						.attr("transform", function(d,i) {return "translate(" + (xScale(i+add)) + "," + yScale(d.value) + ")"; })    //add is because +1 is necessary for month and day, but not hour
						.attr("height", function(d) { return h_bar - yScale(d.value) - padding; });
					
				}
				
				function renderRoutes_and_stations(){
				
					//find the new top x most used routes					
					var coordinate_pairs = coordPairs();

					//draw the new lines	
					routes
						.data(coordinate_pairs.slice(0,Math.round(0.25*coordinate_pairs.length)))
						.transition()
						.duration(1000)
						.attr("x1", function(d){if(d[0]!='no_line') {return projection1(d[0])[0];}})   //only draw lines, when there actually are trips
						.attr("y1", function(d){if(d[0]!='no_line') {return projection1(d[0])[1];}})
						.attr("x2", function(d){if(d[0]!='no_line') {return projection1(d[1])[0];}})
						.attr("y2", function(d){if(d[0]!='no_line') {return projection1(d[1])[1];}});
					
					
					//find the minimum and maximum inflow+outflow of all of the stations on the top x routes
					var min =  computeMin(coordinate_pairs);
					var max =  computeMax(coordinate_pairs);

													
					//color and scale the radius of the stations
					stations_all
						.data(all_data)
						.transition()
						.duration(1000)
						.attr("r",function(d){
							
							//find the trips where the given station is origin
							var obj_o = coordinate_pairs.filter(o => o != 'no_line' && o[0][2] === d.Station);
					
							//find the trips where the given station is destination
							var obj_d = coordinate_pairs.filter(o => o != 'no_line' && o[1][2] === d.Station);
					
							//we wish to scale the inflow+outflow (how much of a hot spot the station is) into a range where all circles are visible ([1.5,13]
					
							//first we find the inflow+outflow for the given station
							//add up the trips starting at the station
							var startsum = 0;
							for (var i = 0; i< obj_o.length; i++){
								startsum += obj_o[i][0][3];
							}
					
							//add up the trips ending at the station
							var endsum = 0;
							for (var i = 0; i< obj_d.length; i++){
								endsum += obj_d[i][0][3];
							}
					
							var inflow_outflow = startsum + endsum;
					
							//return the radius (1 if it isn't on one of the top x routes)
							if(inflow_outflow == 0){
					
								return 1;
						
							} else {
								
								//return the scaled radius, based on the min and maximum inflow/outflow
								return ((15.0-1.5)*(inflow_outflow-min))/(max-min)+1.5;  

							}
						})
						.attr("fill", function(d){
						
							//return a shade between red and green (green is mostly a hotspot for picking up bikes (start station) and red is for leaving bikes (end station))
							//this is only done for the stations that are on the x most used routes
							//find the trips where the given station is origin
							var obj_o = coordinate_pairs.filter(o => o != 'no_line' && o[0][2] === d.Station);
															
							//find the trips where the given station is destination
							var obj_d = coordinate_pairs.filter(o => o != 'no_line' && o[1][2] === d.Station);
													
							//first we find the inflow+outflow for the given station
							//add up the trips starting at the station
							var startsum = 0;
							for (var i = 0; i< obj_o.length; i++){
								startsum += obj_o[i][0][3];
							}
					
							//add up the trips ending at the station
							var endsum = 0;
							for (var i = 0; i< obj_d.length; i++){
								endsum += obj_d[i][0][3];
							}
									
							//return the color (grey if it isn't on one of routes)
							if(startsum == 0 && endsum == 0){
								return "rgb(204,204,204)";
							} else {
							
								//return the shade (low percentage=red (mostly end station), high percentage=green (mostly start station))
								return perc2color((startsum)/(startsum+endsum)*100);
						
							}
					
				
						})
					
				}

				
				//create functions for the checkboxes (male, female, age):
				//female checkbox
				document.getElementById("femaleCheck").addEventListener("click", function(){
				
					female_status = document.getElementById("femaleCheck").checked;
					male_status = document.getElementById("maleCheck").checked;
									
					// change the gender dimension based on whether the box is checked or not
					if (female_status){
	
						if(male_status){    //if female, male: checked, the dimension should be filtered to contain both
						
							dim_gender.filterAll();   
		
						} else {                           //if female: checked, male: unchecked, the dimension should be filtered to only contain female
		
							dim_gender.filter(2);
		
						}

					} else {
		
						if(male_status){     //if female: unchecked and male: checked, the dimension should be filtered to only have the male
			
							dim_gender.filter(1);   
		
						} else {    //if neither gender is checked, non data should be displayed
		
							dim_gender.filter(3);    //we get no data by only choosing 3, which isn't in the dataset
		
						}
		
					}

					
					//update the 3 graphs
					renderAll()
							
				});
				

	
				//male checkbox
				document.getElementById("maleCheck").addEventListener("click", function(){
				
					var female_status = document.getElementById("femaleCheck").checked;
					var male_status = document.getElementById("maleCheck").checked;
									
					// change the gender dimension based on whether the box is checked or not
					if (male_status){
	
						if(female_status){    //if female, male: checked, the dimension should be filtered to contain both
						
							dim_gender.filterAll();   
		
						} else {                           //if male: checked, female: unchecked, the dimension should be filtered to only contain male
		
							dim_gender.filter(1);
		
						}

					} else {
		
						if(female_status){     //if male: unchecked and female: checked, the dimension should be filtered to only have the female
			
							dim_gender.filter(2);   
		
						} else {    //if neither gender is checked, non data should be displayed
		
							dim_gender.filter(3);    //we get no data by only choosing 3, which isn't in the dataset
		
						}
		
					}
					
					
					//update the 3 graphs
					renderAll()
								
				});
				
				//age boxes
				document.getElementById("min_age").addEventListener("change", function(){
				
					var age_min = +document.getElementById("min_age").value;
					var age_max = +document.getElementById("max_age").value;
									
					//create new filter on age dimension based on min and max age 
					dim_age.filter([age_min,age_max+1]);
													
					//update the 3 graphs
					renderAll()

				
				});
				
				document.getElementById("max_age").addEventListener("change", function(){
				
					var age_min = +document.getElementById("min_age").value;
					var age_max = +document.getElementById("max_age").value;
													
					//create new filter on age dimension based on min and max age 
					dim_age.filter([age_min,age_max+1]);
													
					//update the 3 graphs
					renderAll()
				
				});
				
				//https://gist.github.com/mlocati/7210513
				function perc2color(perc) {
					var r, g, b = 0;
					if(perc < 50) {
						r = 255;
						g = Math.round(5.1 * perc);
					} else {
						g = 255;
						r = Math.round(510 - 5.10 * perc);
					}
					var h = r * 0x10000 + g * 0x100 + b * 0x1;
					return '#' + ('000000' + h.toString(16)).slice(-6);
				}
		
		});
	});
	
   });
  });
	
});
			

				