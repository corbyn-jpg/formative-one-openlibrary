import React from "react";
import { Link } from "react-router-dom";
import openLibraryLogo from '../openlibrary-logo-tighter.svg';
import "../App.css"; // Ensure the CSS file is imported

function Navbar() {
  return (
    <nav style={styles.navbar}>
      {/* Logo on the left */}
      <div style={styles.logoContainer}>
        <img src={openLibraryLogo} alt="Open Library Logo" style={styles.logo} />
      </div>

      {/* Navigation links in the center */}
      <div className="links" style={styles.navLinks}>
        <Link to="/home" style={styles.link}>Home</Link>
        <Link to="/comparison" style={styles.link}>Comparison</Link>
        <Link to="/timeline" style={styles.link}>Timeline</Link>
      </div>

      {/* Search bar on the right */}
      <div style={styles.searchContainer}>
        <input type="text" placeholder="Search..." style={styles.searchInput} />
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
    borderRadius: "8px"
  },
  logoContainer: {
    flex: 0,
  },
  logo: {
    height: '50px',
    width: 'auto',
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
};

export default Navbar;