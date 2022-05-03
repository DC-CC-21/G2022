// d3.json('https://raw.githubusercontent.com/plotly/plotly.js/master/test/image/mocks/sankey_energy.json', function(fig){
  var data2 = {
    type: "sankey",
    orientation: "h",
    node: {
      pad: 15,
      thickness: 30,
      line: {
        color: "black",
        width: 1,
      },
      label: ["A1", "A2", "B1", "B2", "C1", "C2"],
      color: ["#0000ff", "#00ff00", "#646464", "#000000", "#ff0000", "#ffff00"],
    },
  
    link: {
      source: [0, 1, 0, 2, 3, 3],
      target: [2, 3, 3, 4, 4, 5],
      value: [8, 4, 2, 8, 4, 2],
      color:["#0000ff32", "#00ff0032", "#64646432", "#00000032", "#ff000032", "#ffff0032"],
   
    },
  };
  var layout2 = {
      // plot_bgcolor:'black',
      // paper_bgcolor:'black',
      title: "",
      font: {
        size: 10,
      },
      width:400,
      height:400,
  };
  function createChart(data, layout){
    var data = [data];
  
  
    // Plotly.react("myDiv", data, layout);
    Plotly.newPlot('myDiv', data, layout)
  }
  
  createChart(data2, layout2)