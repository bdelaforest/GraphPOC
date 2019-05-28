import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import cloneDeep from "lodash/cloneDeep";

import { Data } from "../index";

const GraphWrapper = styled.div`
  border: 1px solid;
`;

type Props = {
  data: Data;
  width: number;
  height: number;
};

const COMPANY_NODE_SIZE = 15;
const PERSON_NODE_SIZE = 10;

// const color = d3.scaleOrdinal(d3.schemeCategory10);

const drag = simulation => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

const Example = ({ data, width, height }: Props) => {
  const graphRef = useRef(null);

  // const { nodes, relationships } = data;
  const { nodes, relationships } = cloneDeep(data);
  let links = relationships.map(d => ({
    ...d,
    source: d.fromNode,
    target: d.toNode
  }));
  // console.log(links);
  useEffect(() => {
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody()) //.strength(-500))
      .force(
        "link",
        d3.forceLink(links).id(d => d.id)
        // .distance(100)
      )
      .force("plop", d3.forceCollide(COMPANY_NODE_SIZE * 2))
      // .force("center", d3.forceCenter(width / 2, height / 2))
      .force("center", d3.forceRadial(100, width / 2, height / 2))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .alphaDecay(0.2);
    // .alphaTarget(1);
    // .velocityDecay(0.99);
    // .on("tick", ticked);

    const svg = d3
      .select(graphRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999");

    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("d", d => 30)
      .style("stroke-dasharray", d => (d.type === "OTHER" ? "3, 3" : null))
      .style("stroke", "#999")
      .style("stroke-opacity", 0.6)
      .style("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    // .call(function(link) {link.transition().attr("stroke-opacity", 1);})
    // 	.call(function(link) {link.transition().attr("d", linkArc)})
    // 	.call(function(link) {link.transition().attr('stroke', function(d){return color(d.T);})})

    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", d => (!!d.siren ? COMPANY_NODE_SIZE : PERSON_NODE_SIZE))
      .style("fill", d => (!!d.siren ? "red" : "green"))
      .call(drag(simulation));
    // .call(
    //   d3
    //     .drag()
    //     .on("start", d => {
    //       if (!d3.event.active) simulation.alphaTarget(0.3);
    //       // else console.log(d3.event.active);
    //       d.fx = d.x;
    //       d.fy = d.y;
    //     })
    //     .on("drag", d => {
    //       d.fx = d3.event.x;
    //       d.fy = d3.event.y;
    //     })
    //     .on("end", d => {
    //       // if (!d3.event.active) simulation.alphaTarget(0);
    //       d.fx = null;
    //       d.fy = null;
    //     })
    // );
    // .style("stroke", "#FFF")
    // .style("stroke-width", 1.5)

    node.exit().remove();

    simulation.on("tick", () => {
      node.attr("cx", d => d.x).attr("cy", d => d.y);
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    });

    // console.log("simulation", Object.keys(simulation));
    // console.log("simulation", simulation);
  }, []);

  return (
    <>
      <h3>d3-force-layout + d3</h3>
      <GraphWrapper ref={graphRef} style={{ width, height }} />
    </>
  );
};

export default Example;
