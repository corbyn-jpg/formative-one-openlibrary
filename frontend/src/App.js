import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Comparison from "./pages/comparison";
import Timeline from "./pages/timeline";
import SearchResults from "./pages/searchresults";
import Graphs from "./pages/graphs";
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
            <Route path="/graphs" element={<Graphs />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;