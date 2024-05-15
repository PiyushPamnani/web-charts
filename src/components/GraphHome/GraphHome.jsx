import React, { useState } from "react";
import Graphs from "../Graphs/Graphs";
import "./graphhome.css";

const GraphHome = () => {
  const [graphNumber, setGraphNumber] = useState();
  const [showGraph, setShowGraph] = useState(false);

  const handleGraph = () => {
    if (graphNumber > 0) {
      setShowGraph(true);
    }
  };

  return (
    <div className="main-box">
      <div className="graph-container">
        <p>Enter the number of Graph you want to display</p>
        <div className="inputNumber">
          <input
            type="number"
            onChange={(e) => setGraphNumber(e.target.value)}
            placeholder="Enter a number"
          />
          <button onClick={handleGraph}>Submit</button>
        </div>
      </div>
      <div>{showGraph && <Graphs graphNumber={graphNumber} />}</div>
    </div>
  );
};

export default GraphHome;
