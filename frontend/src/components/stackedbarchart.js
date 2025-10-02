import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const StackedBarChart = ({ data, fontColor, chartTitle }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (ctx && data && data.labels && data.datasets) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: data.datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: "Genres",
                font: {
                  size: 16,
                  family: "serif",
                },
                color: fontColor,
              },
              ticks: {
                color: fontColor,
                font: {
                  size: 14,
                  family: "serif",
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Works",
                font: {
                  size: 16,
                  family: "serif",
                },
                color: fontColor,
              },
              ticks: {
                color: fontColor,
                font: {
                  size: 14,
                  family: "serif",
                },
                callback: (value) => {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: chartTitle,
              font: {
                size: 18,
                family: "serif",
              },
              color: fontColor,
            },
            legend: {
              labels: {
                font: {
                  size: 14,
                  family: "serif",
                },
                color: fontColor,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, fontColor, chartTitle]);

  return (
    <div
      style={{
        backgroundColor: "rgba(81, 53, 44, 0.8)",
        height: "100%",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default StackedBarChart;