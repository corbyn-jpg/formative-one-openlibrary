import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const StackedAreaChart = () => {
  const chartRef = useRef(null);
  const [stack, setStack] = useState(null);

  useEffect(() => {
    //Calling from the api
    const fetchData = async () => {
      try {
        // Define the genres
        const genres = ["fiction", "nonfiction", "science_fiction", "mystery"];
        const years = [1980, 1990, 2000, 2010, 2020, 2021, 2022, 2023, 2024];

        // Fetch data for each genre
        const genreData = await Promise.all(
          genres.map(async (genre) => {
            const responses = await Promise.all(
              years.map(async (year) => {
                const response = await axios.get(
                  `https://openlibrary.org/subjects/${genre}.json?published_in=${year}`
                );
                return response.data.work_count;
              })
            );
            return {
              label: genre,
              data: responses,
            };
          })
        );

        // Set the chart data state
        setStack({
          labels: years,
          datasets: genreData.map((genre, index) => ({
            label: genre.label,
            data: genre.data,
            borderColor: ["#90a0ff", "#3e996e", "#e4e391", "#ff6f61"][index],
            backgroundColor: [
              "rgba(101, 57, 160, 0.5)",
              "rgba(75, 192, 137, 0.5)",
              "rgba(255, 214, 102, 0.5)",
              "rgba(255, 99, 132, 0.5)",
            ][index],
            fill: true,
          })),
        });
      } catch (error) {
        console.error("Error fetching data from Open Library API:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (stack && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      const chart = new Chart(ctx, {
        type: "line",
        data: stack,
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
    }
  }, [stack]);

  return (
    <div
      style={{
        backgroundColor: "rgba(81, 53, 44, 0.8)",
        height: "55vh",
        marginTop: "5%",
        position: "relative",
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default StackedAreaChart;
