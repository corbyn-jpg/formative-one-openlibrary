import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const BarChart = ({ data, backgroundColor, borderColor, fontColor, chartTitle }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store the Chart.js instance

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy the previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a new Chart.js instance and store it in the ref
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((row) => row.label), 
        datasets: [
          {
            label: chartTitle,
            data: data.map((row) => row.value), 
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
            barThickness: "flex",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 20,
                family: "serif",
              },
              color: fontColor,
            },
          },
          x: {
            ticks: {
              font: {
                size: 20,
                family: "serif",
              },
              color: fontColor,
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 24,
                family: "serif",
              },
              color: fontColor,
            },
          },
        },
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, backgroundColor, borderColor, fontColor, chartTitle]);

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

export default BarChart;