import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Carousel from "./components/carousel";
import heroImage from "./Assets/Hero.jpeg";
import BarChart from "./components/barchart";
import SearchResults from "./components/searchresults";
import LineChart from "./components/linechart";
import StackedAreaChart from "./components/stackedarea";
import Dropdown from "./components/dropdown";
import Card from "./components/card";
import axios from "axios";
import "./App.css";

function Landing() {
  const [carouselData, setCarouselData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  }); // Stores line chart data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch all data in parallel
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch data for carousel, bar chart, and line chart simultaneously
        const [carouselResponse, barChartResponse, lineChartResponse] =
          await Promise.all([
            axios.get(
              "https://openlibrary.org/search.json?q=subject:fiction&limit=20&fields=title,cover_i"
            ), // Fetch 20 books for carousel
            axios.get(
              "https://openlibrary.org/search.json?q=subject:fiction&limit=1"
            ), // Fetch genre data for bar chart
            axios.get(
              "https://openlibrary.org/search.json?q=subject:fiction&limit=10&fields=first_publish_year,edition_count"
            ), // Fetch line chart data
          ]);

        // Process carousel data
        const allBooks = carouselResponse.data.docs.filter(
          (book) => book.cover_i
        ); // Filter books with cover images
        const randomBooks = getRandomItems(allBooks, 5); // Select 5 random books
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
              value: response.data.numFound || 0, // Number of books in the genre
            };
          })
        );
        setBarChartData(genreData);

        // Process line chart data
        const lineChartBooks = lineChartResponse.data.docs;
        const labels = lineChartBooks.map(
          (book) => book.first_publish_year || "Unknown"
        );
        const dataset = {
          label: "Books Published",
          data: lineChartBooks.map((book) => book.edition_count || 0),
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

  // Helper function to get random items from an array
  const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Show loading spinner or error message
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
          backgroundImage: `linear-gradient(to right, #C19A84 40%, rgba(245, 230, 218, 0) 100%), url(${heroImage})`,
        }}
      >
        <div className="hero-text">
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
          margin: "20px 5%",
          gap: "20px",
        }}
      >
        <div style={{ flex: 2 }}>
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
          <LineChart
            data={lineChartData}
            borderColors={["rgb(144, 160, 255)"]}
            backgroundColors={["rgba(101, 57, 160, 0.2)"]}
            fontColor="white"
            chartTitle="Trends in Book Publishing Over the Years"
          />
        </div>
        <div style={{ flex: 1 }}>
          <StackedAreaChart />
        </div>
      </div>
    </>
  );
}

const Comparison = () => {
  const [firstSelection, setFirstSelection] = useState(null);
  const [secondSelection, setSecondSelection] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all authors and books on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all authors
        const authorsResponse = await axios.get(
          "https://openlibrary.org/search.json?q=author"
        );
        const allAuthors = authorsResponse.data.docs
          .map((doc) => doc.author_name?.[0])
          .filter((author) => author);

        // Fetch all books
        const booksResponse = await axios.get(
          "https://openlibrary.org/search.json?q=title"
        );
        const allBooks = booksResponse.data.docs
          .map((doc) => doc.title)
          .filter((title) => title);

        setAuthors(allAuthors);
        setBooks(allBooks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array ensures this runs only on mount

  // Helper function to get random items from an array
  const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Combine authors and books into a single array
  const dropdownOptions = [
    ...getRandomItems(authors, 4),
    ...getRandomItems(books, 4),
  ];

  // Fetch data from the Open Library API
  const fetchData = async (query, type) => {
    let url = "";
    if (type === "author") {
      url = `https://openlibrary.org/search.json?author=${encodeURIComponent(
        query
      )}`;
    } else if (type === "title") {
      url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
        query
      )}`;
    }

    try {
      const response = await axios.get(url);
      return response.data.numFound || 0;
    } catch (error) {
      console.error("Error fetching data:", error);
      return 0;
    }
  };

  // Fetch historical data for the line chart
  const fetchHistoricalData = async (query, type) => {
    const years = [1980, 1990, 2000, 2010, 2020, 2021, 2022, 2023, 2024];
    const data = await Promise.all(
      years.map(async (year) => {
        let url = "";
        if (type === "author") {
          url = `https://openlibrary.org/search.json?author=${encodeURIComponent(
            query
          )}&published_in=${year}`;
        } else if (type === "title") {
          url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
            query
          )}&published_in=${year}`;
        }

        try {
          const response = await axios.get(url);
          return { year, count: response.data.numFound || 0 };
        } catch (error) {
          console.error("Error fetching historical data:", error);
          return { year, count: 0 };
        }
      })
    );

    // Filter out years with no data
    const filteredData = data.filter((item) => item.count > 0);
    return {
      labels: filteredData.map((item) => item.year),
      data: filteredData.map((item) => item.count),
    };
  };

  const handleSubmit = async () => {
    if (!firstSelection || !secondSelection) {
      alert("Please select both options to compare.");
      return;
    }

    // Determine the type of selection
    const firstType = authors.includes(firstSelection) ? "author" : "title";
    const secondType = authors.includes(secondSelection) ? "author" : "title";

    // Fetch data for both selections
    const firstData = await fetchData(firstSelection, firstType);
    const secondData = await fetchData(secondSelection, secondType);

    const firstHistoricalData = await fetchHistoricalData(
      firstSelection,
      firstType
    );
    const secondHistoricalData = await fetchHistoricalData(
      secondSelection,
      secondType
    );

    setComparisonData([
      { label: firstSelection, value: firstData },
      { label: secondSelection, value: secondData },
    ]);

    setLineChartData({
      labels: firstHistoricalData.labels,
      datasets: [
        {
          label: firstSelection,
          data: firstHistoricalData.data,
          borderColor: "rgb(144, 160, 255)",
          backgroundColor: "rgba(101, 57, 160, 0.2)",
          fill: true,
        },
        {
          label: secondSelection,
          data: secondHistoricalData.data,
          borderColor: "rgb(228, 227, 145)",
          backgroundColor: "rgba(255, 214, 102, 0.2)",
          fill: true,
        },
      ],
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <h1>Compare Authors or Books</h1>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "5vh",
            fontSize: "24px",
            color: "white",
          }}
        >
          Loading...
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "white",
              justifyContent: "center",
              alignItems: "center",
              margin: "20px",
            }}
          >
            <Dropdown
              options={dropdownOptions}
              onSelect={setFirstSelection}
              placeholder="Select first option"
            />
            <Dropdown
              options={dropdownOptions}
              onSelect={setSecondSelection}
              placeholder="Select second option"
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4bc089",
                color: "white",
                fontFamily: "serif",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "20px",
                marginLeft: "10px",
              }}
            >
              Compare
            </button>
          </div>

          {comparisonData.length > 0 && (
            <div style={{ width: "80%", margin: "20px" }}>
              <BarChart
                data={comparisonData}
                backgroundColor="rgba(35, 79, 146, 0.8)"
                borderColor="rgb(144, 160, 255)"
                fontColor="white"
                chartTitle={`Number of Works for ${
                  firstSelection || "Option 1"
                } vs ${secondSelection || "Option 2"}`}
              />
            </div>
          )}

          {lineChartData.labels.length > 0 && (
            <div style={{ width: "80%", margin: "20px" }}>
              <LineChart
                data={lineChartData}
                borderColors={["rgb(144, 160, 255)", "rgb(228, 227, 145)"]}
                backgroundColors={[
                  "rgba(101, 57, 160, 0.2)",
                  "rgba(255, 214, 102, 0.2)",
                ]}
                fontColor="white"
                chartTitle={`Trends: Number of Works Over Time for ${
                  firstSelection || "Option 1"
                } vs ${secondSelection || "Option 2"}`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

function Timeline() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch genres and authors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch genres
        const genresResponse = await axios.get(
          "https://openlibrary.org/subjects/fiction.json"
        );
        const allGenres = genresResponse.data.works
          .map((work) => work.subject?.[0])
          .filter((genre) => genre);

        // Fetch authors
        const authorsResponse = await axios.get(
          "https://openlibrary.org/search.json?q=author"
        );
        const allAuthors = authorsResponse.data.docs
          .map((doc) => doc.author_name?.[0])
          .filter((author) => author);

        // Set genres and authors in state
        setGenres(allGenres);
        setAuthors(allAuthors);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get random items from an array
  const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Combine genres and authors into a single array
  const dropdownOptions = [
    ...getRandomItems(genres, 4),
    ...getRandomItems(authors, 4),
  ];

  const handleSelect = async (option) => {
    setSelectedOption(option);
    setIsLoading(true);

    try {
      // Determine if the selected option is a genre or an author
      const isGenre = genres.includes(option);
      const url = isGenre
        ? `https://openlibrary.org/subjects/${option.toLowerCase()}.json?limit=10`
        : `https://openlibrary.org/search.json?author=${encodeURIComponent(
            option
          )}&limit=10`;

      const response = await axios.get(url);
      const fetchedBooks = isGenre
        ? response.data.works.map((work) => ({
            title: work.title,
            author: work.authors?.[0]?.name || "Unknown",
            image: work.cover_id
              ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
              : "https://via.placeholder.com/150", // Fallback image
          }))
        : response.data.docs.map((doc) => ({
            title: doc.title,
            author: doc.author_name?.[0] || "Unknown",
            image: doc.cover_i
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
              : "https://via.placeholder.com/150", // Fallback image
          }));

      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <h1>Timeline: Most Popular Books</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "5vh",
              fontSize: "24px",
              color: "white",
            }}
          >
            Loading...
          </div>
        ) : (
          <Dropdown
            options={dropdownOptions}
            onSelect={handleSelect}
            placeholder="Select a genre or author"
          />
        )}
      </div>

      {selectedOption && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "20px",
          }}
        >
          {books.length > 0 ? (
            books.map((book, index) => (
              <Card
                key={index}
                title={book.title}
                author={book.author}
                image={book.image}
              />
            ))
          ) : (
            <p style={{ color: "white", fontSize: "20px" }}>
              No books found for the selected option.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
