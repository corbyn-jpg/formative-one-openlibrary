import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarChart = ({
  data,
  backgroundColor,
  borderColor,
  fontColor,
  chartTitle,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    // Destroy the previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Validate data before creating chart
    const isValidData = data && 
                       Array.isArray(data) && 
                       data.length > 0 &&
                       data.every(item => 
                         item && 
                         typeof item.label === 'string' && 
                         typeof item.value === 'number'
                       );

    // Only create chart if data is valid and context is available
    if (!ctx || !isValidData) {
      return;
    }

    // Create a new Chart.js instance
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((row) => row.label), // X-axis labels
        datasets: [
          {
            label: chartTitle,
            data: data.map((row) => row.value), // Y-axis values
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
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
                // Ensure the y-axis ticks are whole numbers
                if (Number.isInteger(value)) {
                  return value;
                }
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Selection",
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
              display: false,
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
            display: false,
          },
        },
      },
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, backgroundColor, borderColor, fontColor, chartTitle]);

  // Check if we have valid data to render
  const hasValidData = data && 
                      Array.isArray(data) && 
                      data.length > 0 &&
                      data.every(item => 
                        item && 
                        typeof item.label === 'string' && 
                        typeof item.value === 'number'
                      );

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

export default BarChart;
