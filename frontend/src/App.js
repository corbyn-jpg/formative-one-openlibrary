import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Carousel from "./components/carousel";
/*import Card from "./components/card";
import Accordion from "./components/accordion";
import Form from "./components/form";*/
import "./App.css";
import heroImage from "./Assets/Hero.jpeg";
import BarChart from "./components/barchart";
import LineChart from "./components/linechart";
import StackedAreaChart from "./components/stackedarea";

const images = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Brandon_Sanderson_-_Lucca_Comics_%26_Games_2016.jpg/428px-Brandon_Sanderson_-_Lucca_Comics_%26_Games_2016.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J._R._R._Tolkien%2C_ca._1925.jpg/220px-J._R._R._Tolkien%2C_ca._1925.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Robin_Hobb_by_Gage_Skidmore.jpg/220px-Robin_Hobb_by_Gage_Skidmore.jpg",
];
const title = ["Name"];

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
          <BarChart />
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
  return <h1>second page</h1>;
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
