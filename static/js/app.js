const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to create the horizontal bar chart
function createBarChart(selectedData) {
  // Sort the data by sample_values in descending order
  let sortedByValues = selectedData.sample_values.map((value, index) => ({
    sample_values: value,
    otu_ids: selectedData.otu_ids[index],
    otu_labels: selectedData.otu_labels[index]
  })).sort((a, b) => b.sample_values - a.sample_values);

  // Slice the first 10 objects for plotting
  let slicedData = sortedByValues.slice(0, 10);

  // Reverse the array to accommodate Plotly's defaults
  let reversedData = slicedData.reverse();

  // Trace1 for the Bar Chart
  let trace1 = {
    x: reversedData.map(object => object.sample_values),
    y: reversedData.map(object => `OTU ${object.otu_ids}`),
    text: reversedData.map(object => object.otu_labels),
    name: "OTU Value",
    type: "bar",
    orientation: "h"
  };

  let traceData = [trace1];

  // Apply a title to the layout
  let layout = {
    title: `Top 10 OTUs Found in ${selectedData.id}`,
    margin: {
      l: 70,
      r: 40,
      t: 40,
      b: 40
    }
  };

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", traceData, layout);
}

// Function to create the bubble chart
function createBubbleChart(selectedData) {
  // Trace for the Bubble Chart
  let trace1 = {
    x: selectedData.otu_ids,
    y: selectedData.sample_values,
    text: selectedData.otu_labels,
    mode: 'markers',
    marker: {
      size: selectedData.sample_values,
      color: selectedData.otu_ids,
      colorscale: 'Earth'
    }
  };

  let traceData = [trace1];

  // Apply a title to the layout
  let layout = {
    title: 'Sample OTU IDs vs. Sample Values',
    xaxis: {
      title: 'OTU ID'
    },
    yaxis: {
      title: 'Sample Values'
    },
    showlegend: false
  };

  // Render the plot to the div tag with id "bubble"
  Plotly.newPlot('bubble', traceData, layout);
}

// Function to display sample metadata
function displayMetadata(selectedData) {
  // Select the sample-metadata div
  const metadataDiv = d3.select('#sample-metadata');

  // Clear any existing content
  metadataDiv.html('');

// Iterate through each key-value pair in the metadata object
  Object.entries(selectedData).forEach(([key, value]) => {
    metadataDiv.append('p').text(`${key}: ${value}`);
  });
}

// Function to update all the plots when a new sample is selected
function updatePlot(selectedIndividual) {
  // Fetch the JSON data
  d3.json(url).then(function(data) {
    // Filter the data for the selected individual
    const selectedData = data.samples.filter(sample => sample.id === selectedIndividual)[0];
    createBarChart(selectedData);
    createBubbleChart(selectedData);
    displayMetadata(selectedData);
  });
}

// Function to initialize the dropdown menu and the initial plot
function init() {
  // Fetch the JSON data
  d3.json(url).then(function(data) {
    // Get the names of all individuals
    const individualNames = data.names;

    // Select the dropdown element
    const dropdown = d3.select("#selDataset");

    // Create the dropdown options
    dropdown.selectAll("option")
      .data(individualNames)
      .enter()
      .append("option")
      .text(d => d)
      .property("value", d => d);

    // Get the first individual from the dataset
    const initialIndividual = individualNames[0];

    // Update all the plots with the initial individual
    updatePlot(initialIndividual);

    // Call the updatePlot function whenever a new individual is selected from the dropdown
    dropdown.on("change", function() {
      const selectedIndividual = d3.select(this).property("value");
      updatePlot(selectedIndividual);
    });
  });
}

// Initialize the dropdown menu and the initial plot
init();


