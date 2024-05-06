import React from "react";
import HighchartsReact from "react-highcharts";
import Highcharts from "highcharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import image1 from "./assets/header.webp";
import image2 from "./assets/footer.webp";
import "./App.css";

const sampleData = [1, 2, 3, 4, 5];
let num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const App = () => {
  const generateData = () => {
    return sampleData.map((value, index) => ({
      x: index,
      y: Math.random() * 10,
    }));
  };

  const generateChart = (index) => {
    const config = {
      chart: {
        type: "line",
      },
      title: {
        text: `Chart ${index + 1}`,
      },
      series: [
        {
          data: generateData(),
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

    // Function to add header with clickable image and text link
    const addHeader = (graphName, reportDate) => {
      pdf.setFontSize(12); // Set font size for header
      pdf.addImage(image1, "PNG", 0, 0, 210, 45); // Add header image
      pdf.setTextColor(255, 255, 0); // Set text color to blue
      pdf.textWithLink("Click here", 150, 15, { url: "https://jio.com" }); // Add clickable text link
      pdf.text(`Graph: ${graphName}`, 10, 5); // Add graph name
      pdf.text(`Report Date: ${reportDate}`, 10, 15); // Add report date
    };

    // Function to add footer with clickable image and text link
    const addFooter = () => {
      const pageHeight = pdf.internal.pageSize.getHeight(); // Get page height
      pdf.addImage(image2, "PNG", 0, pageHeight - 45, 210, 45); // Add footer image
      pdf.setTextColor(255, 255, 0); // Set text color to blue
      pdf.textWithLink("Click here", 150, pageHeight - 5, {
        url: "https://jio.com",
      }); // Add clickable text link
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
        {num.map((n) => (
          <div key={n} className="chart-row">
            {generateChart(n)}
          </div>
        ))}
      </div>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default App;
