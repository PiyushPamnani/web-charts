import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
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
        const canvas = await html2canvas(chartElement, { scale: 1 });
        imageData.push(canvas.toDataURL("image/png"));
      };

      for (let chartElement of chartElements) {
        await captureImages(chartElement);
      }

      setChartImages(imageData);
      setGraphsReady(true);
    };

    if (dataReady) {
      setTimeout(() => {
        fetchChartImages();
      }, 2000);
    }
  }, [dataReady]);

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
