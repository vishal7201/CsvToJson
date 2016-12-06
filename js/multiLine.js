var svg = d3.select("svg"),
   margin = {top: 20, right: 80, bottom: 30, left: 50},
   width = svg.attr("width") - margin.left - margin.right,
   height = svg.attr("height") - margin.top - margin.bottom,
   g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear().range([0, width]),
   y = d3.scaleLinear().range([height, 0]),
   z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
   .curve(d3.curveBasis)
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.value); });

d3.json("../json/indiaBirthAndDeathRate.json",  function(error, data) {
 if (error) throw error;

 var expectency = Object.keys(data[0]).slice(1).map(function(id) {
   return {
     id: id,
     values: data.map(function(d) {
       return {year: d.year, value: d[id]};
     })
   };
 });

 x.domain([1960,2015]);

 y.domain([0,45 ]);

 z.domain(expectency.map(function(c) { return c.id; }));

 g.append("g")
     .attr("class", "axis axis--x")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

 g.append("g")
     .attr("class", "axis axis--y")
     .call(d3.axisLeft(y))
   .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("fill", "#000")
     .text("Arrested count");

 var city = g.selectAll(".city")
   .data(expectency)
   .enter().append("g")
     .attr("class", "city");

 city.append("path")
     .attr("class", "line")
     .attr("d", function(d) { return line(d.values); })
     .style("stroke", function(d) { return z(d.id); });

 city.append("text")
     .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
     .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.value) + ")"; })
     .attr("x", 3 )
     .attr("dy", "0.35em")
     .style("font", "10px sans-serif")
     .text(function(d) { return d.id; });
});
