import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import image1 from "../../assets/header.webp";
import image2 from "../../assets/footer.webp";

const Table = ({ rowNumber, columnNumber }) => {
  const tableData = Array.from({ length: rowNumber }, (_, rowIndex) =>
    Array.from({ length: columnNumber }, (_, colIndex) => ({
      type: colIndex === columnNumber - 1 ? "image" : "text",
      value:
        colIndex === columnNumber - 1
          ? "https://source.unsplash.com/random"
          : `Row ${rowIndex + 1}, Col ${colIndex + 1}`,
    }))
  );

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4", true);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const headerElement = document.querySelector(".table_head");
    const bodyElements = document.querySelectorAll(".table_body");

    html2canvas(headerElement).then((headerCanvas) => {
      const headerImgData = headerCanvas.toDataURL("image/png");
      const headerHeight =
        (headerCanvas.height * pageWidth) / headerCanvas.width;

      let currentPageHeight = 0;

      console.log(headerHeight, "Header Height");
      const addHeader = (tableName, reportDate) => {
        pdf.setFontSize(12);
        pdf.addImage(image1, "PNG", 0, 0, pageWidth, 45);
        pdf.setTextColor(255, 255, 0);
        pdf.textWithLink("Click here", 150, 15, { url: "https://jio.com" });
        pdf.text(`Table: ${tableName}`, 10, 5);
        pdf.text(`Report Date: ${reportDate}`, 10, 15);
        pdf.addImage(headerImgData, "PNG", 0, 50, pageWidth, headerHeight);
        currentPageHeight = headerHeight + 50;
      };

      const addFooter = () => {
        pdf.addImage(image2, "PNG", 0, pageHeight - 45, 210, 45);
        pdf.setTextColor(255, 255, 0);
        pdf.textWithLink("Click here", 150, pageHeight - 5, {
          url: "https://jio.com",
        });
      };

      addHeader("Sample Table", new Date().toLocaleDateString());

      const addBody = (bodyCanvas) => {
        const imgData = bodyCanvas.toDataURL("image/png");
        const imgHeight = (bodyCanvas.height * pageWidth) / bodyCanvas.width;
        console.log(imgHeight, "Body Height");

        if (currentPageHeight + imgHeight > pageHeight - 50) {
          addFooter();
          pdf.addPage();
          addHeader("Sample Table", new Date().toLocaleDateString());
        }

        pdf.addImage(
          imgData,
          "PNG",
          0,
          currentPageHeight,
          pageWidth,
          imgHeight
        );
        currentPageHeight += imgHeight;
        console.log(pageHeight, "Page Height");
        console.log(currentPageHeight, "Current Page Height");
      };

      bodyElements.forEach((bodyElement, index) => {
        html2canvas(bodyElement)
          .then(addBody)
          .then(addFooter)
          .then(() => {
            if (index === bodyElements.length - 1) {
              pdf.save("web-table.pdf");
            }
          });
      });
    });
  };

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
                  Header {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="table_body">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {cell.type === "image" ? (
                      <img
                        src={cell.value}
                        alt="Random"
                        style={{ width: "50px" }}
                      />
                    ) : (
                      cell.value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default Table;
