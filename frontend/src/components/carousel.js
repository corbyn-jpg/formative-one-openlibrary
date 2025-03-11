import React, { useState } from "react";

const Carousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={styles.carousel}>
        <button onClick={prevSlide} style={styles.button}>
          &lt;
        </button>
        <img src={images[currentIndex]} alt="slide" style={styles.image} />
        <button onClick={nextSlide} style={styles.button}>
          &gt;
        </button>
      </div>
      <h1 style={styles.title}>{title}</h1>
    </div>
  );
};

const styles = {
  carousel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "350px",
    height: "45vh",
    margin: "0 15px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  button: {
    backgroundColor: "#4f2319",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px",
    cursor: "pointer",
    width: "50px",
    height: "50px"
  },
  title: {
    color: "white"
  }
};

export default Carousel;