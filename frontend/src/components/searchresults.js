import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Card from "./card";

function SearchResults() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Extract the search query from the URL
  const query = new URLSearchParams(location.search).get("q");

  // Fetch search results from the Open Library API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            query
          )}&limit=10`
        );
        const books = response.data.docs.map((doc) => ({
          title: doc.title,
          author: doc.author_name?.[0] || "Unknown",
          image: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
            : "https://via.placeholder.com/150", // Fallback image
          description: doc.first_sentence?.[0] || "No description available.",
        }));
        setResults(books);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Search Results for "{query}"</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {results.map((book, index) => (
            <Card
              key={index}
              title={book.title}
              author={book.author}
              image={book.image}
            />
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default SearchResults;
