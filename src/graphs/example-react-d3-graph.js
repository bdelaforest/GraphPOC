import React from "react";
import { Graph } from "react-d3-graph";

import { CompanyNode, PersonNode } from "./_styled";

const colorForNode = node => {
  return node.siren ? "blue" : "green";
};

const shapeForNode = node => {
  return node.siren ? "circle" : "square";
};

const prepareData = ({ nodes, relationships }) => ({
  nodes: nodes.map(node => ({
    ...node,
    symbolType: shapeForNode(node)
  })),
  links: relationships.map(r => ({
    source: r.fromNode,
    target: r.toNode,
    color:
      r.type === "OTHER" ? "red" : r.type === "ECONOMIC" ? "purple" : "green",
    highlightColor:
      r.type === "OTHER" ? "red" : r.type === "ECONOMIC" ? "purple" : "green"
  }))
});

const myConfig = {
  directed: true,
  nodeHighlightBehavior: true,
  node: {
    color: "lightgreen",
    size: 300,
    highlightStrokeColor: "blue",
    viewGenerator: node =>
      !!node.siren ? (
        <CompanyNode>{node.name}</CompanyNode>
      ) : (
        <PersonNode>{node.firstName[0] + node.lastName[0]}</PersonNode>
      ),
    renderLabel: false
  },
  link: {
    highlightColor: "blue"
  }
};

const Example3 = ({ data, width, height }) => {
  const fakeHandler = e => console.log(e);

  const preparedData = prepareData(data);

  return (
    <>
      <h3>react-d3-graph</h3>
      <div style={{ width, height, border: "1px solid" }}>
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={preparedData}
          config={{ ...myConfig, width, height }}
          onClickNode={fakeHandler}
          onRightClickNode={fakeHandler}
          onClickGraph={fakeHandler}
          onClickLink={fakeHandler}
          onRightClickLink={fakeHandler}
          onMouseOverNode={fakeHandler}
          onMouseOutNode={fakeHandler}
          onMouseOverLink={fakeHandler}
          onMouseOutLink={fakeHandler}
        />
      </div>
    </>
  );
};

export default Example3;
