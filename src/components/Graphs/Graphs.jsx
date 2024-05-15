import React, { useEffect, useState } from "react";
import HighchartsReact from "react-highcharts";
import Highcharts from "highcharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import image1 from "../../assets/header.webp";
import image2 from "../../assets/footer.webp";
import "./Graphs.css";

const sampleData = [1, 2, 3, 4, 5];
const chartTypes = ["line", "pie", "scatter", "bar"];

const Graphs = ({ graphNumber }) => {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < graphNumber; i++) data.push(i);
    setGraphData(data);
  }, [graphNumber]);

  const generateData = (i) => {
    if (chartTypes[i % 4] === "line" || chartTypes[i % 4] === "bar") {
      return sampleData.map((value, index) => ({
        x: index,
        y: Math.random() * 10,
      }));
    } else {
      return sampleData.map((value, index) => ({
        name: index,
        y: Math.random() * 10,
        sliced: true,
        selected: true,
      }));
    }
  };

  const generateChart = (index) => {
    const chartType = chartTypes[index % 4];
    const config = {
      chart: {
        type: chartType,
        backgroundColor: "#f4f4f4",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: null,
      },
      title: {
        text: `Chart ${index + 1}`,
        style: {
          color: "#333",
          fontWeight: "bold",
        },
      },
      subtitle: {
        text: `This is a ${chartType} chart`,
        style: {
          color: "#666",
        },
      },
      xAxis:
        chartType !== "pie" && chartType !== "scatter"
          ? {
              title: {
                text: "X-Axis",
                style: {
                  color: "#333",
                },
              },
              gridLineWidth: 1,
            }
          : undefined,
      yAxis:
        chartType !== "pie" && chartType !== "scatter"
          ? {
              title: {
                text: "Y-Axis",
                style: {
                  color: "#333",
                },
              },
              gridLineWidth: 1,
            }
          : undefined,
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            style: {
              color: "#333",
              fontWeight: "bold",
            },
          },
          borderColor: "#ccc",
          borderWidth: 1,
          shadow: true,
        },
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            style: {
              color: "#333",
            },
          },
          showInLegend: true,
        },
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>",
        style: {
          color: "#333",
        },
      },
      series: [
        {
          name: `Series ${index + 1}`,
          data: generateData(index),
        },
      ],
    };

    return (
      <HighchartsReact key={index} highcharts={Highcharts} config={config} />
    );
  };

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4", true);
    const chartElements = document.querySelectorAll(".chart-row");
    let chartCount = 0;
    let offsetX = 10;
    let offsetY = 65;

    const addHeader = (graphName, reportDate) => {
      pdf.setFontSize(12);
      pdf.addImage(image1, "PNG", 0, 0, 210, 45);
      pdf.setTextColor(255, 255, 0);
      pdf.textWithLink("Click here", 150, 15, { url: "https://jio.com" });
      pdf.text(`Graph: ${graphName}`, 10, 5);
      pdf.text(`Report Date: ${reportDate}`, 10, 15);
    };

    const addFooter = () => {
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(image2, "PNG", 0, pageHeight - 45, 210, 45);
      pdf.setTextColor(255, 255, 0);
      pdf.textWithLink("Click here", 150, pageHeight - 5, {
        url: "https://jio.com",
      });
    };

    chartElements.forEach((chartElement, index) => {
      html2canvas(chartElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        pdf.addImage(imgData, "PNG", offsetX, offsetY, 90, 80);

        offsetX += 95;

        if (offsetX > 190) {
          offsetX = 10;
          offsetY += 90;
        }

        chartCount++;

        if (chartCount % 4 === 0 && chartCount !== chartElements.length) {
          addHeader(
            `Chart ${chartCount - 3} to ${chartCount}`,
            new Date().toLocaleDateString()
          );
          addFooter();
          pdf.addPage();
          offsetX = 10;
          offsetY = 65;
        } else if (chartCount === chartElements.length) {
          const lastCount = chartCount % 4 === 0 ? 4 : (chartCount % 4) - 1;
          addHeader(
            `Chart ${chartCount - lastCount} to ${chartCount}`,
            new Date().toLocaleDateString()
          );
          addFooter();
          pdf.save("web-charts.pdf");
        }
      });
    });
  };

  return (
    <div>
      <div className="chart-container">
        {graphData.map((n) => (
          <div key={n} className="chart-row">
            {generateChart(n)}
          </div>
        ))}
      </div>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default Graphs;
