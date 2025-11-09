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

    // Validate data before creating chart
    const isValidData = data && 
                       data.labels && 
                       Array.isArray(data.labels) && 
                       data.labels.length > 0 &&
                       data.datasets && 
                       Array.isArray(data.datasets) && 
                       data.datasets.length > 0 &&
                       data.datasets.every(dataset => 
                         dataset.data && 
                         Array.isArray(dataset.data) && 
                         dataset.data.length === data.labels.length
                       );

    // Only create chart if data is valid and context is available
    if (ctx && isValidData) {
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

  // Check if we have valid data to render
  const hasValidData = data && 
                      data.labels && 
                      Array.isArray(data.labels) && 
                      data.labels.length > 0 &&
                      data.datasets && 
                      Array.isArray(data.datasets) && 
                      data.datasets.length > 0;

  return (
    <div
      style={{
        backgroundColor: "rgba(81, 53, 44, 0.8)",
        height: "450px",
        width: "100%",
        padding: "25px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: hasValidData ? "stretch" : "center",
        alignItems: hasValidData ? "stretch" : "center",
      }}
    >
      {hasValidData ? (
        <canvas ref={chartRef} style={{ flexGrow: 1, width: "100%", height: "100%" }} />
      ) : (
        <div style={{ textAlign: "center", color: "white" }}>
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>
            📊 Chart data unavailable
          </p>
          <p style={{ fontSize: "14px", opacity: 0.7 }}>
            {chartTitle || "Loading chart data..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default LineChart;