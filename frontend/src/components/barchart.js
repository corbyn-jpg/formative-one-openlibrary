import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store the Chart.js instance

  useEffect(() => {
    const data = [
      { genre: 'Fiction', count: 120 },
      { genre: 'Non-Fiction', count: 85 },
      { genre: 'Science Fiction', count: 60 },
      { genre: 'Mystery', count: 90 },
      { genre: 'Fantasy', count: 75 },
      { genre: 'Romance', count: 110 },
      { genre: 'Thriller', count: 95 },
    ];

    const ctx = chartRef.current.getContext('2d');

    // Destroy the previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a new Chart.js instance and store it in the ref
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(row => row.genre),
        datasets: [
          {
            label: 'Number of Books by Genre',
            data: data.map(row => row.count),
            backgroundColor: 'rgba(35, 79, 146, 0.8)', 
            borderColor: 'rgb(144, 160, 255)',
            borderWidth: 1, 
            barThickness: 'flex',
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
                size: 16,
                family: 'serif',
              },
              color: 'white',
            },
          },
          x: {
            ticks: {
              font: {
                size: 16,
                family: 'serif',
              },
              color: 'white',
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
                size: 20,
                family: 'serif',
              },
              color: 'white',
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
  }, []);

  return (
    <div style={{ width: '60%', height: '50vh', marginRight: 'auto', marginLeft: '5%', marginTop: '5%'}}>
      <canvas ref={chartRef} id="book-genres" />
    </div>
  );
};

export default BarChart;