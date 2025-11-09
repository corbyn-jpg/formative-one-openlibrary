import React, { useState, useEffect } from "react";
import Dropdown from "../components/dropdown";
import { LoadingState } from "../components/LoadingComponents";
import axios from "axios";

function Timeline() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingTimeline, setIsFetchingTimeline] = useState(false);
  const [error, setError] = useState(null);

  // Fetch authors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsResponse = await axios.get(
          "https://openlibrary.org/search.json?q=author&limit=100"
        );
        const allAuthors = authorsResponse.data.docs
          .map((doc) => doc.author_name?.[0])
          .filter((author) => author);

        setAuthors(allAuthors);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load authors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const dropdownOptions = getRandomItems(authors, 8);

  const handleSelect = async (author) => {
    setSelectedOption(author);
    setIsFetchingTimeline(true);
    setError(null);

    try {
      const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(
        author
      )}&limit=50&fields=title,author_name,first_publish_year,cover_i`;
      const response = await axios.get(url);

      // Filter books with publication years and sort chronologically
      const booksWithYears = response.data.docs
        .filter((doc) => doc.first_publish_year && doc.title)
        .map((doc) => ({
          title: doc.title,
          author: doc.author_name?.[0] || author,
          year: doc.first_publish_year,
          image: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : null,
        }))
        .sort((a, b) => a.year - b.year);

      // Group books by decade for better visualization
      const groupedByDecade = booksWithYears.reduce((acc, book) => {
        const decade = Math.floor(book.year / 10) * 10;
        if (!acc[decade]) {
          acc[decade] = [];
        }
        acc[decade].push(book);
        return acc;
      }, {});

      setTimelineData(groupedByDecade);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load timeline data");
    } finally {
      setIsFetchingTimeline(false);
    }
  };

  return (
    <div style={{ 
      margin: "40px auto", 
      maxWidth: "1400px", 
      padding: "0 30px 60px 30px",
      minHeight: "calc(100vh - 200px)",
    }}>
      <h1 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontSize: "2.5rem" }}>
        Publication Timeline
      </h1>
      <p style={{ 
        textAlign: "center", 
        color: "rgba(255, 255, 255, 0.8)", 
        marginBottom: "50px", 
        fontSize: "18px",
        maxWidth: "700px",
        margin: "0 auto 50px auto",
        lineHeight: "1.6"
      }}>
        Select an author to explore their literary journey through time
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "60px",
        }}
      >
        {isLoading ? (
          <LoadingState type="spinner" message="Loading authors..." height="100px" />
        ) : (
          <Dropdown
            options={dropdownOptions}
            onSelect={handleSelect}
            placeholder="Select an author to view timeline"
          />
        )}
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "rgba(255, 107, 107, 0.2)",
            color: "white",
            padding: "25px",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "30px",
            border: "2px solid rgba(255, 107, 107, 0.4)",
          }}
        >
          {error}
        </div>
      )}

      {/* Container with fixed minimum height to prevent background shift */}
      <div style={{ minHeight: "400px" }}>
        {isFetchingTimeline && (
          <LoadingState type="spinner" message="Loading timeline..." height="400px" />
        )}

        {!isFetchingTimeline && selectedOption && Object.keys(timelineData).length > 0 && (
          <div style={{ position: "relative" }}>
            {/* Timeline header */}
            <div
              style={{
                backgroundColor: "rgba(81, 53, 44, 0.8)",
                padding: "30px",
                borderRadius: "12px",
                marginBottom: "40px",
                textAlign: "center",
                color: "white",
              }}
            >
              <h2 style={{ margin: "0 0 15px 0", fontSize: "2rem" }}>
                {selectedOption}'s Publication Timeline
              </h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: "18px" }}>
                {Object.values(timelineData).flat().length} books from{" "}
                {Math.min(...Object.keys(timelineData).map(Number))} to{" "}
                {Math.max(...Object.keys(timelineData).map(Number))}s
              </p>
            </div>

            {/* Vertical timeline */}
            <div style={{ position: "relative", paddingLeft: "80px" }}>
              {/* Timeline line */}
              <div
                style={{
                  position: "absolute",
                  left: "40px",
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: "linear-gradient(to bottom, #4bc089, #90a0ff)",
                  borderRadius: "2px",
                }}
              />

              {Object.entries(timelineData)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([decade, books], index) => (
                  <div key={decade} style={{ marginBottom: "60px", position: "relative" }}>
                    {/* Decade marker */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-80px",
                        top: "10px",
                        width: "90px",
                        height: "90px",
                        backgroundColor: "#4bc089",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "20px",
                        border: "5px solid #2a1810",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
                        zIndex: 2,
                      }}
                    >
                      {decade}s
                    </div>

                    {/* Books in this decade */}
                    <div
                      style={{
                        backgroundColor: "rgba(81, 53, 44, 0.6)",
                        padding: "30px",
                        borderRadius: "12px",
                        marginLeft: "50px",
                        border: "2px solid rgba(144, 160, 255, 0.3)",
                      }}
                    >
                      <h3
                        style={{
                          color: "#90a0ff",
                          marginTop: 0,
                          marginBottom: "25px",
                          fontSize: "24px",
                        }}
                      >
                        {decade}s Era ({books.length} book{books.length !== 1 ? "s" : ""})
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                          gap: "20px",
                        }}
                      >
                        {books.slice(0, 8).map((book, bookIndex) => (
                          <div
                            key={bookIndex}
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              padding: "20px",
                              borderRadius: "8px",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-5px)";
                              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
                              e.currentTarget.style.borderColor = "#4bc089";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                            }}
                          >
                            {book.image && (
                              <img
                                src={book.image}
                                alt={book.title}
                                style={{
                                  width: "100%",
                                  height: "180px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  marginBottom: "12px",
                                }}
                              />
                            )}
                            <div style={{ color: "white" }}>
                              <div
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                  marginBottom: "8px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  minHeight: "45px",
                                }}
                                title={book.title}
                              >
                                {book.title}
                              </div>
                              <div
                                style={{
                                  fontSize: "18px",
                                  color: "#4bc089",
                                  fontWeight: "bold",
                                }}
                              >
                                {book.year}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {books.length > 8 && (
                        <div
                          style={{
                            marginTop: "20px",
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: "15px",
                            textAlign: "center",
                          }}
                        >
                          + {books.length - 8} more book{books.length - 8 !== 1 ? "s" : ""} from this era
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!isFetchingTimeline &&
          selectedOption &&
          Object.keys(timelineData).length === 0 && (
            <div
              style={{
                backgroundColor: "rgba(81, 53, 44, 0.8)",
                padding: "50px",
                borderRadius: "12px",
                textAlign: "center",
                color: "white",
              }}
            >
              <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>No Timeline Data Available</h3>
              <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
                No books with publication years found for {selectedOption}.
                <br />
                Try selecting a different author.
              </p>
            </div>
          )}

        {!selectedOption && !isLoading && !isFetchingTimeline && (
          <div
            style={{
              backgroundColor: "rgba(81, 53, 44, 0.8)",
              padding: "80px 50px",
              borderRadius: "12px",
              textAlign: "center",
              color: "white",
            }}
          >
            <h2 style={{ marginBottom: "25px", fontSize: "2rem" }}>Explore Literary History</h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8", maxWidth: "700px", margin: "0 auto" }}>
              Select an author from the dropdown above to visualize their publication
              timeline. See how their works have evolved across decades and explore their
              literary journey through time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timeline;