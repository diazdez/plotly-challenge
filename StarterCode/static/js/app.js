
// (1): use the D3 library to read in samples.json.

    //fetching the JSON data (using d3 library) and console logging it 
d3.json("samples.json").then(function(data){ 
        console.log(data); 
});
// - d3 allowed me to review in detail the data in the json file
// noted the json file data: metadata, names, samples



// (2): creating a horizontal bar chart with a dropdown menu 
//to display the top 10 OTUs found in that individual

    //start with grabbing data and creating id plots
function getPlot(id) {
    
        // fetching the data from the json file
    d3.json("samples.json").then(function(data) {
        console.log(data)

        //filter sample values by id 
        var allSamples = data.samples.filter(function(samplesdata) {
            return samplesdata.id === id;
        });
        var samples = allSamples[0]
        console.log(samples); 

        
        // var samples = data.samples.filter(samplesData => samplesData.id === id)[0];

        // get the 10 sample values to plot and reverse for the plotly
        var sampleValues = samples.sample_values.slice(0, 10).reverse();

        // get only top 10 otu IDs for the plot
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        var idOtu = idValues.map(function(datavalue) {
            return "OTU" + datavalue
        })

        // console.log(`OTU IDS: ${idOtu}`)
        
        // get the 10 LABELS for the plot
        var labels = samples.otu_labels.slice(0, 10);

        console.log(`Sample Values: ${sampleValues}`)
        console.log(`Id Values: ${idValues}`)


        // create trace variable for the plot
        var trace1 = {
            x: sampleValues,
            y: idOtu,
            type:"bar",
            orientation: "h",
        };

        // create data variable
        var data1 = [trace1];

        // create layout variable to set layout
        var layout1 = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data1, layout1);

//(3): Create a bubble chart  

        //creating the trace for buble
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            }
        };

        // set the layout for the bubble plot
        var layout2 = {
            xaxis:{title: "OTU ID"},

        };

        // create the data variable 
        var data2 = [trace2];

        // create the bubble plot
        Plotly.newPlot("bubble", data2, layout2); 

    });    
}

//(4): Display the sample metadata

// create the function to get info: 
function getInfo(idstring) {
    // unary operator to get data as a string
    var id = +idstring

    // read the json file to get data
    d3.json("samples.json").then(function(data){
        
        // get the metadata info 
        var metadata = data.metadata;
        console.log(id, metadata)

        // filter metadata info by id 
        var resultList = metadata.filter(function(meta){
            return meta.id === id 
        })
        var result = resultList[0]
        console.log(result)

        // var result = metadata.filter(meta => meta.id === id)[0];
        var demographicInfo = d3.select("#sample-metadata");

        // clear the demographic info 
        demographicInfo.html("");

        // tutor provided some guidance: 
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// (6): Update all of the plots any time that a new sample is selected.

//  function for change event
function optionChanged(id) {
    getPlot(id);
    getInfo(idstring);
}

// function for the initial data rendering
function init() {
    // select dropdown menu 
    // html: select id="selDataset" 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then(function(data){ 
        console.log(data); 

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();


// OPTIONAL: 
// Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/ 
// to plot the weekly washing frequency of the individual.
// ??? will need to use plotGaugeChart function to initialize the gauge chart 
