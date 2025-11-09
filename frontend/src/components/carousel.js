import React, { useState, useEffect } from "react";

const Carousel = React.memo(({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Only set up interval if images exist and have content
    if (!images || images.length === 0) return;
    
    const interval = setInterval(() => {
      // Move the logic directly inside useEffect
      setCurrentIndex(current => 
        current === images.length - 1 ? 0 : current + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images]);

  // Don't render if no images are provided
  if (!images || images.length === 0) {
    return null;
  }

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
