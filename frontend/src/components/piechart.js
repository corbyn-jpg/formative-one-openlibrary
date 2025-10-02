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

    if (ctx && data && data.length > 0) {
      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: data.map(item => item.label),
          datasets: [
            {
              data: data.map(item => item.value),
              backgroundColor: backgroundColors,
              borderColor: "white",
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

export default PieChart;