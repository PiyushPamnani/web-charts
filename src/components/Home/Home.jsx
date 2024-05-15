import React, { useState } from "react";
import GraphHome from "../GraphHome/GraphHome";
import TableHome from "../TableHome/TableHome";
import "./home.css";

const Home = () => {
  const [graphOrTable, setGraphOrTable] = useState("Graph");

  return (
    <div className="home-container">
      <div>
        <p>What do you want to Display?</p>
      </div>
      <div className="buttons-container">
        <button onClick={() => setGraphOrTable("Graph")}>Graph</button>
        <button onClick={() => setGraphOrTable("Table")}>Table</button>
      </div>
      <div style={{ width: "100%" }}>
        {graphOrTable === "Graph" ? <GraphHome /> : <TableHome />}
      </div>
    </div>
  );
};

export default Home;
