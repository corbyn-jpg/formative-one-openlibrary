import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const LineChart = ({
  data,
  borderColors,
  backgroundColors,
  fontColor,
  chartTitle,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Only create chart if data is available
    if (ctx && data && data.labels && data.datasets) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.labels,
          datasets: data.datasets.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: borderColors ? borderColors[index] : dataset.borderColor,
            backgroundColor: backgroundColors ? backgroundColors[index] : dataset.backgroundColor,
            borderWidth: 2,
            fill: dataset.fill !== undefined ? dataset.fill : true,
            tension: 0.4,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
                usePointStyle: true,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Year",
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
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Books Published",
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
          },
        },
      });
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, borderColors, backgroundColors, fontColor, chartTitle]);

  return (
    <div
      style={{
        backgroundColor: "rgba(81, 53, 44, 0.8)",
        height: "55vh",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChart;