import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ data, backgroundColors, fontColor, chartTitle }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Validate data
    const isValidData = data && 
                       Array.isArray(data) && 
                       data.length > 0 &&
                       data.every(item => item && item.label && typeof item.value === 'number');

    if (ctx && isValidData) {
      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: data.map(item => item.label),
          datasets: [
            {
              data: data.map(item => item.value),
              backgroundColor: backgroundColors,
              borderColor: "rgba(81, 53, 44, 1)",
              borderWidth: 2,
            },
          ],
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
              position: 'bottom',
              labels: {
                font: {
                  size: 14,
                  family: "serif",
                },
                color: fontColor,
                padding: 20,
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
  }, [data, backgroundColors, fontColor, chartTitle]);

  const hasValidData = data && 
                      Array.isArray(data) && 
                      data.length > 0 &&
                      data.every(item => item && item.label && typeof item.value === 'number');

  return (
    <div
      style={{
        backgroundColor: "rgba(81, 53, 44, 0.8)",
        height: "100%",
        width: "100%",
        padding: "20px",
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

export default PieChart;