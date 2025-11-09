import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Card from "./card";
import { LoadingState, CardSkeleton } from "./LoadingComponents";

function SearchResults() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Extract the search query from the URL
  const query = new URLSearchParams(location.search).get("q");

  // Fetch search results from the Open Library API
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            query
          )}&limit=12`
        );
        
        if (response.data && response.data.docs) {
          const books = response.data.docs.map((doc) => ({
            title: doc.title || "Unknown Title",
            author: doc.author_name?.[0] || "Unknown Author",
            image: doc.cover_i
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
              : "https://via.placeholder.com/200x300?text=No+Cover", // Better fallback image
            description: doc.first_sentence?.[0] || "No description available.",
          }));
          setResults(books);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to search for books. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleRetry = () => {
    if (query) {
      setError(null);
      setIsLoading(true);
      // Re-trigger the useEffect by changing a dependency
      const fetchResults = async () => {
        try {
          const response = await axios.get(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(
              query
            )}&limit=12`
          );
          
          if (response.data && response.data.docs) {
            const books = response.data.docs.map((doc) => ({
              title: doc.title || "Unknown Title",
              author: doc.author_name?.[0] || "Unknown Author",
              image: doc.cover_i
                ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                : "https://via.placeholder.com/200x300?text=No+Cover",
              description: doc.first_sentence?.[0] || "No description available.",
            }));
            setResults(books);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          setError("Failed to search for books. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchResults();
    }
  };

  if (!query) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
        <h1>Search Books</h1>
        <p style={{ fontSize: "18px", marginTop: "20px" }}>
          Enter a search term in the navigation bar to find books.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", minHeight: "70vh" }}>
      <h1 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>
        Search Results for "{query}"
      </h1>
      
      {error ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            color: "white",
            textAlign: "center"
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(81, 53, 44, 0.8)",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "400px"
            }}
          >
            <h3 style={{ color: "#ff6b6b", marginBottom: "15px" }}>
              Search Failed
            </h3>
            <p style={{ marginBottom: "20px" }}>{error}</p>
            <button
              onClick={handleRetry}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4bc089",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontFamily: "serif"
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <>
          <p style={{ 
            color: "white", 
            textAlign: "center", 
            marginBottom: "30px",
            fontSize: "18px"
          }}>
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
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
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            color: "white",
            textAlign: "center"
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(81, 53, 44, 0.8)",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "400px"
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>No Results Found</h3>
            <p style={{ marginBottom: "20px" }}>
              No books found for "{query}". Try searching with different keywords.
            </p>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4bc089",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontFamily: "serif"
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
