import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Comparison from "./pages/comparisons";
import Timeline from "./pages/timeline";
import SearchResults from "./components/searchresults";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 120px)" }}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;