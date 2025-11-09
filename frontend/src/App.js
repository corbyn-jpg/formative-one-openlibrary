import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Comparison from "./pages/comparisons";
import Timeline from "./pages/timeline";
import SearchResults from "./components/searchresults";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function App() {
  return (
    <div className="App">
      <ErrorBoundary errorMessage="The application failed to load. Please refresh the page.">
        <Router>
          <ErrorBoundary errorMessage="Navigation failed to load.">
            <Navbar />
          </ErrorBoundary>
          <Routes>
            <Route index element={
              <ErrorBoundary errorMessage="Home page failed to load.">
                <Home />
              </ErrorBoundary>
            } />
            <Route path="/home" element={
              <ErrorBoundary errorMessage="Home page failed to load.">
                <Home />
              </ErrorBoundary>
            } />
            <Route path="/comparison" element={
              <ErrorBoundary errorMessage="Comparison page failed to load.">
                <Comparison />
              </ErrorBoundary>
            } />
            <Route path="/timeline" element={
              <ErrorBoundary errorMessage="Timeline page failed to load.">
                <Timeline />
              </ErrorBoundary>
            } />
            <Route path="/search" element={
              <ErrorBoundary errorMessage="Search results failed to load.">
                <SearchResults />
              </ErrorBoundary>
            } />
          </Routes>
          <ErrorBoundary errorMessage="Footer failed to load.">
            <Footer />
          </ErrorBoundary>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;