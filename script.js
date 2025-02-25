// Sélection du conteneur principal
document.body.innerHTML = `<div id='container'></div>`;

// Dimensions du graphique
const width = 800;
const height = 400;
const padding = 50;

// Charger les données
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
d3.json(url).then(data => {
    const dataset = data.data;
    
    // Définition des échelles
    const xScale = d3.scaleTime()
        .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([height - padding, padding]);
    
    // Création du SVG
    const svg = d3.select("#container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Ajouter le titre
    svg.append("text")
        .attr("id", "title")
        .attr("x", width / 2)
        .attr("y", padding / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Données du PIB des États-Unis");
    
    // Ajouter les axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height - padding})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(yAxis);
    
    // Ajouter les barres
    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(new Date(d[0])))
        .attr("y", d => yScale(d[1]))
        .attr("width", (width - 2 * padding) / dataset.length)
        .attr("height", d => height - padding - yScale(d[1]))
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .on("mouseover", function (event, d) {
            tooltip.style("opacity", 0.9)
                .html(`${d[0]}<br>$${d[1]} Billion`)
                .attr("data-date", d[0])
                .style("left", event.pageX + "px")
                .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("opacity", 0);
        });
    
    // Ajouter l'infobulle
    const tooltip = d3.select("#container")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("background", "#333")
        .style("color", "white")
        .style("padding", "5px")
        .style("border-radius", "5px");
});
