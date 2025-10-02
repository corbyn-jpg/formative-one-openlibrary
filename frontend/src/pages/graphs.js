import React, { useState, useEffect } from "react";
import BarChart from "../components/barchart";
import LineChart from "../components/linechart";
import StackedAreaChart from "../components/stackedarea";
import PieChart from "../components/piechart";
import axios from "axios";

const Graphs = () => {
  const [genreData, setGenreData] = useState([]);
  const [yearlyData, setYearlyData] = useState({ labels: [], datasets: [] });
  const [authorData, setAuthorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const [genresResponse, yearsResponse, authorsResponse] = await Promise.all([
          axios.get("https://openlibrary.org/search.json?q=subject:fiction&limit=1"),
          axios.get("https://openlibrary.org/search.json?q=subject:fiction&limit=20&fields=first_publish_year"),
          axios.get("https://openlibrary.org/search.json?q=author&limit=10")
        ]);

        // Genre distribution data
        const popularGenres = ["Fiction", "Science", "History", "Biography", "Children", "Romance"];
        const genreStats = await Promise.all(
          popularGenres.map(async (genre) => {
            const response = await axios.get(
              `https://openlibrary.org/search.json?subject=${genre.toLowerCase()}&limit=1`
            );
            return {
              label: genre,
              value: response.data.numFound || 0,
            };
          })
        );
        setGenreData(genreStats);

        // Yearly publication data
        const yearlyStats = yearsResponse.data.docs
          .filter(book => book.first_publish_year)
          .slice(0, 10)
          .sort((a, b) => a.first_publish_year - b.first_publish_year);

        setYearlyData({
          labels: yearlyStats.map(book => book.first_publish_year),
          datasets: [{
            label: "Publications",
            data: yearlyStats.map((book, index) => (index + 1) * 100), // Simulated data
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          }]
        });

        // Top authors data
        const topAuthors = authorsResponse.data.docs.slice(0, 5).map((doc, index) => ({
          label: doc.author_name?.[0] || "Unknown Author",
          value: (5 - index) * 1000, // Simulated popularity
        }));
        setAuthorData(topAuthors);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching graph data:", error);
        setIsLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Graphs...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Library Analytics & Graphs</h1>
      <p className="page-description">
        Explore comprehensive data visualizations about books, authors, and publishing trends.
      </p>

      <div className="graphs-grid">
        <div className="graph-card">
          <h3>Genre Distribution</h3>
          <BarChart
            data={genreData}
            backgroundColor="rgba(153, 102, 255, 0.6)"
            borderColor="rgb(153, 102, 255)"
            fontColor="white"
            chartTitle="Books by Genre"
          />
        </div>

        <div className="graph-card">
          <h3>Publication Timeline</h3>
          <LineChart
            data={yearlyData}
            borderColors={["rgb(75, 192, 192)"]}
            backgroundColors={["rgba(75, 192, 192, 0.2)"]}
            fontColor="white"
            chartTitle="Publications by Year"
          />
        </div>

        <div className="graph-card">
          <h3>Top Authors</h3>
          <PieChart
            data={authorData}
            backgroundColors={[
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ]}
            fontColor="white"
            chartTitle="Most Popular Authors"
          />
        </div>

        <div className="graph-card full-width">
          <h3>Genre Trends Over Time</h3>
          <StackedAreaChart />
        </div>
      </div>
    </div>
  );
};

export default Graphs;