import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const StackedAreaChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    const fiction = [5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600];
    const nonFiction = [4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100];
    const sciFi = [3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800];
    const mystery = [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800];

    const chart = new Chart(ctx, {
      type: "line", // Stacked area charts are a variation of line charts
      data: {
        labels: years,
        datasets: [
          {
            label: "Fiction",
            data: fiction,
            borderColor: "#90a0ff",
            backgroundColor: "rgba(101, 57, 160, 0.5)",
            fill: true,
          },
          {
            label: "Non-Fiction",
            data: nonFiction,
            borderColor: "#90a0ff",
            backgroundColor: "rgba(35, 79, 146, 0.5)",
            fill: true,
          },
          {
            label: "Science Fiction",
            data: sciFi,
            borderColor: "#3e996e",
            backgroundColor: "rgba(75, 192, 137, 0.5)",
            fill: true,
          },
          {
            label: "Mystery",
            data: mystery,
            borderColor: "#e4e391",
            backgroundColor: "rgba(255, 214, 102, 0.5)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Books Published by Genre Over Time",
            font: {
              size: 24,
              family: "serif",
            },
            color: "white",
          },
          legend: {
            labels: {
              font: {
                size: 16,
                family: "serif",
              },
              color: "white",
            },
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
            ticks: {
              color: "white",
              font: {
                size: 16,
                family: "serif",
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Number of Books Published",
              font: {
                size: 20,
                family: "serif",
              },
              color: "white",
            },
            ticks: {
              color: "white",
              font: {
                size: 16,
                family: "serif",
              },
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
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default StackedAreaChart;
