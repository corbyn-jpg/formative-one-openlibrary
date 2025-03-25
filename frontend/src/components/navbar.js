import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import openLibraryLogo from "../Assets/openlibrary-logo-tighter.svg";
import "../App.css";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    if (query) {
      setSearchQuery(decodeURIComponent(query));
    }
  }, [location.search]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      if (windowWidth <= 768) {
        setIsMenuOpen(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isMobile = windowWidth <= 768;

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#4f2319",
      color: "#fff",
      fontSize: "28px",
      minHeight: "10vh",
      borderRadius: "8px",
      margin: "1vh",
      position: "relative",
      flexWrap: "wrap",
      boxSizing: "border-box",
      width: "calc(100% - 2vh)",
    }}>
      <div style={{ flex: "0 0 auto", order: 1 }}>
        <Link to="/home" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img
            src={openLibraryLogo}
            alt="Open Library Logo"
            style={{ height: "5.5vh", minHeight: "30px", width: "auto" }}
          />
        </Link>
      </div>

      {/* Mobile menu button */}
      {isMobile && (
        <button 
          style={{ 
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            order: 4,
            padding: "8px",
            color: "#fff",
          }} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Navigation links*/}
      <div 
        className="links"
        style={{
          display: isMobile ? (isMenuOpen ? "flex" : "none") : "flex",
          flex: "1 1 auto",
          justifyContent: "center",
          gap: isMobile ? "15px" : "30px",
          order: 2,
          ...(isMobile && {
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#4f2319",
            padding: "20px",
            zIndex: 1000,
            flexDirection: "column",
            alignItems: "center",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            margin: "0 1vh",
            width: "calc(100% - 2vh)",
          })
        }}
      >
        <Link 
          to="/home" 
          style={{ 
            color: "#fff",
            textDecoration: "none",
            fontSize: "24px",
            padding: "5px 10px",
            position: "relative",
          }} 
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link 
          to="/comparison" 
          style={{ 
            color: "#fff",
            textDecoration: "none",
            fontSize: "24px",
            padding: "5px 10px",
            position: "relative",
          }} 
          onClick={() => setIsMenuOpen(false)}
        >
          Comparison
        </Link>
        <Link 
          to="/timeline" 
          style={{ 
            color: "#fff",
            textDecoration: "none",
            fontSize: "24px",
            padding: "5px 10px",
            position: "relative",
          }} 
          onClick={() => setIsMenuOpen(false)}
        >
          Timeline
        </Link>
      </div>

      {/* Search container */}
      <div 
        style={{
          display: isMobile ? (isMenuOpen ? "flex" : "none") : "flex",
          flex: "0 1 auto",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
          order: 3,
          ...(isMobile && {
            position: "absolute",
            top: "calc(100% + 180px)",
            left: "20px",
            right: "20px",
            zIndex: 1000,
            width: "calc(100% - 40px)",
            marginTop: isMenuOpen ? "20px" : "0",
          })
        }}
      >
        <input
          type="text"
          placeholder="Search books, authors..."
          style={{
            padding: "8px 12px",
            fontSize: "20px",
            border: "1px solid black",
            borderRadius: "4px",
            outline: "none",
            width: isMobile ? "100%" : "250px",
            fontFamily: "serif",
            boxSizing: "border-box",
            transition: "width 0.3s ease",
          }}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button 
          onClick={handleSearch} 
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            padding: "8px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
          }}
          aria-label="Search"
          className="search-button"
        >
          
        </button>
      </div>
    </nav>
  );
}

export default Navbar;