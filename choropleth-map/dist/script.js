async function fetchData() {
  var url_educationData =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
  var url_countiesData =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

  var educationDataResponse = await fetch(url_educationData);
  var educationData = await educationDataResponse.json();
  // console.log('A')
  var countiesDataResponse = await fetch(url_countiesData);
  var countiesData = await countiesDataResponse.json();
  // console.log('B')
  doStuff(educationData, countiesData);
}
fetchData();

function doStuff(educationData, countiesData) {
  // console.log('C')
  console.log(educationData);
  console.log(countiesData);

  // The geographic path generator, d3.geoPath, is similar to the shape generators in d3-shape: given a GeoJSON geometry or
  // feature object, it generates an SVG path data string or renders the path to a Canvas. Canvas is recommended for dynamic
  // or interactive projections to improve performance. Paths can be used with projections or transforms, or they can be
  // used to render planar geometry directly to Canvas or SVG.
  // info @ https://github.com/d3/d3-geo
  var path = d3.geoPath();

  // info @ https://github.com/topojson/topojson
  var countiesData2 = topojson.feature(
  countiesData,
  countiesData.objects.counties).
  features;

  console.log(countiesData2);

  var w = 1000,
  h = 600;
  var m = { top: 50, left: 75, bottom: 50, right: 50 };

  var innerH = h - m.top - m.bottom;
  var innerW = w - m.right - m.left;

  var minEducationData = d3.min(educationData, function (d) {
    return d.bachelorsOrHigher;
  });
  var maxEducationData = d3.max(educationData, function (d) {
    return d.bachelorsOrHigher;
  });
  console.log(
  "minEducationData: " + minEducationData + " is a " + typeof minEducationData);

  console.log("maxEducationData: " + maxEducationData);

  //color
  //info @ https://github.com/d3/d3-scale-chromatic
  var colorScale = d3.
  scaleOrdinal().
  domain([minEducationData, maxEducationData]).
  range(d3.schemeGreens[9]);

  var svg = d3.
  select("main").
  append("svg").
  attr("width", w).
  attr("height", h).
  style("fill", "#0984e3")
  //css
  .style("background", "#dfe6e9").
  style("border-radius", "2%").
  style("padding-top", "20px").
  style("border", "4px solid black").
  style("box-shadow", "10px 10px 25px rgb(44, 57, 58)");

  svg.
  append("g").
  selectAll("path").
  data(countiesData2).
  enter().
  append("path").
  attr("d", path).
  attr("data-fips", function (d) {
    return d.id;
  })
  //attributes
  .attr("data-education", function (d) {
    return educationData.find(
    element => element.fips === d.id).
    bachelorsOrHigher;
  }).
  attr("data-area", function (d) {
    return educationData.find(element => element.fips === d.id).area_name;
  }).
  attr("data-state", function (d) {
    return educationData.find(element => element.fips === d.id).state;
  }).
  attr("class", "county").
  style("fill", function (d) {
    return colorScale(
    educationData.find(element => element.fips === d.id).bachelorsOrHigher);

  }).
  style("opacity", "75%").
  attr("transform", "translate(25, 0)")
  //tooltip
  .on("mouseover", function (d, i) {
    //d is the event object in this case, not the dataset
    //grab date, value by ref the attributes
    //Create the tooltip label

    //var temp_education = educationData.find(element => element.fips === d.id).bachelorsOrHigher;
    //var temp_area = educationData.find(element => element.fips === d.id).area_name;
    //var temp_state = educationData.find(element => element.fips === d.id).state;

    svg.
    append("text").
    attr("id", "tooltip")
    //.attr("x", event.pageX - 250)
    //.attr("y", event.pageY - 50)
    .attr("x", 500).
    attr("y", 25).
    attr("font-size", "12px").
    attr("font-weight", "bold").
    style("fill", "black").
    attr("data-education", d3.select(this).attr("data-education")).
    text(
    "AREA: " +
    d3.select(this).attr("data-area") +
    " | STATE: " +
    d3.select(this).attr("data-state") +
    " | EDUCATION: " +
    d3.select(this).attr("data-education"));

  }) //on mouseover
  .on("mouseout", function () {
    //Remove the tooltip
    d3.select("#tooltip").remove();
  }); //on mouseout

  var legendContainer = svg.
  append("g").
  attr("id", "legend").
  style("opacity", "75%");
  legendContainer.
  append("rect").
  attr("width", 20).
  attr("height", 20).
  attr("x", m.left + 500).
  attr("y", 15 + 530).
  style("fill", colorScale(minEducationData)).
  attr("id", "legendRect");
  legendContainer.
  append("rect").
  attr("width", 20).
  attr("height", 20).
  attr("x", m.left + 22 + 500).
  attr("y", 15 + 530).
  style("fill", colorScale(maxEducationData * 0.33)).
  attr("id", "legendRect");
  legendContainer.
  append("rect").
  attr("width", 20).
  attr("height", 20).
  attr("x", m.left + 44 + 500).
  attr("y", 15 + 530).
  style("fill", colorScale(maxEducationData * 0.66)).
  attr("id", "legendRect");
  legendContainer.
  append("rect").
  attr("width", 20).
  attr("height", 20).
  attr("x", m.left + 66 + 500).
  attr("y", 15 + 530).
  style("fill", colorScale(maxEducationData * 0.99)).
  attr("id", "legendRect");

  legendContainer.
  append("text").
  attr("x", m.left - 25 + 500).
  attr("y", 30 + 530).
  text(minEducationData).
  attr("font-size", "10px").
  style("fill", "#000000").
  attr("font-weight", "bold");

  legendContainer.
  append("text").
  attr("x", m.left + 90 + 500).
  attr("y", 30 + 530).
  text("+" + maxEducationData).
  attr("font-size", "10px").
  style("fill", "#000000").
  attr("font-weight", "bold");

  var axisLabels = svg.append("g");
  axisLabels.
  append("text").
  attr("x", -550).
  attr("y", 15).
  attr("transform", "rotate(-90)").
  text(
  "https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx").

  style("font-size", "11px").
  style("font-weight", "bold").
  style("fill", "black");
} //doStuff