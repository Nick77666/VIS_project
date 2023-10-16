const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const color = d3.scaleOrdinal(d3.schemeCategory10);

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.name).distance(100))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.json("data.json").then(graph => {
    const link = svg.append("g")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");


    const node = svg.append("g")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", d => color(d.fields[0]))
        .on("click", (event, d) => highlightAndHideOthers(d))
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.name + "<br/> Group: " + d.fields.join(", "))
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
        .text(d => d.name)
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
    svg.on("dblclick", resetHighlight);
    function highlightAndHideOthers(selectedNode) {
        const connectedNodes = new Set([selectedNode.name]);
        graph.links.forEach(link => {
            if (link.source.name === selectedNode.name) {
                connectedNodes.add(link.target.name);
            } else if (link.target.name === selectedNode.name) {
                connectedNodes.add(link.source.name);
            }
        });

        node.style("opacity", d => connectedNodes.has(d.name) ? 1 : 0.05);
        link.style("opacity", d => connectedNodes.has(d.source.name) && connectedNodes.has(d.target.name) ? 1 : 0.05);
        label.style("opacity", d => connectedNodes.has(d.name) ? 1 : 0.05);
    }
    function resetHighlight(){
        node.style("opacity", 1);
        link.style("opacity", 1);
        label.style("opacity", 1);
    }
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
