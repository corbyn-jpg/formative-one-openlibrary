import React, { useState, useEffect } from "react";
import Carousel from "../components/carousel";
import heroImage from "../Assets/Hero.jpeg";
import BarChart from "../components/barchart";
import LineChart from "../components/linechart";
import StackedAreaChart from "../components/stackedarea";
import axios from "axios";

function Home() {
  const [carouselData, setCarouselData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [carouselResponse, barChartResponse, lineChartResponse] =
          await Promise.all([
            axios.get(
              "https://openlibrary.org/search.json?q=subject:fiction&limit=50&fields=title,cover_i"
            ),
            axios.get(
              "https://openlibrary.org/search.json?q=subject:fiction&limit=1"
            ),
            axios.get(
              "https://openlibrary.org/search.json?q=subject:fiction&limit=20&fields=first_publish_year,edition_count"
            ),
          ]);

        // Process carousel data
        const allBooks = carouselResponse.data.docs.filter(
          (book) => book.cover_i
        );
        const randomBooks = getRandomItems(allBooks, 5);
        const carouselBooks = randomBooks.map((book) => ({
          image: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
          title: book.title,
        }));
        setCarouselData(carouselBooks);

        // Bar chart data
        const genres = [
          "Fantasy",
          "Science Fiction",
          "Mystery",
          "Romance",
          "Thriller",
        ];
        const genreData = await Promise.all(
          genres.map(async (genre) => {
            try {
              const response = await axios.get(
                `https://openlibrary.org/search.json?subject=${genre.toLowerCase()}&limit=1`
              );
              return {
                label: genre,
                value: response.data.numFound || 0,
              };
            } catch (error) {
              return { label: genre, value: 0 };
            }
          })
        );
        setBarChartData(genreData);

        // Process line chart data
        const lineChartBooks = lineChartResponse.data.docs.filter(
          (book) => book.first_publish_year && book.edition_count
        );
        const labels = lineChartBooks.map((book) => book.first_publish_year);
        const dataset = {
          label: "Books Published",
          data: lineChartBooks.map((book) => book.edition_count),
          borderColor: "rgb(144, 160, 255)",
          backgroundColor: "rgba(101, 57, 160, 0.2)",
          fill: true,
        };
        setLineChartData({
          labels,
          datasets: [dataset],
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getRandomItems = (array, count) => {
    if (array.length <= count) return array;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Library Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div
        className="hero-image"
        style={{
          backgroundImage: `linear-gradient(to right, #C19A84 40%, rgba(245, 230, 218, 0) 100%), url(${heroImage})`,
        }}
      >
        <div className="hero-text">
          <h1>Open Library Explorer</h1>
          <p>
            Open Library Explorer helps users compare books, authors, and genres
            using data from the Open Library API. Easily analyze trends, view
            top books, and explore literary timelines through interactive charts
            and visualizations.
          </p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-row">
          <div className="chart-wrapper large">
            <BarChart
              data={barChartData}
              backgroundColor="rgba(35, 79, 146, 0.8)"
              borderColor="rgb(144, 160, 255)"
              fontColor="white"
              chartTitle="Number of Books by Genre"
            />
          </div>
          <div className="featured-books">
            <h2>Featured Books</h2>
            <Carousel images={carouselData} />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-wrapper">
            <LineChart
              data={lineChartData}
              borderColors={["rgb(144, 160, 255)"]}
              backgroundColors={["rgba(101, 57, 160, 0.2)"]}
              fontColor="white"
              chartTitle="Book Publishing Trends"
            />
          </div>
          <div className="chart-wrapper">
            <StackedAreaChart />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;