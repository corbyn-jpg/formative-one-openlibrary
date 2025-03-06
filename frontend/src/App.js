import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
/*import Carousel from "./components/carousel";
import Card from "./components/card";
import Accordion from "./components/accordion";
import Form from "./components/form";*/
import "./App.css";


function Landing(){
  return (
    <h1>first page</h1>
  )
}

function Comparison(){
  return (
    <h1>second page</h1>
  )
}

function Timeline(){
  return (
    <h1>third page</h1>
  )
}



function App() {
  return (
    <div className="App" style={{ minHeight: "100vh", backgroundColor: "#f0f0f0", padding: "20px" }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/timeline" element={<Timeline />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
