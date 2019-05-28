import React from "react";
import {
  InteractiveForceGraph,
  ForceGraphNode,
  ForceGraphLink
} from "react-vis-force";

const Example = ({ data, width, height }) => {
  const { nodes, relationships } = data;

  const renderColorForNode = node => {
    return node.siren ? "red" : "blue";
  };

  return (
    <>
      <h3>react-vis-force</h3>
      <div style={{ height, width, border: "1px solid" }}>
        <InteractiveForceGraph
          simulationOptions={{ height, width }}
          style={{ height, width, border: "1px solid" }}
        >
          {nodes.map(node => (
            <ForceGraphNode
              key={node.id}
              node={node}
              fill={renderColorForNode(node)}
            />
          ))}
          {relationships.map(r => (
            <ForceGraphLink link={{ source: r.fromNode, target: r.toNode }} />
          ))}
        </InteractiveForceGraph>
      </div>
    </>
  );
};

export default Example;
