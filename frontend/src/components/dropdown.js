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
    width: "15vw",
    color: "#fff",
    textAlign: "center",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "20px",
    fontFamily: "serif",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "#C19A84",
    width: "15vw",
    minWidth: "160px",
    fontSize: "20px",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    zIndex: "1",
    listStyleType: "none",
    padding: "0",
    margin: "0",
    borderRadius: "4px",
  },
  dropdownItem: {
    padding: "12px 16px",
    cursor: "pointer",
    color: "#000",
  },
  dropdownItemHover: {
    backgroundColor: "#4bc089",
  },
};

export default Dropdown;
