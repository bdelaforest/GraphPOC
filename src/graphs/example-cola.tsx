import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import * as cola from "webcola";

import { Data } from "../index";

const Wrapper = styled.div`
  #linkArrow {
    stroke: #96a5f5;
    stroke-width: 2px;
  }

  .node {
    stroke: #fff;
    stroke-width: 1.5px;
    cursor: move;
  }

  .link {
    stroke: #96a5f5;
    stroke-width: 2px;
    /* TEMP */
    stroke-opacity: 0.8;

    &.link--control {
      marker-start: url(#linkArrow);
    }

    &.link--economic {
      stroke-dasharray: 8, 4;
      marker-start: url(#linkArrow);
    }

    &.link--other {
      stroke-dasharray: 2, 4;
    }
  }

  .label {
    fill: white;
    font-family: Verdana;
    font-size: 16px;
    font-weight: 400;
    text-anchor: middle;
    cursor: move;
  }
`;

type Props = {
  data: Data;
  width: number;
  height: number;
};

// const COMPANY_NODE_SIZE = 15;
// const PERSON_NODE_SIZE = 10;

const color = d3.scaleOrdinal(d3.schemeCategory10);

const prepareData = data => {
  const { nodes: initialNodes, relationships: initialLinks } = data;

  const links = initialLinks.reduce((acc, link) => {
    const source = initialNodes.findIndex(n => n.id === link.fromNode);
    const target = initialNodes.findIndex(n => n.id === link.toNode);

    return source !== -1 && target !== -1
      ? [...acc, { ...link, source, target }]
      : acc;
  }, []);

  const nodes = initialNodes.map(node => {
    const label = node.siren ? node.name : node.firstName[0] + node.lastName[0];

    return {
      ...node,
      label,
      width: Math.max(label.length * 10, 30) + 20,
      height: 40
    };
  });

  return { nodes, links };
};

const Example = ({ data, width, height }: Props) => {
  const { nodes, links } = prepareData(data);
  const graphRef = useRef(null);

  useEffect(() => {
    const graph = cola
      .d3adaptor(d3)
      .linkDistance(120)
      .avoidOverlaps(true)
      .size([width, height]);

    const svg = d3
      .select(graphRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // svg
    //   .append("defs")
    //   .append("marker")
    //   .attr("id", "linkArrow")
    //   .attr("viewBox", "0 0 12 12")
    //   .attr("refX", -60)
    //   .attr("refY", 6)
    //   .attr("orient", "auto")
    //   .attr("markerWidth", 6)
    //   .attr("markerHeight", 6)
    //   .attr("xoverflow", "visible")
    //   .append("svg:path")
    //   .attr("d", "M 6 2, L 12 10, L 0 12, z")
    //   .attr("fill", "none")
    //   .attr("stroke", "red")
    //   .attr("stroke-width", "px");
    // // .attr("stroke-location", "none")
    // // .attr("stroke-width", "2px")
    // // .attr("fill", "green");

    // <marker id="triangle" viewBox="0 0 10 10"
    //       refX="1" refY="5"
    //       markerUnits="strokeWidth"
    //       markerWidth="10" markerHeight="10"
    //       orient="auto">
    //   <path d="M 0 0 L 10 5 L 0 10 z" fill="#f00"/>
    // </marker>

    // svg
    //   .append("defs")
    //   .append("marker")
    //   .attr("id", "linkArrow")
    //   .attr("viewBox", "0 0 10 10")
    //   .attr("refX", "1")
    //   .attr("refY", "5")
    //   .attr("markerWidth", "10")
    //   .attr("markerHeight", "10")
    //   .attr("orient", "auto")
    //   .append("path")
    //   .attr("d", "M 0 0 L 10 5 L 0 10 z")
    //   .attr("stroke", "red")
    //   .attr("stroke-width", "2px")
    //   .attr("fill", "white");

    svg
      .append("defs")
      .append("marker")
      .attr("id", "linkArrow")
      .attr("viewBox", "0 0 8 12")
      .attr("refX", "-60")
      .attr("refY", "6")
      .attr("markerWidth", "4")
      .attr("markerHeight", "6")
      .attr("orient", "auto")
      .attr("overflow", "visible")
      .append("polygon")
      .attr("points", "0,0 8,6 0,12")
      .attr("fill", "white");

    graph
      .nodes(nodes)
      .links(links)
      .start();

    const node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("class", "node")
      .attr("width", d => d.width)
      .attr("height", d => d.height)
      .attr("rx", 20)
      .attr("ry", 20)
      .style("fill", () => color(1))
      .call(graph.drag);

    // const linkLine = svg
    //   .selectAll(".link")
    //   .data(links)
    //   .enter()
    //   .append("line")
    //   .attr("class", d => `link link--${d.type.toLowerCase()}`)
    //   .attr("marker-end", "url(#arrow)")
    //   .call(graph.drag);

    const link = svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", d => `link link--${d.type.toLowerCase()}`)
      // .attr("marker-end", "url(#arrow)")
      // .attr("d")
      .call(graph.drag);

    const label = svg
      .selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .text(d => d.label)
      .call(graph.drag);

    graph.on("tick", function() {
      node.attr("x", d => d.x - d.width / 2).attr("y", d => d.y - d.height / 2);

      link.attr(
        "d",
        ({ source, target }) =>
          `M ${source.x} ${source.y},
           L ${target.x} ${target.y},
           m ${(source.x + target.x) / 2} ${(source.y + target.y) / 2}`
      );
      // link
      //   .attr("x1", d => d.source.x)
      //   .attr("y1", d => d.source.y)
      //   .attr("x2", d => d.target.x)
      //   .attr("y2", d => d.target.y);

      label
        .attr("x", d => d.x)
        .attr("y", function(d) {
          var h = this.getBBox().height;
          console.log({ getBBox: this.getBBox() });
          return d.y + h / 4;
        });
    });
  }, []);

  return (
    <>
      <h3>webcola + d3</h3>
      <Wrapper ref={graphRef} style={{ width, height, border: "1px solid" }} />
    </>
  );
};

export default Example;
