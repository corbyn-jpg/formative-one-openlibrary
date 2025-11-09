import React, { useState } from "react";

const Dropdown = ({ options = [], onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div style={styles.dropdown}>
      <button style={styles.dropdownToggle} onClick={toggleDropdown}>
        {selectedOption || placeholder}
      </button>
      {isOpen && (
        <ul style={styles.dropdownMenu}>
          {options.map((option, index) => (
            <li
              key={index}
              style={{
                ...styles.dropdownItem,
                ...(selectedOption === option ? styles.dropdownItemHover : {}),
              }}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#4bc089";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                if (selectedOption !== option) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#2a1810";
                }
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  dropdown: {
    position: "relative",
    display: "inline-block",
    margin: "10px",
  },
  dropdownToggle: {
    backgroundColor: "#4f2319",
    minWidth: "280px",
    maxWidth: "400px",
    color: "#fff",
    textAlign: "center",
    padding: "12px 24px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "18px",
    fontFamily: "serif",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: "0",
    right: "0",
    backgroundColor: "rgba(193, 154, 132, 0.95)",
    backdropFilter: "blur(10px)",
    fontSize: "16px",
    boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
    zIndex: "1000",
    listStyleType: "none",
    padding: "8px 0",
    margin: "0",
    borderRadius: "8px",
    maxHeight: "300px",
    overflowY: "auto",
    border: "2px solid rgba(255, 255, 255, 0.2)",
  },
  dropdownItem: {
    padding: "12px 20px",
    cursor: "pointer",
    color: "#2a1810",
    transition: "background-color 0.2s ease",
    fontFamily: "serif",
  },
  dropdownItemHover: {
    backgroundColor: "#4bc089",
    color: "#fff",
  },
};

export default Dropdown;
