import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Carousel from "./components/carousel";
import "./App.css";
import heroImage from "./Assets/Hero.jpeg";
import BarChart from "./components/barchart";
import LineChart from "./components/linechart";
import StackedAreaChart from "./components/stackedarea";
import Dropdown from "./components/dropdown";

const images = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Brandon_Sanderson_-_Lucca_Comics_%26_Games_2016.jpg/428px-Brandon_Sanderson_-_Lucca_Comics_%26_Games_2016.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J._R._R._Tolkien%2C_ca._1925.jpg/220px-J._R._R._Tolkien%2C_ca._1925.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Robin_Hobb_by_Gage_Skidmore.jpg/220px-Robin_Hobb_by_Gage_Skidmore.jpg",
];
const title = ["Name"];

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
          <LineChart />
        </div>
        <div style={{ flex: 1 }}>
          <StackedAreaChart />
        </div>
      </div>
    </>
  );
}

function Comparison() {
  const [firstSelection, setFirstSelection] = useState(null);
  const [secondSelection, setSecondSelection] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  const authors = ["J.K. Rowling", "George R.R. Martin", "Brandon Sanderson"];
  const books = ["Harry Potter", "A Game of Thrones", "Mistborn"];
  const genres = ["Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery"];

  const handleSubmit = () => {
    if (!firstSelection || !secondSelection) {
      alert("Please select both options to compare.");
      return;
    }

    // Simulate comparison data based on selections
    const data = [
      { label: firstSelection, value: Math.random() * 100 },
      { label: secondSelection, value: Math.random() * 100 },
    ];

    setComparisonData(data);
  };

  // Dynamic chart title based on selections
  const chartTitle = `Comparison: ${firstSelection || "Option 1"} vs ${secondSelection || "Option 2"}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <h1>Compare Authors, Books, or Genres</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <Dropdown
          options={authors.concat(books).concat(genres)}
          onSelect={setFirstSelection}
          placeholder="Select first option"
        />
        <Dropdown
          options={authors.concat(books).concat(genres)}
          onSelect={setSecondSelection}
          placeholder="Select second option"
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginLeft: "10px",
          }}
        >
          Compare
        </button>
      </div>

      {comparisonData.length > 0 && (
        <div style={{ width: "50%", margin: "20px" }}>
          <BarChart
            data={comparisonData}
            backgroundColor="rgba(35, 79, 146, 0.8)"
            borderColor="rgb(144, 160, 255)"
            fontColor="white"
            chartTitle={chartTitle} // Dynamic chart title
          />
        </div>
      )}
    </div>
  );
}

function Timeline() {
  return <h1>third page</h1>;
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