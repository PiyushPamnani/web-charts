import HighchartsReact from "react-highcharts";
import Highcharts from "highcharts";

const sampleData = [1, 2, 3, 4, 5];
const cricketHeaders = [
  "Right-hand batsmen vs. Left-arm pacers (Last 5 innings)",
  "Off-spinners vs Left-hand batsmen (Last 5 innings)",
  "Leg-spinners vs Right-hand batsmen (Last 5 innings)",
  "Swing Comparison (Last 5 innings)",
  "Spin Comparison (Last 5 innings)",
  "Run Rate in first 10 overs vs Next 10 overs (Last 5 innings)",
  "Graph comparison between both teams (Last 5 innings)",
  "Batting Average: Right-hand vs. Left-hand (Last 5 innings)",
  "Economy Rate: Powerplay vs. Death overs (Last 5 innings)",
  "Strike Rate: Spinners vs. Pacers (Last 5 innings)",
];

const chartTypes = ["column", "scatter", "line"];

const generateData = () => {
  return sampleData.map((value, index) => ({
    name: index + 1,
    y: parseFloat((Math.random() * 10).toFixed(2)),
  }));
};

const generateScatterData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      x: parseFloat((Math.random() * 100).toFixed(2)),
      y: parseFloat((Math.random() * 100).toFixed(2)),
    });
  }
  return data;
};

export const generateChartData = (index) => {
  const header = cricketHeaders[index % cricketHeaders.length];
  const chartType = chartTypes[index % chartTypes.length];

  if (chartType === "scatter") {
    return {
      header,
      chartType,
      data: generateScatterData(),
    };
  } else {
    return {
      header,
      chartType,
      data: generateData(),
    };
  }
};

export const generateChart = (index, chartConfig) => {
  const { header, chartType, data } = chartConfig;

  let config;

  if (chartType === "scatter") {
    config = {
      chart: {
        type: chartType,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: null,
      },
      title: {
        text: undefined,
      },
      subtitle: {
        text: undefined,
      },
      xAxis: {
        title: {
          text: "Runs without boundaries",
          style: {
            color: "#333",
          },
        },
        gridLineWidth: 1,
      },
      yAxis: {
        title: {
          text: "Strike Rate/Average/Turn/Swing",
          style: {
            color: "#333",
          },
        },
        gridLineWidth: 1,
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: "rgb(100,100,100)",
              },
            },
          },
          states: {
            hover: {
              marker: {
                enabled: false,
              },
            },
          },
          tooltip: {
            headerFormat: "<b>{series.name}</b><br>",
            pointFormat: "{point.x}, {point.y}",
          },
        },
      },
      series: [
        {
          name: `Series ${index + 1}`,
          color: "rgba(223, 83, 83, .5)",
          marker: {
            Symbol: "circle",
          },
          data: data,
        },
      ],
    };
  } else {
    config = {
      chart: {
        type: chartType,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: null,
      },
      title: {
        text: undefined,
      },
      subtitle: {
        text: undefined,
      },
      xAxis: {
        title: {
          text: "Innings",
          style: {
            color: "#333",
          },
        },
        categories: data.map((data) => data.name),
        gridLineWidth: 1,
      },
      yAxis: {
        title: {
          text: "Strike Rate/Average/Turn/Swing",
          style: {
            color: "#333",
          },
        },
        gridLineWidth: 1,
      },
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
          data: data,
        },
      ],
    };
  }

  return (
    <div className="chart-row" key={index}>
      <div className="chart-header">{header}</div>
      <div className="chart-subtitle">
        Cricket Analytics - {chartType} chart
      </div>
      <HighchartsReact key={index} highcharts={Highcharts} config={config} />
    </div>
  );
};
