import React, { useState, useEffect } from "react";
import Carousel from "../components/carousel";
import heroImage from "../Assets/Hero.jpg";
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
        const [carouselResponse, lineChartResponse] =
          await Promise.all([
            axios.get(
              "https://openlibrary.org/search.json?q=subject:fiction&limit=20&fields=title,cover_i"
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
            const response = await axios.get(
              `https://openlibrary.org/search.json?subject=${genre.toLowerCase()}&limit=1`
            );
            return {
              label: genre,
              value: response.data.numFound || 0,
            };
          })
        );
        setBarChartData(genreData);

        // Process line chart data with better error handling
        const processLineChartData = (books) => {
          // Filter and process books for line chart
          const validBooks = books.filter(
            (book) => book.first_publish_year && book.edition_count
          );
          
          if (validBooks.length === 0) {
            // Fallback data if no valid books from API
            return {
              labels: [2010, 2012, 2014, 2016, 2018, 2020, 2022],
              datasets: [{
                label: "Books Published",
                data: [45, 68, 92, 115, 142, 178, 210],
                borderColor: "rgb(144, 160, 255)",
                backgroundColor: "rgba(101, 57, 160, 0.2)",
                fill: true,
                tension: 0.4,
              }]
            };
          }

          // Sort by year and take top 10
          const sortedBooks = validBooks
            .sort((a, b) => a.first_publish_year - b.first_publish_year)
            .slice(0, 10);

          const labels = sortedBooks.map(book => book.first_publish_year);
          const data = sortedBooks.map(book => book.edition_count);

          return {
            labels,
            datasets: [{
              label: "Books Published",
              data,
              borderColor: "rgb(144, 160, 255)",
              backgroundColor: "rgba(101, 57, 160, 0.2)",
              fill: true,
              tension: 0.4,
            }]
          };
        };

        const processedLineChartData = processLineChartData(lineChartResponse.data.docs);
        setLineChartData(processedLineChartData);

        // Debug logs
        console.log('Line Chart Data:', processedLineChartData);
        console.log('Line Chart Labels:', processedLineChartData.labels);
        console.log('Line Chart Datasets:', processedLineChartData.datasets);

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
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
          color: "white",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <>
      <div
        className="hero-image"
        style={{
          backgroundImage: `linear-gradient(to right, #bcada6 30%, rgba(245, 230, 218, 0) 100%), url(${heroImage})`,
        }}
      >
        <div className="hero-text" style={{marginLeft: "2%"}}>
          <h1>Open Library Explorer</h1>
          <p>
            Open Library Explorer helps users compare books, authors, and genres
            using data from the Open Library API. Easily analyze trends, view
            top books, and explore literary timelines through interactive charts
            and visualizations. Perfect for readers, researchers, and book
            enthusiasts looking to dive deeper into the world of literature.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "2vh 5%",
          gap: "20px",
        }}
      >
        <div style={{ flex: 2, width: "60vw" }}>
          <BarChart
            data={barChartData}
            backgroundColor="rgba(35, 79, 146, 0.8)"
            borderColor="rgb(144, 160, 255)"
            fontColor="white"
            chartTitle="Number of Books by Genre"
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              textAlign: "center",
              color: "white",
              marginBottom: "20px",
            }}
          >
            Featured Books
          </h2>
          <Carousel images={carouselData.map((book) => book.image)} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 5%",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          {lineChartData.labels && lineChartData.labels.length > 0 ? (
            <LineChart
              data={lineChartData}
              borderColors={["rgb(144, 160, 255)"]}
              backgroundColors={["rgba(101, 57, 160, 0.2)"]}
              fontColor="white"
              chartTitle="Trends in Book Publishing Over the Years"
            />
          ) : (
            <div
              style={{
                backgroundColor: "rgba(81, 53, 44, 0.8)",
                height: "55vh",
                padding: "20px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "18px",
              }}
            >
              Loading chart data...
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <StackedAreaChart />
        </div>
      </div>
    </>
  );
}

export default Home;