import React, { useState } from "react";
import Table from "../Table/Table";
import "./tablehome.css";

const TableHome = () => {
  const [rowNumber, setRowNumber] = useState();
  const [columnNumber, setColumnNumber] = useState();
  const [showTable, setShowTable] = useState(false);

  const handleTable = () => {
    if (rowNumber > 0 && columnNumber > 0) {
      setShowTable(true);
    }
  };

  return (
    <div className="main-box">
      <div className="table-container">
        <p>Enter the number of rows and columns you want to display</p>
        <div className="inputNumber">
          <input
            type="number"
            onChange={(e) => setRowNumber(e.target.value)}
            placeholder="Enter row number"
            required
          />
          <input
            type="number"
            onChange={(e) => setColumnNumber(e.target.value)}
            placeholder="Enter column number"
            required
          />
          <button onClick={handleTable}>Submit</button>
        </div>
      </div>
      <div>
        {showTable && (
          <Table rowNumber={rowNumber} columnNumber={columnNumber} />
        )}
      </div>
    </div>
  );
};

export default TableHome;
