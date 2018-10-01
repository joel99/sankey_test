const color = () => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  return name => color(name.replace(/ .*/, ""));
}

const format = () => {
  const f = d3.format(",.0f");
  return d => `${f(d)} TWh`;
}

const chart = (width, height, data) => { 
	const svg = d3.select('#chartSvg')
	.attr("width", "900")
	.attr("height", "600");
	
	const {nodes, links} = d3.sankey(data);
  
	svg.append("g")
		.attr("stroke", "#000")
	  .selectAll("rect")
	  .data(nodes)
	  .enter().append("rect")
		.attr("x", d => d.x0)
		.attr("y", d => d.y0)
		.attr("height", d => d.y1 - d.y0)
		.attr("width", d => d.x1 - d.x0)
		.attr("fill", d => color(d.name))
	  .append("title")
		.text(d => `${d.name}\n${format(d.value)}`);
  
	const link = svg.append("g")
		.attr("fill", "none")
		.attr("stroke-opacity", 0.5)
	  .selectAll("g")
	  .data(links)
	  .enter().append("g")
		.style("mix-blend-mode", "multiply");
  
	const gradient = link.append("linearGradient")
		.attr("id", d => (d.uid = DOM.uid("link")).id)
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("x1", d => d.source.x1)
		.attr("x2", d => d.target.x0);
  
	gradient.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", d => color(d.source.name));
  
	gradient.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", d => color(d.target.name));
  
	link.append("path")
		.attr("d", d3.sankeyLinkHorizontal())
		.attr("stroke", d => d.uid)
		.attr("stroke-width", d => Math.max(1, d.width));
  
	link.append("title")
		.text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);
  
	svg.append("g")
		.style("font", "10px sans-serif")
	  .selectAll("text")
	  .data(nodes)
	  .enter().append("text")
		.attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
		.attr("y", d => (d.y1 + d.y0) / 2)
		.attr("dy", "0.35em")
		.attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
		.text(d => d.name);
	
	console.log("all the way here");
	return svg.node();
  }
  /*
const chart = (width, height, data) => {
	const svg = d3.select('svg')
								.attr("width", "900")
								.attr("height", "600");

	const sankey = d3.sankey();
	
	const { nodes, links } = sankey(data);
	console.log(nodes);
	console.log(links);
	
	svg.append("g")
     .attr("stroke", "#000")
		 .selectAll("rect")
		 .data(nodes)
		 .enter().append("rect")
     .attr("x", d => d.x0)
     .attr("y", d => d.y0)
     .attr("height", d => d.y1 - d.y0)
     .attr("width", d => d.x1 - d.x0)
     .attr("fill", d => color(d.name))
		 .append("title")
     .text(d => `${d.name}\n${format(d.value)}`);

	const link = svg.append("g")
		.attr("fill", "#000")
		.attr("stroke", "#000")
		.attr("stroke-opacity", 0.2)
		.selectAll("path")
		.data(links)
		.enter().append("path")
		.attr("d", d3.sankeyLinkHorizontal())
		.attr("stroke-width", function(d) { return d.width; });

	const label = svg.append("g")
		.style("font", "10px sans-serif")
		.selectAll("text")
		.data(nodes)
		.enter().append("text")
		.attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
		.attr("y", d => (d.y1 + d.y0) / 2)
		.attr("dy", "0.35em")
		.attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
		.text(d => d.name);

	return svg.node();

}
*/

const appendChart = () => {
	d3.json("energy.json", (err, data) =>  {
		if (err) {
			console.error(err);
		} else  {
			var chartContainer = d3.select("#chart").node();
			console.log(chartContainer);	
			const width = 964;
			const height = 600;
			const chartNode = chart(width, height, data);
			console.log(chartNode);
			// chartContainer.appendChild(chartNode);
		}
	});
	// const data = {"nodes": [{"name": "test1"}, {"name": "test2"}], "links": [{"source": 0, "target": 1, "value": 10}]};
}

document.addEventListener('DOMContentLoaded', appendChart);
