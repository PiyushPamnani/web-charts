import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "./home.css";
import html2canvas from "html2canvas";
import Table from "../Table/Table";
import Graphs from "../Graphs/Graphs";
import { header_logo, header, footer } from "../../images";

const Home = () => {
  const [graphNumber, setGraphNumber] = useState();
  const [showChart, setShowChart] = useState(false);
  const [rowNumber, setRowNumber] = useState();
  const [columnNumber, setColumnNumber] = useState();
  const [chartImages, setChartImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bodyImages, setBodyImages] = useState([]);
  const [graphsReady, setGraphsReady] = useState(false);
  const [tablesReady, setTablesReady] = useState(false);

  const handleGraphAndTable = () => {
    if (rowNumber > 0 && columnNumber > 0 && graphNumber > 0) {
      setShowChart(true);
      setLoading(true);
    }
  };

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  const addHeader = (pdf, title, reportDate) => {
    pdf.setFontSize(12);
    pdf.addImage(header_logo, "PNG", 0, 0, 45, 30);
    pdf.addImage(header, "PNG", 110, 0, 90, 45);
    pdf.setTextColor(23, 69, 133);
    pdf.textWithLink("Click here", 5, 40, { url: "https://www.iplt20.com/" });
    pdf.text(`${title}`, 70, 5);
    pdf.text(`Report Date: ${reportDate}`, 60, 15);
  };

  const addFooter = (pdf) => {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(footer, "PNG", 0, pageHeight - 45, pageWidth, 45);
    pdf.setTextColor(235, 176, 45);
    pdf.textWithLink("Click here", 170, pageHeight - 5, {
      url: "https://www.iplt20.com/",
    });
  };

  const downloadPDF = async () => {
    setLoading(true);
    const pdf = new jsPDF("p", "mm", "a4", true);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let chartIndex = 0;
    let tableIndex = 0;

    const preloadImages = async (imageUrls) => {
      return Promise.all(imageUrls.map((src) => loadImage(src)));
    };

    const chartImagesLoaded = await preloadImages(chartImages);
    const bodyImagesLoaded = await preloadImages(bodyImages);

    const addGraphPage = async () => {
      let offsetX = 2;
      let offsetY = 50;

      for (let i = 0; i < 4 && chartIndex < chartImagesLoaded.length; i++) {
        const img = chartImagesLoaded[chartIndex];
        if (chartIndex === graphNumber - 1 && offsetX < 100) {
          if (offsetY > 100) continue;
          else pdf.addImage(img, "PNG", offsetX, offsetY, 203, 180);
        } else {
          pdf.addImage(img, "PNG", offsetX, offsetY, 103, 90);
        }
        offsetX += 103;

        if (offsetX > 190) {
          offsetX = 2;
          offsetY += 100;
        }

        chartIndex++;
      }

      addHeader(pdf, "Charts", new Date().toLocaleDateString());
      addFooter(pdf);
    };

    const addTablePage = async () => {
      const headerElement = document.querySelector(".table_head");
      const headerCanvas = await html2canvas(headerElement);
      const headerImgData = headerCanvas.toDataURL("image/png");
      const headerHeight =
        (headerCanvas.height * pageWidth) / headerCanvas.width;
      let currentPageHeight = headerHeight + 50;

      pdf.addImage(headerImgData, "PNG", 0, 50, pageWidth, headerHeight);

      while (
        currentPageHeight + 50 < pageHeight - 50 &&
        tableIndex < bodyImagesLoaded.length
      ) {
        const img = bodyImagesLoaded[tableIndex];
        const imgHeight = (img.height * pageWidth) / img.width;
        if (currentPageHeight + imgHeight > pageHeight - 50) {
          break;
        }
        pdf.addImage(img, "PNG", 0, currentPageHeight, pageWidth, imgHeight);
        currentPageHeight += imgHeight;
        tableIndex++;
      }

      addHeader(pdf, "Tables", new Date().toLocaleDateString());
      addFooter(pdf);
    };

    while (
      chartIndex < chartImagesLoaded.length ||
      tableIndex < bodyImagesLoaded.length
    ) {
      if (chartIndex < chartImagesLoaded.length) {
        await addGraphPage();
        if (
          chartIndex < chartImagesLoaded.length ||
          tableIndex < bodyImagesLoaded.length
        ) {
          pdf.addPage();
        }
      }

      if (tableIndex < bodyImagesLoaded.length) {
        await addTablePage();
        if (
          chartIndex < chartImagesLoaded.length ||
          tableIndex < bodyImagesLoaded.length
        ) {
          pdf.addPage();
        }
      }
    }

    pdf.save("web-report.pdf");
    setLoading(false);
  };

  useEffect(() => {
    if (graphsReady && tablesReady) {
      setLoading(false);
    }
  }, [graphsReady, tablesReady]);

  return (
    <div className="main-box">
      <div>
        {!showChart ? (
          <div className="inputNumber">
            <input
              type="number"
              onChange={(e) => setGraphNumber(e.target.value)}
              placeholder="Enter number of graphs you want to display"
              required
            />
            <input
              type="number"
              onChange={(e) => setRowNumber(e.target.value)}
              placeholder="Enter row number for table"
              required
            />
            <input
              type="number"
              onChange={(e) => setColumnNumber(e.target.value)}
              placeholder="Enter column number for table"
              required
            />
            <button onClick={handleGraphAndTable}>Submit</button>
          </div>
        ) : (
          <>
            <Graphs
              graphNumber={graphNumber}
              setChartImages={setChartImages}
              setGraphsReady={setGraphsReady}
            />
            {!graphsReady ? (
              <div>Loading...</div>
            ) : (
              <Table
                rowNumber={rowNumber}
                columnNumber={columnNumber}
                setBodyImages={setBodyImages}
                setTablesReady={setTablesReady}
              />
            )}
            <button
              className="download-btn"
              onClick={downloadPDF}
              disabled={loading}
            >
              {loading ? "Preparing PDF..." : "Download PDF"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
