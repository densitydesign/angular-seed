(function(){

  var who = window.who || (window.who = {});

  who.barChart = function(){

    var width = 600,
    	height = 600,
      responsive = false,
      resize = false,
    	query = [],
      bgBars,
    	xMax,
	 	dimension,
	 	group,
	 	filter;


    function barChart(selection){
    	selection.each(function(data){

          var chart;


             
          if(responsive){
             width = $(selection.node()).width(), 
             height = $(selection.node()).height() > 0 ? $(selection.node()).height() : 600;
           }

          if (selection.select('svg').empty()){
            chart = selection.append('svg')
              .attr('width', width)
              .attr('height', height)
          }
          else
          {
            chart = selection.select('svg')
                  .attr('width', width)
                  .attr('height', height)
          }

        	var y = d3.scale.ordinal()
    				.rangeRoundBands([0, height], .4);

			var x = d3.scale.linear()
    				.range([0, width-160]);


    		x.domain([0, xMax]);

    		y.domain(group.top(Infinity).map(function(d){return d.key}))

    		var chartContainer = chart.selectAll("g")
    			.data([group.top(Infinity)])

    		chartContainer
    			.enter()
    			.append("g")
    			.attr("transform", "translate(" + 160 + ",0)");

    		chartContainer.exit().remove()

    		
        if(chartContainer.selectAll(".bgBar").empty()){
          
          var bgData = $.extend(true, [], group.top(Infinity));

        bgBars = chartContainer.selectAll(".bgBar")
            .data(bgData)

        bgBars.enter().append("rect")
          .attr("class", "bgBar")
          .attr("y", function(d) { return y(d.key) + 1; })
          .attr("x", 1)
          .attr("height", function(d) { return y.rangeBand()-2})
          .attr("width", function(d){ return x(d.value)})
          .filter(function(d){return x(d.value) >= 2})
          .attr("width", function(d){ return x(d.value) -2 })
        }

        if (resize && !chartContainer.selectAll(".bgBar").empty()){

         bgBars
          .transition()
          .duration(500)
            .attr("width", function(d){return x(d.value)})
            .attr("y", function(d) { return y(d.key) + 1; })
            .attr("x", 1)
            .attr("height", function(d) { return y.rangeBand()-2})
          }

    		var bars = chartContainer.selectAll(".bar")
      			.data(function(d){ return d})

		    bars.enter().append("rect")
		      .attr("class", "bar")
		      .attr("y", function(d) { return y(d.key); })
		      .attr("height", function(d) { return y.rangeBand()})
		      .attr("width", function(d){ return x(d.value)})
		      .style("cursor", "pointer")
		      .on("click", function(d){
		      	var bar = d3.select(this)
		      	var cl = checkSelected(bar.attr("class"))
		      	bar.attr("class", cl)
		      	checkQuery(d.key)
		      	if(query.length == 0){dimension.filterAll()}
		      	else(dimension.filter(function(d) { return query.indexOf(d) >= 0; }))
		      })

        bars
		    	.transition()
		    	.duration(500)
		      	.attr("width", function(d){ return x(d.value)})
            .attr("y", function(d) { return y(d.key); })
            .attr("height", function(d) { return y.rangeBand()})

		    bars.exit().remove()

			var yvalues = chartContainer.selectAll(".yvalue")
      			.data(function(d){return d})

			yvalues.enter().append("text")
			      .attr("class", "yvalue")
			      .attr("y", function(d) { return y(d.key) + y.rangeBand() -2; })
			      .attr("x", 3)
			      .text(function(d){return d.value})


      		yvalues
      			.transition()
            .duration(500)
            .attr("y", function(d) { return y(d.key) + y.rangeBand() -2; })
            .attr("x", 3)
      			.tween("text", function(d) {
      				var i = d3.interpolateNumber(this.textContent, d.value);
        			return function(t) {
            			this.textContent = Math.round(i(t));
        			};
    			});

			yvalues.exit().remove()
      			

			var ylegend = chart.selectAll(".ylegend")
      			.data(group.top(Infinity))
			    
			ylegend.enter().append("text")
			      .attr("class", "ylegend")
			      .attr("y", function(d) { return y(d.key) + y.rangeBand() -2; })
			      .attr("x", 3)
			      .text(function(d){return d.key})

			ylegend
				.text(function(d){return d.key})
        .transition()
        .duration(500)
           .attr("y", function(d) { return y(d.key) + y.rangeBand() -2; })
            .attr("x", 3)

			ylegend.exit().remove()

			d3.rebind(chart, bars, "on")

      resize = false

    	}); //end selection
    } // end barChart

    barChart.width = function(x){
      if (!arguments.length) return width;
      width = x;
      return barChart;
    }

    barChart.height = function(x){
      if (!arguments.length) return height;
      height = x;
      return barChart;
    }

    barChart.xMax = function(x){
      if (!arguments.length) return xMax;
      xMax = x;
      return barChart;
    }

    barChart.dimension = function(x){
      if (!arguments.length) return dimension;
      dimension = x;
      return barChart;
    }

    barChart.group = function(x){
      if (!arguments.length) return group;
      group = x;
      return barChart;
    }

    barChart.responsive = function(x){
      if (!arguments.length) return responsive;
      responsive = x;
      return barChart;
    }

    barChart.resize = function(x){
      if (!arguments.length) return resize;
      resize = x;
      return barChart;
    }

    barChart.filter = function(x){
      if (!arguments.length) return filter;
      filter = x;
      return barChart;
    }

    function checkSelected(x){
    	return x == 'bar' ? 'bar selected' : 'bar'
    }

    function checkQuery(x){
    	var index = query.indexOf(x);
    	if (index > -1){query.splice(index, 1)}
    	else {query.push(x)}
    }

    return barChart;
  }
  
})();