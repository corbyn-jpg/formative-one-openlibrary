import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    const fictionBooks = [5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600];
    const nonFictionBooks = [
      4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100,
    ];

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Fiction Books Published",
            data: fictionBooks,
            borderColor: "rgb(144, 160, 255)",
            backgroundColor: "rgba(35, 79, 146, 0.2)",
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Non-Fiction Books Published",
            data: nonFictionBooks,
            borderColor: "rgb(228, 227, 145)",
            backgroundColor: "rgba(255, 214, 102, 0.2)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Trends in Book Publishing Over the Years",
            font: {
              size: 24,
              family: "serif",
            },
            color: "white",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Year",
              font: {
                size: 20,
                family: "serif",
              },
              color: "white",
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of Books Published",
              font: {
                size: 20,
                family: "serif",
              },
              color: "white",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    });

    return () => chart.destroy(); // Cleanup on unmount
  }, []);

  return (
    <div
      style={{
        backgroundColor: "rgba(81, 53, 44, 0.8)",
        height: "55vh",
        marginRight: "auto",
        marginLeft: "5%",
        marginTop: "5%",
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChart;
