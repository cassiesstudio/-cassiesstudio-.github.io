//////////////////////
//////chart1//////////
/////////////////////
{
let fullWidth1 = 730;
let fullHeight1 = 400;
let margin1 = {top: 60, right: 20, bottom: 20, left: 15};
let width1 = fullWidth1 - margin1.left - margin1.right;
let height1 = fullHeight1 - margin1.top - margin1.bottom;
let svg1 = d3.select("#chart1")
            .append("svg")
            .attr("width", fullWidth1)
            .attr("height", fullHeight1);

let yAxis = g => g
    .attr("transform",`translate(${margin1.left},0)`)
    .call(d3.axisLeft(y0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

let xAxis = g => g
    .attr("transform", "translate(0,380)")
    .call(d3.axisBottom(x).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("y", -15)
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text(yLabel))

let color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

let stack = d3.stack()
    .keys(keys1)
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetNone)

let layers = stack(data)
console.log(layers);

let maxX = d3.max(layers,  function(l){
                    return d3.max(l, function(d) { return d[1]; })
                }
            )
console.log(maxX);

let x = d3.scaleLinear()
    .domain([0, maxX]).nice()
    .rangeRound([ margin1.left,fullWidth1 - margin1.right])

let y0 = d3.scaleBand()
    .domain(data.map(d => d[groupKey]))
    .rangeRound([margin1.top, fullHeight1 - margin1.bottom])
    .paddingInner(0.4)

let explanation = ["Highly Dissatisfied (1)","Dissatisfied (2)","Neutral (3)","Satisfied (4)","Highly Satisfied (5)"]

let y1 = d3.scaleBand()
    .domain(explanation)
    .rangeRound([margin1.top-35, fullHeight1 - margin1.bottom-35])
    .paddingInner(0.4)

let yTags = svg1 => {
    const g = svg1
        .attr("transform", `translate(${margin1.left},${margin1.top-35})`)
        .attr("text-anchor", "start")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll("g")
      .data(explanation)
      .join("g");

  g.append("text")
      .attr("x", 0)
      .attr("y", d => y1(d))
      .attr("dy", "0.35em")
      .text(d => d);

}

let fullLabel = d3.scaleOrdinal()
    .domain(keys1)
    .range(label1)

let tooltip = d3.select("body").append("div").classed("tooltip", true);

let legend = svg1 => {
  const g = svg1
      .attr("transform", `translate(${width1},${margin1.top})`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(color.domain().slice())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  g.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color)
      .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

  g.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);

    function mouseover(d){
        d3.select(this)
        .transition()
        .style("stroke", "black");
        tooltip
            .style("display", null)
            .html("<p>" + d + ": " + fullLabel(d) + " </p>");
    }

    function mousemove(d){
        tooltip
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX -200) + "px");
    }

    function mouseout(d){
        d3.select(this)
           .transition()
           .style("stroke", "none");

         tooltip.style("display", "none");
    }
}
svg1.append("rect")
    .attr("x", margin1.left)
    .attr("y", y0(1))
    .attr("width", "349")
    .attr("height", y0.bandwidth())
    .attr("fill", "rgba(223, 223, 223, 0)")
    .attr("stroke", "red")
    .attr("stroke-width", "2.5px")

let series = svg1
    // .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")")
  .selectAll(".layer")
  .data(layers)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })

series.selectAll("rect.layer")
    .data(d => d)
  .attr("class","layer")
  .enter().append("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y0(d.data.answer))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y0.bandwidth())
    .on("mouseover", mouseoverBar)
      .on("mousemove", mousemoveBar)
      .on("mouseout", mouseoutBar);

function mouseoverBar(d){
    d3.select(this)
    .transition()
    .style("stroke", "black");
    var parent = d3.select(this).node().parentNode.__data__;
    tooltip
        .style("display", null)
        .html("<p>" + parent.key + ": " + (d[1]-d[0]) + " </p>");
}

function mousemoveBar(d){
    tooltip
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");
}

function mouseoutBar(d){
    d3.select(this)
       .transition()
       .style("stroke", "none");

     tooltip.style("display", "none");
}

svg1.append("g")
.call(xAxis);

// svg1.append("g")
//     .call(yAxis);

svg1.append("g")
    .call(legend);

svg1.append("g")
    .call(yTags);

svg1.append("text")
.attr("x", 15)
.attr("y", 28)
.attr("text-anchor", "start")
.attr("font-size", "18")
.attr("font-family", "open sans")
.text("How satisfied are you with course 3?");
}
//////////////////////
//////chart2//////////
/////////////////////
{
    let fullWidth1 = 450;
    let fullHeight1 = 450;
    let margin1 = {top: 60, right: 10, bottom: 40, left: 40};
    let width1 = fullWidth1 - margin1.left - margin1.right;
    let height1 = fullHeight1 - margin1.top - margin1.bottom;
    let svg1 = d3.select("#chart2")
                .append("svg")
                .attr("width", fullWidth1)
                .attr("height", fullHeight1);


    let yAxis = g => g
        .attr("transform", "translate(40,0)")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(yLabel))

    let xAxis = g => g
        .attr("transform", `translate(0,${fullHeight1 - margin1.bottom})`)
        .call(d3.axisBottom(x0).tickSizeOuter(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:nth-last-of-type(1) text").clone()
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text(xLabel))

    let color = d3.scaleOrdinal()
        .range(["#ccb2b2","#b5988d","#9d8969","#cccab2"])

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(keys2, key => d[key]))]).nice()
        .rangeRound([fullHeight1 - margin1.bottom, margin1.top])

    let x0 = d3.scaleBand()
        .domain(data.map(d => d[groupKey]))
        .rangeRound([margin1.left, fullWidth1 - margin1.right])
        .paddingInner(0.1)

    let x1 = d3.scaleBand()
        .domain(keys2)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05)

        let fullLabel = d3.scaleOrdinal()
            .domain(keys2)
            .range(label2)

        let tooltip = d3.select("body").append("div").classed("tooltip", true);

        let legend = svg1 => {
          const g = svg1
              .attr("transform", `translate(${width1},${margin1.top})`)
              .attr("text-anchor", "end")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
            .selectAll("g")
            .data(color.domain().slice())
            .join("g")
              .attr("transform", (d, i) => `translate(0,${i * 20})`);

          g.append("rect")
              .attr("x", -19)
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill", color)
              .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout);

          g.append("text")
              .attr("x", -24)
              .attr("y", 9.5)
              .attr("dy", "0.35em")
              .text(d => d);

            function mouseover(d){
                d3.select(this)
                .transition()
                .style("stroke", "black");
                tooltip
                    .style("display", null)
                    .html("<p>" + d + ": " + fullLabel(d) + " </p>");
            }

            function mousemove(d){
                tooltip
                    .style("top", (d3.event.pageY - 10) + "px" )
                    .style("left", (d3.event.pageX -200) + "px");
            }

            function mouseout(d){
                d3.select(this)
                   .transition()
                   .style("stroke", "none");

                 tooltip.style("display", "none");
            }
        }


    svg1.append("g")
        // .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
      .selectAll("rect")
      .data(d => keys2.map(key => ({key, value: d[key]})))
      .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr("fill", d => color(d.key))
        .on("mouseover", mouseoverBar)
          .on("mousemove", mousemoveBar)
          .on("mouseout", mouseoutBar);

    function mouseoverBar(d){
        d3.select(this)
        .transition()
        .style("stroke", "black");
        tooltip
            .style("display", null)
            .html("<p>" + d.key + ": " + d.value + " </p>");
    }

    function mousemoveBar(d){
        tooltip
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
    }

    function mouseoutBar(d){
        d3.select(this)
           .transition()
           .style("stroke", "none");
         tooltip.style("display", "none");
    }

    svg1.append("g")
    .call(xAxis);

    svg1.append("g")
        .call(yAxis);

    svg1.append("g")
        .call(legend);

    svg1.append("text")
    .attr("x", 15)
    .attr("y", 35)
    .attr("text-anchor", "start")
    .attr("font-size", "18")
    .attr("font-family", "open sans")
    .text("Benefits Of Course 3");
}
//////////////////////
//////chart3//////////
/////////////////////
{
    let fullWidth1 = 450;
    let fullHeight1 = 450;
    let margin1 = {top: 60, right: 10, bottom: 40, left: 40};
    let width1 = fullWidth1 - margin1.left - margin1.right;
    let height1 = fullHeight1 - margin1.top - margin1.bottom;
    let svg1 = d3.select("#chart3")
                .append("svg")
                .attr("width", fullWidth1)
                .attr("height", fullHeight1);


    let yAxis = g => g
        .attr("transform", "translate(40,0)")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(yLabel))

    let xAxis = g => g
        .attr("transform", "translate(0,410)")
        .call(d3.axisBottom(x0).tickSizeOuter(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:nth-last-of-type(1) text").clone()
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text(xLabel))

    let color = d3.scaleOrdinal()
        .range([d3.interpolateBrBG(0),d3.interpolateBrBG(0.08),d3.interpolateBrBG(0.16),d3.interpolateBrBG(0.24),d3.interpolateBrBG(0.32),d3.interpolateBrBG(0.38)])

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(keys3, key => d[key]))]).nice()
        .rangeRound([fullHeight1 - margin1.bottom, margin1.top])

    let x0 = d3.scaleBand()
        .domain(data.map(d => d[groupKey]))
        .rangeRound([margin1.left, fullWidth1 - margin1.right])
        .paddingInner(0.1)

    let x1 = d3.scaleBand()
        .domain(keys3)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05)

        let fullLabel = d3.scaleOrdinal()
            .domain(keys3)
            .range(label3)

        let tooltip = d3.select("body").append("div").classed("tooltip", true);

        let legend = svg1 => {
          const g = svg1
              .attr("transform", `translate(${width1},${margin1.top})`)
              .attr("text-anchor", "end")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
            .selectAll("g")
            .data(color.domain().slice())
            .join("g")
              .attr("transform", (d, i) => `translate(0,${i * 20})`);

          g.append("rect")
              .attr("x", -19)
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill", color)
              .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout);

          g.append("text")
              .attr("x", -24)
              .attr("y", 9.5)
              .attr("dy", "0.35em")
              .text(d => d);

            function mouseover(d){
                d3.select(this)
                .transition()
                .style("stroke", "black");
                tooltip
                    .style("display", null)
                    .html("<p>" + d + ": " + fullLabel(d) + " </p>");
            }

            function mousemove(d){
                tooltip
                    .style("top", (d3.event.pageY - 10) + "px" )
                    .style("left", (d3.event.pageX -200) + "px");
            }

            function mouseout(d){
                d3.select(this)
                   .transition()
                   .style("stroke", "none");

                 tooltip.style("display", "none");
            }
        }


    svg1.append("g")
        // .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
      .selectAll("rect")
      .data(d => keys3.map(key => ({key, value: d[key]})))
      .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr("fill", d => color(d.key))
        .on("mouseover", mouseoverBar)
          .on("mousemove", mousemoveBar)
          .on("mouseout", mouseoutBar);

    function mouseoverBar(d){
        d3.select(this)
        .transition()
        .style("stroke", "black");
        tooltip
            .style("display", null)
            .html("<p>" + d.key + ": " + d.value + " </p>");
    }

    function mousemoveBar(d){
        tooltip
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
    }

    function mouseoutBar(d){
        d3.select(this)
           .transition()
           .style("stroke", "none");
         tooltip.style("display", "none");
    }

    svg1.append("g")
    .call(xAxis);

    svg1.append("g")
        .call(yAxis);

    svg1.append("g")
        .call(legend);

    svg1.append("text")
    .attr("x", 15)
    .attr("y", 35)
    .attr("text-anchor", "start")
    .attr("font-size", "18")
    .attr("font-family", "open sans")
    .text("Teaching Management");
}
//////////////////////
//////chart4//////////
/////////////////////
{
let fullWidth1 = 730;
let fullHeight1 = 285;
let margin1 = {top: 60, right: 20, bottom: 20, left: 15};
let width1 = fullWidth1 - margin1.left - margin1.right;
let height1 = fullHeight1 - margin1.top - margin1.bottom;
let svg1 = d3.select("#chart4")
            .append("svg")
            .attr("width", fullWidth1)
            .attr("height", fullHeight1);

let yAxis = g => g
    .attr("transform",`translate(${margin1.left},0)`)
    .call(d3.axisLeft(y0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

let xAxis = g => g
    .attr("transform", `translate(0,${fullHeight1 - margin1.bottom})`)
    .call(d3.axisBottom(x).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("y", -15)
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text(yLabel))

let color = d3.scaleOrdinal()
    .range(d3.schemeBlues[6])

let stack = d3.stack()
    .keys(keys4)
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetNone)

let layers = stack(data)
console.log(layers);

let maxX = d3.max(layers,  function(l){
                    return d3.max(l, function(d) { return d[1]; })
                }
            )
console.log(maxX);

let x = d3.scaleLinear()
    .domain([0, maxX]).nice()
    .rangeRound([ margin1.left,fullWidth1 - margin1.right])

let y0 = d3.scaleBand()
    .domain(data.map(d => d[groupKey]))
    .rangeRound([margin1.top, fullHeight1 - margin1.bottom])
    .paddingInner(0.4)

let explanation = ["Highly Dissatisfied (1)","Dissatisfied (2)","Neutral (3)","Satisfied (4)","Highly Satisfied (5)"]

let y1 = d3.scaleBand()
    .domain(explanation)
    .rangeRound([margin1.top-35, fullHeight1 - margin1.bottom-35])
    .paddingInner(0.4)

let yTags = svg1 => {
    const g = svg1
        .attr("transform", `translate(${margin1.left},${margin1.top-35})`)
        .attr("text-anchor", "start")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll("g")
      .data(explanation)
      .join("g");

  g.append("text")
      .attr("x", 0)
      .attr("y", d => y1(d))
      .attr("dy", "0.35em")
      .text(d => d);

}

// let x1 = d3.scaleBand()
//     .domain(keys1)
//     .rangeRound([0, x0.bandwidth()])
//     .padding(0.05)

let fullLabel = d3.scaleOrdinal()
    .domain(keys4)
    .range(label4)

let tooltip = d3.select("body").append("div").classed("tooltip", true);

let legend = svg1 => {
  const g = svg1
      .attr("transform", `translate(${width1},10)`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(color.domain().slice())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  g.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color)
      .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

  g.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);

    function mouseover(d){
        d3.select(this)
        .transition()
        .style("stroke", "black");
        tooltip
            .style("display", null)
            .html("<p>" + d + ": " + fullLabel(d) + " </p>");
    }

    function mousemove(d){
        tooltip
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX -200) + "px");
    }

    function mouseout(d){
        d3.select(this)
           .transition()
           .style("stroke", "none");

         tooltip.style("display", "none");
    }
}

let series = svg1
    // .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")")
  .selectAll(".layer")
  .data(layers)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })

series.selectAll("rect.layer")
    .data(d => d)
  .attr("class","layer")
  .enter().append("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y0(d.data.answer))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y0.bandwidth())
    .on("mouseover", mouseoverBar)
      .on("mousemove", mousemoveBar)
      .on("mouseout", mouseoutBar);

function mouseoverBar(d){
    d3.select(this)
    .transition()
    .style("stroke", "black");
    var parent = d3.select(this).node().parentNode.__data__;
    tooltip
        .style("display", null)
        .html("<p>" + parent.key + ": " + (d[1]-d[0]) + " </p>");
}

function mousemoveBar(d){
    tooltip
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");
}

function mouseoutBar(d){
    d3.select(this)
       .transition()
       .style("stroke", "none");

     tooltip.style("display", "none");
}

svg1.append("g")
.call(xAxis);

// svg1.append("g")
//     .call(yAxis);

svg1.append("g")
    .call(legend);

svg1.append("g")
    .call(yTags);

svg1.append("text")
.attr("x", 15)
.attr("y", 28)
.attr("text-anchor", "start")
.attr("font-size", "18")
.attr("font-family", "open sans")
.text("1.Individual Professional Level");
}
//////////////////////
//////chart5//////////
/////////////////////
{
let fullWidth1 = 730;
let fullHeight1 = 285;
let margin1 = {top: 60, right: 20, bottom: 20, left: 15};
let width1 = fullWidth1 - margin1.left - margin1.right;
let height1 = fullHeight1 - margin1.top - margin1.bottom;
let svg1 = d3.select("#chart5")
            .append("svg")
            .attr("width", fullWidth1)
            .attr("height", fullHeight1);

let yAxis = g => g
    .attr("transform",`translate(${margin1.left},0)`)
    .call(d3.axisLeft(y0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

let xAxis = g => g
    .attr("transform", `translate(0,${fullHeight1 - margin1.bottom})`)
    .call(d3.axisBottom(x).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("y", -15)
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text(yLabel))

let color = d3.scaleOrdinal()
    .range(d3.schemeBlues[6])

let stack = d3.stack()
    .keys(keys5)
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetNone)

let layers = stack(data)
console.log(layers);

let maxX = d3.max(layers,  function(l){
                    return d3.max(l, function(d) { return d[1]; })
                }
            )
console.log(maxX);

let x = d3.scaleLinear()
    .domain([0, maxX]).nice()
    .rangeRound([ margin1.left,fullWidth1 - margin1.right])

let y0 = d3.scaleBand()
    .domain(data.map(d => d[groupKey]))
    .rangeRound([margin1.top, fullHeight1 - margin1.bottom])
    .paddingInner(0.4)

let explanation = ["Highly Dissatisfied (1)","Dissatisfied (2)","Neutral (3)","Satisfied (4)","Highly Satisfied (5)"]

let y1 = d3.scaleBand()
    .domain(explanation)
    .rangeRound([margin1.top-35, fullHeight1 - margin1.bottom-35])
    .paddingInner(0.4)

let yTags = svg1 => {
    const g = svg1
        .attr("transform", `translate(${margin1.left},${margin1.top-35})`)
        .attr("text-anchor", "start")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll("g")
      .data(explanation)
      .join("g");

  g.append("text")
      .attr("x", 0)
      .attr("y", d => y1(d))
      .attr("dy", "0.35em")
      .text(d => d);

}

// let x1 = d3.scaleBand()
//     .domain(keys1)
//     .rangeRound([0, x0.bandwidth()])
//     .padding(0.05)

let fullLabel = d3.scaleOrdinal()
    .domain(keys5)
    .range(label5)

let tooltip = d3.select("body").append("div").classed("tooltip", true);

let legend = svg1 => {
  const g = svg1
      .attr("transform", `translate(${width1},10)`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(color.domain().slice())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  g.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color)
      .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

  g.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);

    function mouseover(d){
        d3.select(this)
        .transition()
        .style("stroke", "black");
        tooltip
            .style("display", null)
            .html("<p>" + d + ": " + fullLabel(d) + " </p>");
    }

    function mousemove(d){
        tooltip
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX -200) + "px");
    }

    function mouseout(d){
        d3.select(this)
           .transition()
           .style("stroke", "none");

         tooltip.style("display", "none");
    }
}


let series = svg1
    // .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")")
  .selectAll(".layer")
  .data(layers)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })

series.selectAll("rect.layer")
    .data(d => d)
  .attr("class","layer")
  .enter().append("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y0(d.data.answer))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y0.bandwidth())
    .on("mouseover", mouseoverBar)
      .on("mousemove", mousemoveBar)
      .on("mouseout", mouseoutBar);

function mouseoverBar(d){
    d3.select(this)
    .transition()
    .style("stroke", "black");
    var parent = d3.select(this).node().parentNode.__data__;
    tooltip
        .style("display", null)
        .html("<p>" + parent.key + ": " + (d[1]-d[0]) + " </p>");
}

function mousemoveBar(d){
    tooltip
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");
}

function mouseoutBar(d){
    d3.select(this)
       .transition()
       .style("stroke", "none");

     tooltip.style("display", "none");
}

svg1.append("g")
.call(xAxis);

// svg1.append("g")
//     .call(yAxis);

svg1.append("g")
    .call(legend);

svg1.append("g")
    .call(yTags);

svg1.append("text")
.attr("x", 15)
.attr("y", 28)
.attr("text-anchor", "start")
.attr("font-size", "18")
.attr("font-family", "open sans")
.text("2.Working Attitude");
}
//////////////////////
//////chart6//////////
/////////////////////
{
let fullWidth1 = 730;
let fullHeight1 = 285;
let margin1 = {top: 60, right: 20, bottom: 20, left: 15};
let width1 = fullWidth1 - margin1.left - margin1.right;
let height1 = fullHeight1 - margin1.top - margin1.bottom;
let svg1 = d3.select("#chart6")
            .append("svg")
            .attr("width", fullWidth1)
            .attr("height", fullHeight1);

let yAxis = g => g
    .attr("transform",`translate(${margin1.left},0)`)
    .call(d3.axisLeft(y0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

let xAxis = g => g
    .attr("transform", `translate(0,${fullHeight1 - margin1.bottom})`)
    .call(d3.axisBottom(x).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("y", -15)
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text(yLabel))

let color = d3.scaleOrdinal()
    .range(d3.schemeBlues[6])

let stack = d3.stack()
    .keys(keys6)
    .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetNone)

let layers = stack(data)
console.log(layers);

let maxX = d3.max(layers,  function(l){
                    return d3.max(l, function(d) { return d[1]; })
                }
            )
console.log(maxX);

let x = d3.scaleLinear()
    .domain([0, maxX]).nice()
    .rangeRound([ margin1.left,fullWidth1 - margin1.right])

let y0 = d3.scaleBand()
    .domain(data.map(d => d[groupKey]))
    .rangeRound([margin1.top, fullHeight1 - margin1.bottom])
    .paddingInner(0.4)

let explanation = ["Highly Dissatisfied (1)","Dissatisfied (2)","Neutral (3)","Satisfied (4)","Highly Satisfied (5)"]

let y1 = d3.scaleBand()
    .domain(explanation)
    .rangeRound([margin1.top-35, fullHeight1 - margin1.bottom-35])
    .paddingInner(0.4)

let yTags = svg1 => {
    const g = svg1
        .attr("transform", `translate(${margin1.left},${margin1.top-35})`)
        .attr("text-anchor", "start")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
      .selectAll("g")
      .data(explanation)
      .join("g");

  g.append("text")
      .attr("x", 0)
      .attr("y", d => y1(d))
      .attr("dy", "0.35em")
      .text(d => d);

}

// let x1 = d3.scaleBand()
//     .domain(keys1)
//     .rangeRound([0, x0.bandwidth()])
//     .padding(0.05)

let fullLabel = d3.scaleOrdinal()
    .domain(keys6)
    .range(label6)

let tooltip = d3.select("body").append("div").classed("tooltip", true);

let legend = svg1 => {
  const g = svg1
      .attr("transform", `translate(${width1},10)`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(color.domain().slice())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  g.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color)
      .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

  g.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);

    function mouseover(d){
        d3.select(this)
        .transition()
        .style("stroke", "black");
        tooltip
            .style("display", null)
            .html("<p>" + d + ": " + fullLabel(d) + " </p>");
    }

    function mousemove(d){
        tooltip
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX -200) + "px");
    }

    function mouseout(d){
        d3.select(this)
           .transition()
           .style("stroke", "none");

         tooltip.style("display", "none");
    }
}


let series = svg1
    // .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")")
  .selectAll(".layer")
  .data(layers)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })

series.selectAll("rect.layer")
    .data(d => d)
  .attr("class","layer")
  .enter().append("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y0(d.data.answer))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y0.bandwidth())
    .on("mouseover", mouseoverBar)
      .on("mousemove", mousemoveBar)
      .on("mouseout", mouseoutBar);

function mouseoverBar(d){
    d3.select(this)
    .transition()
    .style("stroke", "black");
    var parent = d3.select(this).node().parentNode.__data__;
    tooltip
        .style("display", null)
        .html("<p>" + parent.key + ": " + (d[1]-d[0]) + " </p>");
}

function mousemoveBar(d){
    tooltip
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");
}

function mouseoutBar(d){
    d3.select(this)
       .transition()
       .style("stroke", "none");

     tooltip.style("display", "none");
}

svg1.append("g")
.call(xAxis);

// svg1.append("g")
//     .call(yAxis);

svg1.append("g")
    .call(legend);

svg1.append("g")
    .call(yTags);

svg1.append("text")
.attr("x", 15)
.attr("y", 28)
.attr("text-anchor", "start")
.attr("font-size", "18")
.attr("font-family", "open sans")
.text("3.Teaching Method");
}
