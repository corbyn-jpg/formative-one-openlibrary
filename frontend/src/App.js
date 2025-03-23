import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Carousel from "./components/carousel";
import heroImage from "./Assets/Hero.jpeg";
import BarChart from "./components/barchart";
import LineChart from "./components/linechart";
import StackedAreaChart from "./components/stackedarea";
import Dropdown from "./components/dropdown";
import Card from "./components/card";
import axios from "axios";
import "./App.css";

const images = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Brandon_Sanderson_-_Lucca_Comics_%26_Games_2016.jpg/428px-Brandon_Sanderson_-_Lucca_Comics_%26_Games_2016.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J._R._R._Tolkien%2C_ca._1925.jpg/220px-J._R._R._Tolkien%2C_ca._1925.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Robin_Hobb_by_Gage_Skidmore.jpg/220px-Robin_Hobb_by_Gage_Skidmore.jpg",
];
const title = ["Name"];

const genres = ["Fantasy", "Science Fiction", "Mystery"];
const authors = ["J.K. Rowling", "George R.R. Martin", "Brandon Sanderson"];

const popularBooks = {
  // Existing genre data
  Fantasy: [
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      image:
        "https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg",
      description: "The first book in the Harry Potter series.",
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      image:
        "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg",
      description: "A fantasy novel about Bilbo Baggins' adventure.",
    },
    {
      title: "A Game of Thrones",
      author: "George R.R. Martin",
      image:
        "https://upload.wikimedia.org/wikipedia/en/9/93/AGameOfThrones.jpg",
      description: "The first book in the A Song of Ice and Fire series.",
    },
  ],
  "Science Fiction": [
    {
      title: "Dune",
      author: "Frank Herbert",
      image:
        "https://upload.wikimedia.org/wikipedia/en/d/de/Dune-Frank_Herbert_%281965%29_First_edition.jpg",
      description: "A science fiction classic set in a distant future.",
    },
    {
      title: "1984",
      author: "George Orwell",
      image:
        "https://upload.wikimedia.org/wikipedia/en/5/51/1984_first_edition_cover.jpg",
      description: "A dystopian novel about totalitarianism.",
    },
    {
      title: "The Martian",
      author: "Andy Weir",
      image:
        "https://upload.wikimedia.org/wikipedia/en/c/c3/The_Martian_2014.jpg",
      description: "A story of an astronaut stranded on Mars.",
    },
  ],
  Mystery: [
    {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      image:
        "https://upload.wikimedia.org/wikipedia/en/4/4c/The_Girl_with_the_Dragon_Tattoo_Poster.jpg",
      description: "A gripping mystery novel.",
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Gone_Girl.jpg",
      description: "A psychological thriller about a missing wife.",
    },
    {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      image: "https://upload.wikimedia.org/wikipedia/en/6/6b/DaVinciCode.jpg",
      description: "A fast-paced mystery involving art and religion.",
    },
  ],

  // Simulated data for authors
  "J.K. Rowling": [
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      image:
        "https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg",
      description: "The first book in the Harry Potter series.",
    },
    {
      title: "Harry Potter and the Chamber of Secrets",
      author: "J.K. Rowling",
      image:
        "https://upload.wikimedia.org/wikipedia/en/5/5c/Harry_Potter_and_the_Chamber_of_Secrets.jpg",
      description: "The second book in the Harry Potter series.",
    },
    {
      title: "Harry Potter and the Prisoner of Azkaban",
      author: "J.K. Rowling",
      image:
        "https://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg",
      description: "The third book in the Harry Potter series.",
    },
  ],
  "George R.R. Martin": [
    {
      title: "A Game of Thrones",
      author: "George R.R. Martin",
      image:
        "https://upload.wikimedia.org/wikipedia/en/9/93/AGameOfThrones.jpg",
      description: "The first book in the A Song of Ice and Fire series.",
    },
    {
      title: "A Clash of Kings",
      author: "George R.R. Martin",
      image: "https://upload.wikimedia.org/wikipedia/en/2/2c/AClashOfKings.jpg",
      description: "The second book in the A Song of Ice and Fire series.",
    },
    {
      title: "A Storm of Swords",
      author: "George R.R. Martin",
      image: "https://upload.wikimedia.org/wikipedia/en/1/1c/ASOS.jpg",
      description: "The third book in the A Song of Ice and Fire series.",
    },
  ],
  "Brandon Sanderson": [
    {
      title: "Mistborn: The Final Empire",
      author: "Brandon Sanderson",
      image:
        "https://upload.wikimedia.org/wikipedia/en/4/4e/Mistborn_cover.jpg",
      description: "The first book in the Mistborn series.",
    },
    {
      title: "The Way of Kings",
      author: "Brandon Sanderson",
      image: "https://upload.wikimedia.org/wikipedia/en/8/8b/TheWayOfKings.png",
      description: "The first book in The Stormlight Archive series.",
    },
    {
      title: "Words of Radiance",
      author: "Brandon Sanderson",
      image:
        "https://upload.wikimedia.org/wikipedia/en/8/8f/Words_of_Radiance_US_Hardback_Cover_2014.jpg",
      description: "The second book in The Stormlight Archive series.",
    },
  ],
};

// Data for the BarChart
const barChartData = [
  { label: "Fiction", value: 120 },
  { label: "Non-Fiction", value: 85 },
  { label: "Science Fiction", value: 60 },
  { label: "Mystery", value: 90 },
  { label: "Fantasy", value: 75 },
  { label: "Romance", value: 110 },
  { label: "Thriller", value: 95 },
];

function Landing() {
  // Data for the LineChart
  const lineChartData = {
    labels: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    datasets: [
      {
        label: "Fiction Books Published",
        data: [5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600],
      },
      {
        label: "Non-Fiction Books Published",
        data: [4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100],
      },
    ],
  };

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
          <Carousel images={images} title={title} />
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
            borderColors={["rgb(144, 160, 255)", "rgb(228, 227, 145)"]}
            backgroundColors={[
              "rgba(101, 57, 160, 0.2)",
              "rgba(255, 214, 102, 0.2)",
            ]}
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
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Fetch all authors and books on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all authors
        const authorsResponse = await axios.get(
          "https://openlibrary.org/search.json?q=author"
        );
        const allAuthors = authorsResponse.data.docs
          .map((doc) => doc.author_name?.[0]) // Use optional chaining to avoid errors
          .filter((author) => author); // Filter out undefined values

        // Fetch all books
        const booksResponse = await axios.get(
          "https://openlibrary.org/search.json?q=title"
        );
        const allBooks = booksResponse.data.docs
          .map((doc) => doc.title)
          .filter((title) => title); // Filter out undefined values

        // Store all data in state
        setAuthors(allAuthors);
        setBooks(allBooks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchAllData();
  }, []); // Empty dependency array ensures this runs only on mount

  // Helper function to get random items from an array
  const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Return the first `count` items
  };

  // Combine 4 random authors and 4 random books into a single array for dropdown options
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

    // Determine the type of selection (author or title)
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
        <p>Loading...</p> // Show loading message while data is being fetched
      ) : (
        <>
          <div
            style={{
              display: "flex",
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

  const handleSelect = (option) => {
    setSelectedOption(option);
    setBooks(popularBooks[option] || []);
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
        <Dropdown
          options={genres.concat(authors)} // Combine genres and authors
          onSelect={handleSelect}
          placeholder="Select a genre or author"
        />
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
          {books.map((book, index) => (
            <Card
              key={index}
              title={book.title}
              author={book.author}
              image={book.image}
              description={book.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        padding: "20px",
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/timeline" element={<Timeline />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
