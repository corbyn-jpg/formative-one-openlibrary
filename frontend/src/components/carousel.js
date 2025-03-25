import React, { useState, useEffect } from "react";

const Carousel = React.memo(({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-rotate the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={styles.carousel}>
        <button onClick={prevSlide} style={styles.button}>
          &lt;
        </button>
        <img
          src={images[currentIndex]}
          alt="slide"
          style={styles.image}
          loading="lazy" // Lazy load images
        />
        <button onClick={nextSlide} style={styles.button}>
          &gt;
        </button>
      </div>
      <h1 style={styles.title}>{title}</h1>
    </div>
  );
});

const styles = {
  carousel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "20vw",
    height: "50vh",
    margin: "0 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    objectFit: "fit",
  },
  button: {
    backgroundColor: "#4f2319",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px",
    cursor: "pointer",
    width: "50px",
    height: "50px",
  },
  title: {
    color: "white",
  },
};

export default Carousel;
