function init () {
    d3.json("samples.json").then((data) => {
        data.metadata.forEach(demo => {
            if (String(demo.id) === "940") {
                var demographic = d3.select(".panel-body");
                demographic.selectAll("p").remove();
                Object.entries(demo).forEach(([key,value]) => {
                    demographic.append("p").text(`${key}: ${value}`);
                })
            }
        })
        
        data.samples.forEach(set => {
            if (String(set.id) === "940") {
                var sample_values = set.sample_values;
                var otu_ids = set.otu_ids;
                var otu_labels = set.otu_labels;
                var bubbleData = [{
                    x:otu_ids,
                    y:sample_values,
                    text: otu_labels,
                    mode:'markers',
                    marker: {
                        size:sample_values
                    }
                }]

                Plotly.newPlot("bubble", bubbleData)

                var newIds = [];

                otu_ids.forEach(id => {
                    newIds.push("OTU " + String(id));
                })

                var barData = [{
                    x:sample_values.slice(0,10).reverse(),
                    y:newIds.slice(0,10).reverse(),
                    text: otu_labels.slice(0,10).reverse(),
                    type: "bar",
                    orientation: "h"
                }]

                Plotly.newPlot("bar", barData)
            }
        })

        var dropDown = d3.select("#selDataset");
        data.names.forEach(person => {
            dropDown.append("option").text(person).attr(person);
        })
    });
}

d3.selectAll("#selDataset").on("change", newPerson);

function newPerson() {
    d3.event.preventDefault();
    
    var dropDown = d3.select("#selDataset");
    var dataset = dropDown.property("value");

    d3.json("samples.json").then((data) => {
        data.metadata.forEach(demo => {
            if (String(demo.id) === dataset) {
                var demographic = d3.select(".panel-body");
                demographic.selectAll("p").remove();
                Object.entries(demo).forEach(([key,value]) => {
                    demographic.append("p").text(`${key}: ${value}`);
                })
            }
        })
        
        data.samples.forEach(set => {
            if (String(set.id) === dataset) {
                var sample_values = set.sample_values;
                var otu_ids = set.otu_ids;
                var otu_labels = set.otu_labels;

                updatePlot(sample_values, otu_ids, otu_labels);
            }
        })
    });

}

function updatePlot(sample_values, otu_ids, otu_labels) {
    
    var tenSamples = sample_values.slice(0,10).reverse();
    var tenIds = otu_ids.slice(0,10).reverse();
    var tenLabels = otu_labels.slice(0,10).reverse();

    var newIds = [];

    tenIds.forEach(id => {
        newIds.push("OTU " + String(id));
    })

    Plotly.restyle("bar", "x", [tenSamples]);
    Plotly.restyle("bar", "y", [newIds]);
    Plotly.restyle("bar", "text", [tenLabels]);

    Plotly.restyle("bubble", "x", [otu_ids]);
    Plotly.restyle("bubble", "y", [sample_values]);
    Plotly.restyle("bubble", "text", [otu_labels]);
    Plotly.restyle("bubble", "marker.size", [sample_values]);
}

init();