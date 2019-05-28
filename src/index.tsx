import React from "react";
import ReactDOM from "react-dom";

import Example1 from "./graphs/example-cola";
import Example2 from "./graphs/example-d3-force-layout";
import Example3 from "./graphs/example-react-d3-graph";
// import Example4 from "./graphs/example-react-digraph";
import Example4 from "./graphs/example-react-vis-force";

import data from "./data.json";

export type Data = {
  nodes: any[];
  relationships: any[];
};

function App() {
  return (
    <div className="App">
      <Example4 data={data} width={500} height={340} />
      <Example3 data={data} width={500} height={340} />
      <Example2 data={data} width={500} height={340} />
      <Example1 data={data} width={500} height={340} />
      <pre style={{ maxHeight: "300px" }}>
        {JSON.stringify(data, undefined, 2)}
      </pre>
      ;
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
