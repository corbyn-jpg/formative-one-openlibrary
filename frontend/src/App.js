import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
/*import Carousel from "./components/carousel";
import Card from "./components/card";
import Accordion from "./components/accordion";
import Form from "./components/form";*/
import "./App.css";
import heroImage from "./Assets/Hero.jpeg";

function Landing() {
  return (
    <div
      className="hero-image"
      style={{
        backgroundImage: `linear-gradient(to right, #C19A84 40%, rgba(245, 230, 218, 0) 100%), url(${heroImage})`,
      }}
    >
      <div class="hero-text">
        <h1>Open Library Explorer</h1>
        <p>
          Open Library Explorer helps users compare books, authors, and genres
          using data from the Open Library API. Easily analyze trends, view top
          books, and explore literary timelines through interactive charts and
          visualizations. Perfect for readers, researchers, and book enthusiasts
          looking to dive deeper into the world of literature.
        </p>
      </div>
    </div>
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
          <Route path="/home" element={<Landing />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/timeline" element={<Timeline />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
