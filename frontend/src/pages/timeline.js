import React, { useState, useEffect } from "react";
import Card from "../components/card";
import Dropdown from "../components/dropdown";
import axios from "axios";

function Timeline() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch authors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch authors only
        const authorsResponse = await axios.get(
          "https://openlibrary.org/search.json?q=author&limit=100"
        );
        const allAuthors = authorsResponse.data.docs
          .map((doc) => doc.author_name?.[0])
          .filter((author) => author);

        // Set authors in state
        setAuthors(allAuthors);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get random items from an array
  const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Use only authors for dropdown
  const dropdownOptions = getRandomItems(authors, 8);

  const handleSelect = async (author) => {
    setSelectedOption(author);
    setIsLoading(true);

    try {
      // Fetch books by author
      const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&limit=10`;
      const response = await axios.get(url);
      
      const fetchedBooks = response.data.docs.map((doc) => ({
        title: doc.title,
        author: doc.author_name?.[0] || "Unknown",
        image: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          : "https://via.placeholder.com/150",
      }));

      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <h1>Timeline: Books by Author</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "5vh",
              fontSize: "24px",
              color: "white",
            }}
          >
            Loading...
          </div>
        ) : (
          <Dropdown
            options={dropdownOptions}
            onSelect={handleSelect}
            placeholder="Select an author"
          />
        )}
      </div>

      {selectedOption && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "20px",
            gap: "20px",
          }}
        >
          {books.length > 0 ? (
            books.map((book, index) => (
              <Card
                key={index}
                title={book.title}
                author={book.author}
                image={book.image}
              />
            ))
          ) : (
            <p style={{ color: "white", fontSize: "20px" }}>
              No books found for the selected author.
            </p>
          )}
        </div>
      )}

      {!selectedOption && !isLoading && (
        <div style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
          <p>Select an author from the dropdown to view their books.</p>
        </div>
      )}
    </div>
  );
}

export default Timeline;