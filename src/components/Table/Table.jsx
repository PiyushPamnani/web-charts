import React, { useState, useEffect, useMemo, memo } from "react";
import { toPng } from "html-to-image";
import { players, table_headers } from "./Player_Data";

const TableRow = memo(({ row, rowIndex, columnNumber }) => (
  <tr key={rowIndex} className="table_body">
    {row.map((cell, cellIndex) => (
      <td key={cellIndex} style={{ border: "1px solid black", padding: "8px" }}>
        {cell.type === "image" ? (
          <>
            <p>
              {rowIndex + 1}. {players[rowIndex % 11].player_name}
            </p>
            <img src={cell.value} alt="Random" style={{ width: "50px" }} />
          </>
        ) : (
          cell.value
        )}
      </td>
    ))}
  </tr>
));

const Table = ({ rowNumber, columnNumber, setBodyImages, setTablesReady }) => {
  const [tableDataReady, setTableDataReady] = useState(false);

  const tableData = useMemo(
    () =>
      Array.from({ length: rowNumber }, (_, rowIndex) =>
        Array.from({ length: columnNumber }, (_, colIndex) => ({
          type: colIndex === columnNumber - 1 ? "image" : "text",
          value:
            colIndex === columnNumber - 1
              ? players[rowIndex % 11].player_image
              : `Row ${rowIndex + 1}, Col ${colIndex + 1}`,
        }))
      ),

    [rowNumber, columnNumber]
  );

  useEffect(() => {
    if (tableData.length) {
      setTableDataReady(true);
    }
  }, [tableData]);

  useEffect(() => {
    const fetchTableImage = async () => {
      const bodyElements = document.querySelectorAll(".table_body");
      const imageData = [];

      const captureImages = async (bodyElement) => {
        try {
          const dataUrl = await toPng(bodyElement, { quality: 3 });
          imageData.push(dataUrl);
        } catch (error) {
          console.error("Error capturing table image:", error);
        }
      };

      for (let bodyElement of bodyElements) {
        await captureImages(bodyElement);
      }

      console.log(imageData);
      setBodyImages(imageData);
      setTablesReady(true);
    };

    if (tableDataReady) {
      setTimeout(() => fetchTableImage(), 2000);
    }
  }, [tableDataReady, setBodyImages, setTablesReady]);

  return (
    <div>
      <div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr className="table_head">
              {Array.from({ length: columnNumber }, (_, index) => (
                <th
                  key={index}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  {index !== columnNumber - 1 ? table_headers[index] : "Player"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                columnNumber={columnNumber}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
