const svg = d3.select("svg"),
    width = +window.innerWidth,
    height = +window.innerHeight - 100; // Adjusting for title and description

svg.attr("width", width).attr("height", height);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("data.json").then(graph => {
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", d => color(d.fields[0])) // Use the first field for color
        .on("click", (event, d) => highlightAndHideOthers(d))
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.id + "<br/> Group: " + d.fields.join(", ")) // Display all fields
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", (event, d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const label = svg.append("g")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(d => d.name) // Use the name property
        .attr("dx", 12)
        .attr("dy", 4)
        .style("font-size", "10px");

    simulation.nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label.attr("x", d => d.x)
            .attr("y", d => d.y);
    }

    function highlightAndHideOthers(selectedNode) {
        const connectedNodes = new Set([selectedNode.id]);
        graph.links.forEach(link => {
            if (link.source.id === selectedNode.id) {
                connectedNodes.add(link.target.id);
            } else if (link.target.id === selectedNode.id) {
                connectedNodes.add(link.source.id);
            }
        });

        node.style("display", d => connectedNodes.has(d.id) ? "inline" : "none");
        link.style("display", d => connectedNodes.has(d.source.id) && connectedNodes.has(d.target.id) ? "inline" : "none");
        label.style("display", d => connectedNodes.has(d.id) ? "inline" : "none");
    }

    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 150) + ",30)")
        .selectAll("g")
        .data(color.domain())
        .enter().append("g")
        .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");

    legend.append("circle")
        .attr("r", 5)
        .attr("fill", color);

    legend.append("text")
        .attr("x", 10)
        .attr("dy", "0.35em")
        .text(d => d);

    // Click on empty space to reset view
    svg.on("click", () => {
        node.style("display", "inline");
        link.style("display", "inline");
        label.style("display", "inline");
    });
});

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
