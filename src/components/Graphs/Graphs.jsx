import React, { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { generateChart, generateChartData } from "./Graph_Data";
import "./Graphs.css";

const Graphs = ({ graphNumber, setChartImages, setGraphsReady }) => {
  const [graphData, setGraphData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < graphNumber; i++) data.push(i);
    setGraphData(data);

    const generatedData = data.map((index) => generateChartData(index));
    setChartData(generatedData);
    setDataReady(true);
  }, [graphNumber]);

  useEffect(() => {
    const fetchChartImages = async () => {
      const chartElements = document.querySelectorAll(".chart-row");
      const imageData = [];

      const captureImages = async (chartElement) => {
        try {
          const dataUrl = await toPng(chartElement, { quality: 3 });
          imageData.push(dataUrl);
        } catch (error) {
          console.error("Error capturing chart image:", error);
        }
      };

      for (let chartElement of chartElements) {
        await captureImages(chartElement);
      }

      setChartImages(imageData);
      setGraphsReady(true);
    };

    if (dataReady) {
      setTimeout(() => fetchChartImages(), 2000);
    }
  }, [dataReady, setChartImages, setGraphsReady]);

  return (
    <div>
      <div className="chart-container">
        {graphData.map((n, index) => (
          <div key={n}>{generateChart(n, chartData[index])}</div>
        ))}
      </div>
    </div>
  );
};

export default Graphs;
