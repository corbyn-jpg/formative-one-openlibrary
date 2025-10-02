import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const StackedAreaChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use search endpoint instead of subjects endpoint for better CORS support
        const genres = ["fiction", "nonfiction", "science_fiction", "mystery"];
        const years = [1980, 1990, 2000, 2010, 2020];

        // Fetch data for each genre
        const genreData = await Promise.all(
          genres.map(async (genre) => {
            const yearData = await Promise.all(
              years.map(async (year) => {
                try {
                  // Use search endpoint with subject filter and published_in parameter
                  const response = await axios.get(
                    `https://openlibrary.org/search.json?subject=${genre}&published_in=${year}&limit=1`
                  );
                  return response.data.numFound || 0;
                } catch (error) {
                  console.error(`Error fetching data for ${genre} in ${year}:`, error);
                  return 0;
                }
              })
            );
            return {
              label: genre.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              data: yearData,
            };
          })
        );

        const chartData = {
          labels: years,
          datasets: genreData.map((genre, index) => ({
            label: genre.label,
            data: genre.data,
            borderColor: ["#90a0ff", "#3e996e", "#e4e391", "#ff6f61"][index],
            backgroundColor: [
              "rgba(144, 160, 255, 0.5)",
              "rgba(62, 153, 110, 0.5)",
              "rgba(228, 227, 145, 0.5)",
              "rgba(255, 111, 97, 0.5)",
            ][index],
            fill: true,
          })),
        };

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching data from Open Library API:", error);
        
        // Fallback to smaller dataset if main fetch fails
        const fallbackData = {
          labels: [2000, 2010, 2020],
          datasets: [
            {
              label: "Fiction",
              data: [2000, 2500, 3000],
              borderColor: "#90a0ff",
              backgroundColor: "rgba(144, 160, 255, 0.5)",
              fill: true,
            },
            {
              label: "Non-Fiction",
              data: [1500, 1800, 2100],
              borderColor: "#3e996e",
              backgroundColor: "rgba(62, 153, 110, 0.5)",
              fill: true,
            },
          ],
        };
        setChartData(fallbackData);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      const chart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Books Published by Genre Over Time",
              font: {
                size: 18,
                family: "serif",
              },
              color: "white",
            },
            legend: {
              labels: {
                font: {
                  size: 14,
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
                  size: 16,
                  family: "serif",
                },
                color: "white",
              },
              ticks: {
                color: "white",
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
              title: {
                display: true,
                text: "Number of Books Published",
                font: {
                  size: 16,
                  family: "serif",
                },
                color: "white",
              },
              ticks: {
                color: "white",
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

      return () => chart.destroy();
    }
  }, [chartData]);

  return (
    <div
      style={{
        backgroundColor: "rgba(81, 53, 44, 0.8)",
        height: "55vh",
        marginTop: "5%",
        width: "45vw",
        position: "relative",
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default StackedAreaChart;