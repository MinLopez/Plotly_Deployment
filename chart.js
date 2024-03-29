function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data)
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample);
    
        //  5. Create a variable that holds the first sample in the array.
    var firstSample = resultSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids.map(numIds => numIds);
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;
  

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(numeIds => {return 'OTU ' +  numeIds}).reverse();

    // 8. Create the trace for the bar chart. 
    
    var barTrace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      name: "Top 10 Samples",
      type: "bar",
      orientation: "h"
    }

    var barData = [barTrace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    
        var barTrace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      name: "Top 10 Samples",
      type: "bar",
      orientation: "h"
    }

    var barData = [barTrace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
     
    };
    
    
    Plotly.newPlot("bar", barData, barLayout);
  //});
//}


// Bubble charts


    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    }
    
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false,
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      hovermode: "closest",
      hover_text: sample_values
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


  // Gauge charts
  // Create the buildCharts function.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugemetadata = data.metadata;
    // 2. Create a variable that holds the first sample in the metadata array.
    var resultGauge= gaugemetadata.filter(sampleObj => sampleObj.id == sample)
    var firstGauge = resultGauge[0]
    // 3. Create a variable that holds the washing frequency.
    var washfreq = parseFloat(firstGauge.wfreq);
    // 4. Create the trace for the gauge chart.
    var gaugeTrace = {
      domain: { 
        x: [0, 1], 
        y: [0, 1] 
      },
      value: washfreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {color:"black"},
        axis: { range: [null, 10], dtick: 2, tickcolor: 'black' },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" }]
        }}

    var gaugeData = [gaugeTrace];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: {
         t: 0,
         b: 0 
        } 
      };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData, gaugeLayout);
      });
    }

