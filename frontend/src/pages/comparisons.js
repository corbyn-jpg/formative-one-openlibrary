import React, { useState, useEffect } from "react";
import BarChart from "../components/barchart";
import LineChart from "../components/linechart";
import Dropdown from "../components/dropdown";
import axios from "axios";

const Comparison = () => {
  const [firstSelection, setFirstSelection] = useState(null);
  const [secondSelection, setSecondSelection] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [authorsResponse, booksResponse] = await Promise.all([
          axios.get("https://openlibrary.org/search.json?q=author&limit=100"),
          axios.get("https://openlibrary.org/search.json?q=title&limit=100"),
        ]);

        const allAuthors = [...new Set(authorsResponse.data.docs
          .map((doc) => doc.author_name?.[0])
          .filter((author) => author)
        )].slice(0, 50);

        const allBooks = [...new Set(booksResponse.data.docs
          .map((doc) => doc.title)
          .filter((title) => title)
        )].slice(0, 50);

        setAuthors(allAuthors);
        setBooks(allBooks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const dropdownOptions = [
    ...getRandomItems(authors, 6),
    ...getRandomItems(books, 6),
  ];

  const fetchData = async (query, type) => {
    try {
      const url = type === "author" 
        ? `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}`
        : `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
      
      const response = await axios.get(url);
      return response.data.numFound || 0;
    } catch (error) {
      console.error("Error fetching data:", error);
      return 0;
    }
  };

  const fetchHistoricalData = async (query, type) => {
    const years = [1900, 1920, 1940, 1960, 1980, 2000, 2010, 2020];
    const data = await Promise.all(
      years.map(async (year) => {
        try {
          const url = type === "author"
            ? `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}&published_in=${year}`
            : `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&published_in=${year}`;

          const response = await axios.get(url);
          return { year, count: response.data.numFound || 0 };
        } catch (error) {
          return { year, count: 0 };
        }
      })
    );

    const filteredData = data.filter((item) => item.count > 0);
    return {
      labels: filteredData.map((item) => item.year),
      data: filteredData.map((item) => item.count),
    };
  };

  const handleSubmit = async () => {
    if (!firstSelection || !secondSelection) {
      alert("Please select both options to compare.");
      return;
    }

    setIsComparing(true);

    const firstType = authors.includes(firstSelection) ? "author" : "title";
    const secondType = authors.includes(secondSelection) ? "author" : "title";

    const [firstData, secondData, firstHistoricalData, secondHistoricalData] = await Promise.all([
      fetchData(firstSelection, firstType),
      fetchData(secondSelection, secondType),
      fetchHistoricalData(firstSelection, firstType),
      fetchHistoricalData(secondSelection, secondType),
    ]);

    setComparisonData([
      { label: firstSelection, value: firstData },
      { label: secondSelection, value: secondData },
    ]);

    // Combine years from both datasets for consistent x-axis
    const allYears = [...new Set([
      ...firstHistoricalData.labels,
      ...secondHistoricalData.labels
    ])].sort();

    setLineChartData({
      labels: allYears,
      datasets: [
        {
          label: firstSelection,
          data: allYears.map(year => {
            const index = firstHistoricalData.labels.indexOf(year);
            return index !== -1 ? firstHistoricalData.data[index] : 0;
          }),
          borderColor: "rgb(144, 160, 255)",
          backgroundColor: "rgba(101, 57, 160, 0.2)",
          fill: false,
        },
        {
          label: secondSelection,
          data: allYears.map(year => {
            const index = secondHistoricalData.labels.indexOf(year);
            return index !== -1 ? secondHistoricalData.data[index] : 0;
          }),
          borderColor: "rgb(228, 227, 145)",
          backgroundColor: "rgba(255, 214, 102, 0.2)",
          fill: false,
        },
      ],
    });

    setIsComparing(false);
  };

  return (
    <div className="page-container">
      <h1>Compare Authors or Books</h1>
      
      <div className="comparison-controls">
        <Dropdown
          options={dropdownOptions}
          onSelect={setFirstSelection}
          placeholder="Select first option"
        />
        <Dropdown
          options={dropdownOptions}
          onSelect={setSecondSelection}
          placeholder="Select second option"
        />
        <button
          onClick={handleSubmit}
          disabled={isComparing}
          className="compare-button"
        >
          {isComparing ? "Comparing..." : "Compare"}
        </button>
      </div>

      {isComparing && (
        <div className="loading-message">Fetching comparison data...</div>
      )}

      {comparisonData.length > 0 && !isComparing && (
        <div className="chart-section">
          <BarChart
            data={comparisonData}
            backgroundColor="rgba(35, 79, 146, 0.8)"
            borderColor="rgb(144, 160, 255)"
            fontColor="white"
            chartTitle={`Works Comparison: ${firstSelection} vs ${secondSelection}`}
          />
        </div>
      )}

      {lineChartData.labels.length > 0 && !isComparing && (
        <div className="chart-section">
          <LineChart
            data={lineChartData}
            borderColors={["rgb(144, 160, 255)", "rgb(228, 227, 145)"]}
            backgroundColors={[
              "rgba(101, 57, 160, 0.2)",
              "rgba(255, 214, 102, 0.2)",
            ]}
            fontColor="white"
            chartTitle={`Publication Trends Over Time`}
          />
        </div>
      )}
    </div>
  );
};

export default Comparison;