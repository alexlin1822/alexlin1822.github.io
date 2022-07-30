const height = 780,
  width = 1500,
  margin = 50;

//Setting svg
let svg;

let minYear = 1960;
let maxYear = 2021;

//Prepare the data
var ArrayObj = [];
var newdata = [];

var minX;
var maxX;
var minY;
var maxY;
let xScale;
let yScale;

//Initial Select boxes
let dropDown1 = document.getElementById("s1");
for (let i = 1960; i < 2022; i++) {
  let textnode = document.createTextNode(i);
  let options = document.createElement("option");
  options.appendChild(textnode);
  dropDown1.appendChild(options);
}

let dropDown2 = document.getElementById("s2");
for (let i = 1960; i < 2022; i++) {
  let textnode = document.createTextNode(i);
  let options = document.createElement("option");
  options.appendChild(textnode);
  dropDown2.appendChild(options);
}

dropDown1.selectedIndex = "0";
dropDown2.selectedIndex = "61";

// Define a div for the tooltip
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Drawing X and Y Axis
function drawXYAxis() {
  //Background
  svg
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#fbfbfb");

  // Create X Axis
  let x = d3.axisBottom(xScale).tickFormat(d3.format("y"));

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", function () {
      return `translate(${margin}, ${height - margin})`;
    })
    .call(x);

  // Create Y Axis
  let y = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", function () {
      //return `translate(${margin}, ${ margin })`
      return `translate(${margin}, ${margin})`;
    })
    .call(y);

  //Axis Label
  const xLabel = svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 5)
    .attr("fill", "#000000")
    .style("text-anchor", "end")
    .text("Year");

  const yLabel = svg
    .append("text")
    .attr("x", 50)
    .attr("y", 40)
    .attr("fill", "#000000")
    .style("text-anchor", "end")
    .text("(Billion)");
}

// Drawing grid
function drawGrid() {
  //Draw Y lines
  d3.selectAll(".y-axis .tick")
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width - margin * 2 - 100)
    .attr("y2", 0)
    .attr("stroke", "#f5e5f5");

  //Draw X lines
  d3.selectAll(".x-axis .tick")
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", -height + margin * 2)
    .attr("stroke", "#f5e5f5");
}

//Drawing line function
function drawOneLine(data, id) {
  //d3.line path
  let line = d3
    .line()
    .curve(d3.curveCardinal)
    .x(function (d) {
      return xScale(d.theYear);
    })
    .y(function (d) {
      return yScale(d.y);
    });

  //Draw line
  svg
    .append("g")
    .selectAll("path.path")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "path")
    .attr("d", function (d) {
      return line(d);
    })
    .attr("stroke", sourceData[0][id].color)
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("transform", `translate(${margin}, ${margin})`)
    .style("stroke-dasharray", function () {
      return d3.select(this).node().getTotalLength();
    })
    .style("stroke-dashoffset", function () {
      return d3.select(this).node().getTotalLength();
    })
    .transition()
    .duration(3000 + id * 400)
    .delay(10)
    .ease(d3.easeLinear)
    .style("stroke-dashoffset", 0);

  //Draw point
  data.forEach((item) => {
    svg
      .append("g")
      .selectAll(".circle")
      .data(item)
      .attr("class", "circle")
      .enter()
      .append("circle")
      .attr("r", 4)
      .attr("cx", function (d) {
        return xScale(d.theYear);
      })
      .attr("cy", function (d) {
        return yScale(d.y);
      })
      .attr("stroke", sourceData[0][id].color)
      .attr("fill", "#FFFFFF")
      .attr("transform", `translate(${margin}, ${margin})`)
      .on("mouseover", function (d) {
        div.transition().duration(150).style("opacity", 0.9);
        div
          .html(
            sourceData[0][id].name +
              "<br/>" +
              "Year: " +
              d.theYear +
              "<br/>" +
              "GDP: " +
              d.y +
              " Billion"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        div.transition().duration(600).style("opacity", 0);
      });
  });
}

//Draw legend
function drawLegend() {
  let data = sourceData[0];
  var legend = svg
    .selectAll(".legend")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(-10," + (i * 20 + 30) + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 25)
    .attr("y", 8)
    .attr("width", 40)
    .attr("height", 3)
    .style("fill", function (d) {
      return d.color;
    });

  legend
    .append("text")
    .attr("x", width - 30)
    .attr("y", 15)
    .style("text-anchor", "end")
    .text(function (d) {
      return d.name;
    });
}

function drawAnnotations() {
  const annotations1 = [
    // 1970
    {
      note: {
        label: "Uneven economic growth",
        title: "Stagflation in the 1970s",
        wrap: 150,
        padding: 2,
      },
      color: ["#1b6ef5"],
      x: xScale(1970) + 45,
      y: yScale(1500),
      dy: 0,
      dx: -10,
      subject: {
        width: 10,
        height: 730 - yScale(1500),
      },
      type: d3.annotationCalloutRect,
    },
  ];

  const annotations2 = [
    // 1997
    {
      note: {
        label: "Gripped of E.&SE.Asia",
        title: "1997 Asian financial crisis",
        wrap: 150,
        padding: 2,
      },
      color: ["#1fad0c"],
      x: xScale(1997) + 45,
      y: yScale(9000),
      dy: 0,
      dx: -10,
      subject: {
        width: 10,
        height: 730 - yScale(9000),
      },
      type: d3.annotationCalloutRect,
    },
  ];

  const annotations3 = [
    // 2008
    {
      note: {
        label: "Contributed to the global financial crisis",
        title: "2008 The U.S. subprime mortgage crisis",
        wrap: 150,
        padding: 2,
      },
      color: ["#448ead"],
      x: xScale(2008) + 45,
      y: yScale(16000),
      dy: 0,
      dx: -10,
      subject: {
        width: 10,
        height: 730 - yScale(16000),
      },
      type: d3.annotationCalloutRect,
    },
  ];

  const annotations4 = [
    // 2020 COVID
    {
      note: {
        label: "Global economic growth slows",
        title: "CovID-19 Pandemic in 2020",
        wrap: 300,
        padding: 2,
      },
      color: ["#f57cf7"],
      x: xScale(2020) + 45,
      y: yScale(20894),
      dy: -5,
      dx: -10,
      subject: {
        width: 10,
        height: 730 - yScale(20894),
      },
      type: d3.annotationCalloutRect,
    },
  ];

  annotations1[0].dx = annotations1[0].x > 190 ? -10 : 12;
  annotations2[0].dx = annotations2[0].x > 190 ? -10 : 12;
  annotations3[0].dx = annotations3[0].x > 190 ? -10 : 12;
  annotations4[0].dx = annotations4[0].x > 300 ? -10 : 12;

  if ((minYear <= 1970) & (maxYear >= 1970)) {
    const makeAnnotations1 = d3.annotation().annotations(annotations1);
    svg.append("g").call(makeAnnotations1);
  }
  if ((minYear <= 1997) & (maxYear >= 1997)) {
    const makeAnnotations2 = d3.annotation().annotations(annotations2);
    svg.append("g").call(makeAnnotations2);
  }
  if ((minYear <= 2008) & (maxYear >= 2008)) {
    const makeAnnotations3 = d3.annotation().annotations(annotations3);
    svg.append("g").call(makeAnnotations3);
  }

  if ((minYear <= 2020) & (maxYear >= 2020)) {
    const makeAnnotations4 = d3.annotation().annotations(annotations4);
    svg.append("g").call(makeAnnotations4);
  }
}

// Draw chart
async function reDraw(minYear, maxYear) {
  //Getting svg
  svg = d3
    .select("#mydiv")
    .append("svg")
    .attr("id", "mysvg")
    .style("font-size", 12)
    .attr("width", width)
    .attr("height", height);

  //Prepare the data
  for (let i = 0; i < sourceData[0].length; i++) {
    let newdata1 = [];
    ArrayObj = [];

    sourceData[i + 1][0].forEach((item) => {
      if (item.theYear >= minYear && item.theYear <= maxYear) {
        newdata1.push(item);
      }
    });

    ArrayObj[0] = newdata1;

    if (i == 0) {
      minX = d3.min(ArrayObj[0], function (d) {
        return d.theYear;
      });
      maxX = d3.max(ArrayObj[0], function (d) {
        return d.theYear;
      });
      minY = d3.min(ArrayObj[0], function (d) {
        return d.y;
      });
      maxY = d3.max(ArrayObj[0], function (d) {
        return d.y;
      });

      yScale = d3
        .scaleLinear()
        .domain([maxY + maxY / 10, 0])
        .range([0, height - margin * 2]);
      xScale = d3
        .scaleTime()
        .domain([minX, maxX])
        .range([0, width - margin * 2 - 100]);

      await drawXYAxis();
      await drawGrid();
      await drawLegend();
      await drawAnnotations();
    }
    await drawOneLine(ArrayObj, i);
  }
}

//user want to redraw
function btnClick() {
  minYear = document.getElementById("s1").value;
  maxYear = document.getElementById("s2").value;

  if (maxYear > minYear) {
    d3.select("#mysvg").remove();
    reDraw(minYear, maxYear);
  } else {
    alert(
      "The end year must greater than the start year. Please select again!"
    );
  }
}

// Main run
reDraw(minYear, maxYear);
