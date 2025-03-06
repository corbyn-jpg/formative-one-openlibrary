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
              <Link to="/landing" style={{ textDecoration: "none", color: "black" }}>Landing</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/comparison" style={{ textDecoration: "none", color: "black" }}>Comparison</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/timeline" style={{ textDecoration: "none", color: "black" }}>Timeline</Link>
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
    backgroundColor: "#3F241D",
    color: "#fff",
    fontSize: "20px",
    height: "60px",
    borderRadius: "8px"
  },
  brand: {
    margin: 0,
  },
  dropdown: {
    position: "relative",
    fontSize: "18px",
  },
  dropdownButton: {
    backgroundColor: "#E2CCC0",
    border: "none",
    padding: "15px 20px",
    cursor: "pointer",
    fontSize: "20px",
    borderRadius: "8px",
    height: "50px"
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#E2CCC0",
    listStyle: "none",
    color: "000",
    padding: 0,
    margin: 0,
    border: "1px solid #555",
    borderRadius: "4px",
  },
  menuItem: {
    padding: "10px 15px",
    cursor: "pointer",
  },
};

export default Navbar;