import React from "react";

const Card = ({ title, author, image }) => {
  return (
    <div
      style={{
        backgroundColor: "#C19A84",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        width: "26vw",
        height: "75vh",
        margin: "10px",
        textAlign: "center",
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          width: "100%",
          height: "65vh",
          objectFit: "fit",
          borderRadius: "8px",
        }}
      />
      <h3 style={{ margin: "10px 0", fontSize: "24px", color: "#fff" }}>
        {title}
      </h3>
      <p style={{ margin: "5px 0", fontSize: "20px", color: "#636363" }}>
        by {author}
      </p>
    </div>
  );
};

export default Card;
