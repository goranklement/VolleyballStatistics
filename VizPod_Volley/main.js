for (let i = players.length - 1; i >= 0; i--) {
  if (players[i].Total_attempts < 350) {
    players.splice(i, 1);
  }
}

var element = document.getElementById("dropdown-1");
for (let i = 0; i < 27; i++) {
  let item = document.createElement("li");
  item.textContent = players[i].Name + "\n";
  element.appendChild(item);

  item.addEventListener("click", function onClick() {
    for (let j = 0; j < 27; j++) {
      document.getElementById("dropdown-2").children[j].style.display = "block";
    }
    document.getElementById("dropdown-2").children[i].style.display = "none";

    setPlayer1(players[i].Name);
    d3.select("#svg-1").remove();
    $("#apex1").empty();
    makeChart1(players[i]);
  });
}
var element2 = document.getElementById("dropdown-2");
for (let i = 0; i < 27; i++) {
  let item2 = document.createElement("li");
  item2.textContent = players[i].Name + "\n";
  element2.appendChild(item2);

  item2.addEventListener("click", function onClick() {
    for (let j = 0; j < 27; j++) {
      document.getElementById("dropdown-1").children[j].style.display = "block";
    }
    document.getElementById("dropdown-1").children[i].style.display = "none";
    setPlayer2(players[i].Name);
    d3.select("#svg-2").remove();
    $("#apex2").empty();
    makeChart2(players[i]);
  });
}

function setPlayer1(name) {
  const image = document.getElementById("img-1");
  image.src = "Images/" + name + ".jpg";
  const name_label = document.getElementById("name-1");
  name_label.textContent = name;
}
function setPlayer2(name) {
  const image = document.getElementById("img-2");
  image.src = "Images/" + name + ".jpg";
  const name_label = document.getElementById("name-2");
  name_label.textContent = name;
}

function makeChart1(player) {
  let data = [];
  let features = [
    "AVG points per set",
    "Running sets",
    "Still sets",
    "Faults",
    "Total attempts",
    "Faults per attempt",
  ];

  for (var i = 0; i < 1; i++) {
    var point = {};
    features.forEach(function () {
      point["AVG points per set"] = player.Average_per_set;
      point["Running sets"] =
        (player.Running_sets / player.Total_attempts) * 10;
      point["Still sets"] = (player.Still_sets / player.Total_attempts) * 10;
      point["Faults"] = player.Faults / 1.7;
      point["Total attempts"] = player.Total_attempts / 123.4;
      point["Faults per attempt"] =
        (player.Faults / player.Total_attempts) * 398;
    });
    data.push(point);
  }
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", 750)

    .attr("height", 750)
    .attr("id", "svg-1");
  let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
  let ticks = [2, 4, 6, 8, 10];
  ticks.forEach((t) =>
    svg
      .append("circle")
      .attr("cx", 350)
      .attr("cy", 350)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("r", radialScale(t))
  );

  function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return { x: 350 + x, y: 350 - y };
  }

  for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];

    let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
    let line_coordinate = angleToCoordinate(angle, 10);
    let label_coordinate = angleToCoordinate(angle, 11.5);

    svg
      .append("line")
      .attr("x1", 350)
      .attr("y1", 350)
      .attr("x2", line_coordinate.x)
      .attr("y2", line_coordinate.y)
      .attr("stroke", "black");

    if (ft_name == "Running sets" || ft_name == "Still sets") {
      svg
        .append("text")
        .attr("x", label_coordinate.x - 72)
        .attr("y", label_coordinate.y)
        .text(ft_name);
    } else {
      svg
        .append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .text(ft_name);
    }
  }
  let line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);
  let colors = ["darkorange", "gray", "navy"];
  function getPathCoordinates(data_point) {
    let coordinates = [];
    for (var i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
  }
  for (var i = 0; i < 1; i++) {
    let d = data[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);
    svg
      .append("path")
      .datum(coordinates)
      .attr("d", line)
      .attr("stroke-width", 3)
      .attr("stroke", color)
      .attr("fill", color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.6);
  }

  svg.on("mouseover", function () {
    for (var i = 0; i < features.length; i++) {
      let ft_name = features[i];
      var length = 4;
      var trimmedString = ((player.Faults / player.Total_attempts) * 100)
        .toString()
        .substring(0, length);
      let values = [
        player.Average_per_set,
        player.Running_sets,
        player.Still_sets,
        player.Faults,
        player.Total_attempts,
        trimmedString + "  %",
      ];

      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      let label_coordinate = angleToCoordinate(angle, 11.5);

      if (ft_name == "Running sets" || ft_name == "Still sets") {
        svg
          .append("text")

          .attr("x", label_coordinate.x - 55)
          .attr("y", label_coordinate.y + 20)
          .text(values[i])
          .style("fill", "darkOrange")
          .style("font-size", "24px");
      } else {
        svg
          .append("text")

          .attr("x", label_coordinate.x)
          .attr("y", label_coordinate.y + 20)
          .text(values[i])
          .style("fill", "darkOrange")
          .style("font-size", "24px");
      }
    }
  });

  var still = ((player.Still_sets / player.Total_attempts) * 100)
    .toString()
    .substring(0, 5);
  var running = ((player.Running_sets / player.Total_attempts) * 100)
    .toString()
    .substring(0, 5);

  var avg = (player.Average_per_set * 11.7233294256).toString().substring(0, 5);

  var options = {
    series: [running, still, player.Average_per_set],
    chart: {
      height: 390,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    colors: ["#c28e4f", "#d1af86", "#fcf4de"],
    labels: ["Running sets %", "Still sets %", "Average points per set"],
    legend: {
      show: true,
      floating: true,
      fontSize: "16px",
      position: "left",
      offsetX: 160,
      offsetY: 15,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0,
      },
      formatter: function (seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        vertical: 3,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  var chart = new ApexCharts(document.querySelector("#apex1"), options);
  chart.render();
}

function makeChart2(player) {
  let data = [];
  let features = [
    "AVG points per set",
    "Running sets",
    "Still sets",
    "Faults",
    "Total attempts",
    "Faults per attempt",
  ];

  for (var i = 0; i < 1; i++) {
    var point = {};
    features.forEach(function () {
      point["AVG points per set"] = player.Average_per_set;
      point["Running sets"] =
        (player.Running_sets / player.Total_attempts) * 10;
      point["Still sets"] = (player.Still_sets / player.Total_attempts) * 10;
      point["Faults"] = player.Faults / 1.7;
      point["Total attempts"] = player.Total_attempts / 123.4;
      point["Faults per attempt"] =
        (player.Faults / player.Total_attempts) * 398;
    });
    data.push(point);
  }
  let svg = d3
    .select("body")
    .append("svg")
    .attr("x", 250)
    .attr("y", 500)
    .attr("width", 750)
    .attr("height", 750)
    .attr("id", "svg-2");
  let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
  let ticks = [2, 4, 6, 8, 10];
  ticks.forEach((t) =>
    svg
      .append("circle")
      .attr("cx", 350)
      .attr("cy", 350)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("r", radialScale(t))
  );

  function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return { x: 350 + x, y: 350 - y };
  }
  for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
    let line_coordinate = angleToCoordinate(angle, 10);
    let label_coordinate = angleToCoordinate(angle, 11.5);

    svg
      .append("line")
      .attr("x1", 350)
      .attr("y1", 350)
      .attr("x2", line_coordinate.x)
      .attr("y2", line_coordinate.y)
      .attr("stroke", "black");

    if (ft_name == "Running sets" || ft_name == "Still sets") {
      svg
        .append("text")
        .attr("x", label_coordinate.x - 72)
        .attr("y", label_coordinate.y)
        .text(ft_name);
    } else {
      svg
        .append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .text(ft_name);
    }
  }
  let line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);
  let colors = ["navy"];
  function getPathCoordinates(data_point) {
    let coordinates = [];
    for (var i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
  }
  for (var i = 0; i < 1; i++) {
    let d = data[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);

    svg
      .append("path")
      .datum(coordinates)
      .attr("d", line)
      .attr("stroke-width", 3)
      .attr("stroke", color)
      .attr("fill", color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.6);
  }

  svg.on("mouseover", function () {
    for (var i = 0; i < features.length; i++) {
      let ft_name = features[i];
      var length = 4;
      var trimmedString = ((player.Faults / player.Total_attempts) * 100)
        .toString()
        .substring(0, length);
      let values = [
        player.Average_per_set,
        player.Running_sets,
        player.Still_sets,
        player.Faults,
        player.Total_attempts,
        trimmedString + "  %",
      ];

      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      let label_coordinate = angleToCoordinate(angle, 11.5);

      if (ft_name == "Running sets" || ft_name == "Still sets") {
        svg
          .append("text")

          .attr("x", label_coordinate.x - 55)
          .attr("y", label_coordinate.y + 20)
          .text(values[i])
          .style("fill", "navy")
          .style("font-size", "24px");
      } else {
        svg
          .append("text")

          .attr("x", label_coordinate.x)
          .attr("y", label_coordinate.y + 20)
          .text(values[i])
          .style("fill", "navy")
          .style("font-size", "24px");
      }
    }
  });

  var still = ((player.Still_sets / player.Total_attempts) * 100)
    .toString()
    .substring(0, 5);
  var running = ((player.Running_sets / player.Total_attempts) * 100)
    .toString()
    .substring(0, 5);

  var avg = (player.Average_per_set * 11.7233294256).toString().substring(0, 5);

  var options = {
    series: [running, still, player.Average_per_set],
    chart: {
      height: 390,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    colors: ["#313199", "#7d82ba", "#bec9ed"],
    labels: ["Running sets %", "Still sets %", "Average points per set"],
    legend: {
      show: true,
      floating: true,
      fontSize: "16px",
      position: "left",
      offsetX: 160,
      offsetY: 15,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0,
      },
      formatter: function (seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        vertical: 3,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  var chart = new ApexCharts(document.querySelector("#apex2"), options);
  chart.render();
}
