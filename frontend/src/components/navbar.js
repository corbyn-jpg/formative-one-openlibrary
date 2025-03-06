import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.brand}>Open Library</h1>
      <div style={styles.dropdown}>
        <button onClick={toggleDropdown} style={styles.dropdownButton}>
          Menu
        </button>
        {isOpen && (
          <ul style={styles.dropdownMenu}>
            <li style={styles.menuItem}>
              <Link to="/landing" style={{ textDecoration: "none", color: "white" }}>Landing</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/comparison" style={{ textDecoration: "none", color: "white" }}>Comparison</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/timeline" style={{ textDecoration: "none", color: "white" }}>Timeline</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
    fontSize: "20px"
  },
  brand: {
    margin: 0,
  },
  dropdown: {
    position: "relative",
    fontSize: "18px",
  },
  dropdownButton: {
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "20px"
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#444",
    listStyle: "none",
    padding: 0,
    margin: 0,
    border: "1px solid #555",
    color: "fff"
  },
  menuItem: {
    padding: "10px 15px",
    cursor: "pointer",
  },
};

export default Navbar;