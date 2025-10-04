import React, { useState, useEffect } from "react";

const Carousel = React.memo(({ images, title, slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Move the logic directly inside useEffect
      setCurrentIndex(current => 
        current === slides.length - 1 ? 0 : current + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={styles.carousel}>
        <img
          src={images[currentIndex]}
          alt="slide"
          style={styles.image}
          loading="lazy" // Lazy load images
        />
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
  title: {
    color: "white",
  },
};

export default Carousel;
