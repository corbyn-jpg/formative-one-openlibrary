import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import openLibraryLogo from "../openlibrary-logo-tighter.svg";
import "../App.css";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear the search input
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img
          src={openLibraryLogo}
          alt="Open Library Logo"
          style={styles.logo}
        />
      </div>

      <div className="links" style={styles.navLinks}>
        <Link to="/home" style={styles.link}>
          Home
        </Link>
        <Link to="/comparison" style={styles.link}>
          Comparison
        </Link>
        <Link to="/timeline" style={styles.link}>
          Timeline
        </Link>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          🔍
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 50px",
    backgroundColor: "#4f2319",
    color: "#fff",
    fontSize: "28px",
    height: "70px",
    borderRadius: "8px",
    margin: "1vh"
  },
  logoContainer: {
    flex: 0,
  },
  logo: {
    height: "50px",
    width: "auto",
  },
  navLinks: {
    display: "flex",
    flex: 6,
    justifyContent: "center",
    gap: "50px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "22px",
  },
  searchContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
  },
  searchInput: {
    padding: "10px",
    fontSize: "18px",
    border: "1px solid black",
    borderRadius: "4px",
    outline: "none",
    width: "200px",
    fontFamily: "serif",
  },
  searchButton: {
    padding: "10px 15px",
    backgroundColor: "#4bc089",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Navbar;
