import React from "react";

const Card = ({ title, author, image }) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(193, 154, 132, 0.9)",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "16px",
        width: "250px",
        minWidth: "200px",
        maxWidth: "300px",
        textAlign: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      }}
    >
      <img
        src={image}
        alt={title}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/200x300?text=No+Cover";
        }}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <h3
        style={{
          margin: "10px 0",
          fontSize: "18px",
          color: "#fff",
          fontWeight: "bold",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          minHeight: "44px",
          lineHeight: "1.4",
        }}
        title={title}
      >
        {title}
      </h3>
      <p
        style={{
          margin: "5px 0 0 0",
          fontSize: "16px",
          color: "#2a1810",
          fontStyle: "italic",
        }}
      >
        by {author}
      </p>
    </div>
  );
};

export default Card;
