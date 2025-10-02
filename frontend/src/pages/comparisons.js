import React, { useState, useEffect } from "react";
import BarChart from "../components/barchart";
import LineChart from "../components/linechart";
import PieChart from "../components/piechart";
import StackedBarChart from "../components/stackedbarchart";
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
  const [pieChartData, setPieChartData] = useState([]);
  const [stackedBarData, setStackedBarData] = useState({ labels: [], datasets: [] });
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
    ...getRandomItems(authors, 8),
    ...getRandomItems(books, 8),
  ];

  const fetchData = async (query, type) => {
    try {
      const url = type === "author" 
        ? `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}`
        : `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
      
      const response = await axios.get(url);
      return {
        total: response.data.numFound || 0,
        works: response.data.docs.slice(0, 10) || []
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { total: 0, works: [] };
    }
  };

  const fetchHistoricalData = async (query, type) => {
    const decades = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    const data = await Promise.all(
      decades.map(async (decade) => {
        try {
          const url = type === "author"
            ? `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}&published_in=${decade}`
            : `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&published_in=${decade}`;

          const response = await axios.get(url);
          return { decade, count: response.data.numFound || 0 };
        } catch (error) {
          return { decade, count: 0 };
        }
      })
    );

    const filteredData = data.filter((item) => item.count > 0);
    return {
      labels: filteredData.map((item) => item.decade),
      data: filteredData.map((item) => item.count),
    };
  };

  const fetchGenreData = async (query, type) => {
    const genres = ["fiction", "science", "history", "biography", "romance", "mystery"];
    const genreData = await Promise.all(
      genres.map(async (genre) => {
        try {
          const url = type === "author"
            ? `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}&subject=${genre}`
            : `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&subject=${genre}`;

          const response = await axios.get(url);
          return {
            label: genre.charAt(0).toUpperCase() + genre.slice(1),
            value: response.data.numFound || 0,
          };
        } catch (error) {
          return {
            label: genre.charAt(0).toUpperCase() + genre.slice(1),
            value: 0,
          };
        }
      })
    );
    return genreData.filter(item => item.value > 0);
  };

  const handleSubmit = async () => {
    if (!firstSelection || !secondSelection) {
      alert("Please select both options to compare.");
      return;
    }

    setIsComparing(true);

    const firstType = authors.includes(firstSelection) ? "author" : "title";
    const secondType = authors.includes(secondSelection) ? "author" : "title";

    // Fetch all data in parallel
    const [
      firstData,
      secondData,
      firstHistoricalData,
      secondHistoricalData,
      firstGenreData,
      secondGenreData
    ] = await Promise.all([
      fetchData(firstSelection, firstType),
      fetchData(secondSelection, secondType),
      fetchHistoricalData(firstSelection, firstType),
      fetchHistoricalData(secondSelection, secondType),
      fetchGenreData(firstSelection, firstType),
      fetchGenreData(secondSelection, secondType)
    ]);

    // 1. Bar Chart - Total Works Comparison
    setComparisonData([
      { label: firstSelection, value: firstData.total },
      { label: secondSelection, value: secondData.total },
    ]);

    // 2. Line Chart - Historical Trends
    const allDecades = [...new Set([
      ...firstHistoricalData.labels,
      ...secondHistoricalData.labels
    ])].sort();

    setLineChartData({
      labels: allDecades,
      datasets: [
        {
          label: firstSelection,
          data: allDecades.map(decade => {
            const index = firstHistoricalData.labels.indexOf(decade);
            return index !== -1 ? firstHistoricalData.data[index] : 0;
          }),
          borderColor: "rgb(144, 160, 255)",
          backgroundColor: "rgba(101, 57, 160, 0.2)",
          fill: false,
          tension: 0.4,
        },
        {
          label: secondSelection,
          data: allDecades.map(decade => {
            const index = secondHistoricalData.labels.indexOf(decade);
            return index !== -1 ? secondHistoricalData.data[index] : 0;
          }),
          borderColor: "rgb(228, 227, 145)",
          backgroundColor: "rgba(255, 214, 102, 0.2)",
          fill: false,
          tension: 0.4,
        },
      ],
    });

    // 3. Pie Chart - Genre Distribution for First Selection
    setPieChartData(firstGenreData);

    // 4. Stacked Bar Chart - Genre Comparison
    const allGenres = [...new Set([
      ...firstGenreData.map(g => g.label),
      ...secondGenreData.map(g => g.label)
    ])];

    setStackedBarData({
      labels: allGenres,
      datasets: [
        {
          label: firstSelection,
          data: allGenres.map(genre => {
            const found = firstGenreData.find(g => g.label === genre);
            return found ? found.value : 0;
          }),
          backgroundColor: "rgba(144, 160, 255, 0.8)",
          borderColor: "rgb(144, 160, 255)",
          borderWidth: 1,
        },
        {
          label: secondSelection,
          data: allGenres.map(genre => {
            const found = secondGenreData.find(g => g.label === genre);
            return found ? found.value : 0;
          }),
          backgroundColor: "rgba(228, 227, 145, 0.8)",
          borderColor: "rgb(228, 227, 145)",
          borderWidth: 1,
        },
      ],
    });

    setIsComparing(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "24px",
          color: "white",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <h1>Compare Authors or Books</h1>
      
      {/* Comparison Controls */}
      <div className="row justify-content-center w-100 mb-4">
        <div className="col-md-4 mb-2">
          <Dropdown
            options={dropdownOptions}
            onSelect={setFirstSelection}
            placeholder="Select first option"
          />
        </div>
        <div className="col-md-4 mb-2">
          <Dropdown
            options={dropdownOptions}
            onSelect={setSecondSelection}
            placeholder="Select second option"
          />
        </div>
        <div className="col-md-2 mb-2 d-flex align-items-end">
          <button
            onClick={handleSubmit}
            disabled={isComparing || !firstSelection || !secondSelection}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4bc089",
              color: "white",
              fontFamily: "serif",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "20px",
              width: "100%",
            }}
          >
            {isComparing ? "Comparing..." : "Compare"}
          </button>
        </div>
      </div>

      {isComparing && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10vh",
            fontSize: "20px",
            color: "white",
          }}
        >
          Fetching comparison data...
        </div>
      )}

      {comparisonData.length > 0 && !isComparing && (
        <>
          {/* Graph 1: Bar Chart - Total Works Comparison */}
          <div className="row w-100 mb-4">
            <div className="col-12">
              <div style={{ width: "100%", margin: "20px 0" }}>
                <BarChart
                  data={comparisonData}
                  backgroundColor={["rgba(35, 79, 146, 0.8)", "rgba(75, 192, 137, 0.8)"]}
                  borderColor={["rgb(144, 160, 255)", "rgb(75, 192, 137)"]}
                  fontColor="white"
                  chartTitle={`Number of Works: ${firstSelection} vs ${secondSelection}`}
                />
              </div>
            </div>
          </div>

          {/* Graph 2: Line Chart - Historical Trends */}
          <div className="row w-100 mb-4">
            <div className="col-12">
              <div style={{ width: "100%", margin: "20px 0" }}>
                <LineChart
                  data={lineChartData}
                  borderColors={["rgb(144, 160, 255)", "rgb(228, 227, 145)"]}
                  backgroundColors={[
                    "rgba(101, 57, 160, 0.2)",
                    "rgba(255, 214, 102, 0.2)",
                  ]}
                  fontColor="white"
                  chartTitle={`Publication Trends Over Time: ${firstSelection} vs ${secondSelection}`}
                />
              </div>
            </div>
          </div>

          {/* Graphs 3 & 4: Pie Chart and Stacked Bar Chart */}
          <div className="row w-100">
            {/* Pie Chart */}
            <div className="col-md-6 mb-4">
              <div style={{ width: "100%", margin: "20px 0" }}>
                <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px" }}>
                  Genre Distribution - {firstSelection}
                </h3>
                {pieChartData.length > 0 ? (
                  <div style={{ height: "400px" }}>
                    <PieChart
                      data={pieChartData}
                      backgroundColors={[
                        "rgba(255, 99, 132, 0.8)",
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
                        "rgba(75, 192, 192, 0.8)",
                        "rgba(153, 102, 255, 0.8)",
                        "rgba(255, 159, 64, 0.8)",
                      ]}
                      fontColor="white"
                      chartTitle="Works by Genre"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "rgba(81, 53, 44, 0.8)",
                      padding: "40px",
                      borderRadius: "8px",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    No genre data available for {firstSelection}
                  </div>
                )}
              </div>
            </div>

            {/* Stacked Bar Chart */}
            <div className="col-md-6 mb-4">
              <div style={{ width: "100%", margin: "20px 0" }}>
                <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px" }}>
                  Genre Comparison
                </h3>
                {stackedBarData.labels.length > 0 ? (
                  <div style={{ height: "400px" }}>
                    <StackedBarChart
                      data={stackedBarData}
                      fontColor="white"
                      chartTitle="Works by Genre"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "rgba(81, 53, 44, 0.8)",
                      padding: "40px",
                      borderRadius: "8px",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    No genre comparison data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="row w-100 mt-4">
            <div className="col-12">
              <div
                style={{
                  backgroundColor: "rgba(81, 53, 44, 0.8)",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ color: "white", marginBottom: "20px" }}>Comparison Summary</h3>
                <div className="row">
                  <div className="col-md-4">
                    <h4 style={{ color: "#4bc089" }}>{firstSelection}</h4>
                    <p style={{ fontSize: "24px", color: "white", margin: "0" }}>
                      {comparisonData[0]?.value.toLocaleString()} works
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h4 style={{ color: "#4bc089" }}>{secondSelection}</h4>
                    <p style={{ fontSize: "24px", color: "white", margin: "0" }}>
                      {comparisonData[1]?.value.toLocaleString()} works
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h4 style={{ color: "#4bc089" }}>Difference</h4>
                    <p style={{ fontSize: "24px", color: "white", margin: "0" }}>
                      {Math.abs(comparisonData[0]?.value - comparisonData[1]?.value).toLocaleString()} works
                    </p>
                    <small style={{ color: "#ccc" }}>
                      {comparisonData[0]?.value > comparisonData[1]?.value 
                        ? `${firstSelection} has more works` 
                        : `${secondSelection} has more works`
                      }
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!isComparing && comparisonData.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "white",
            marginTop: "40px",
          }}
        >
          <h3>Select two authors or books to compare</h3>
          <p>Choose from the dropdown menus above to see detailed comparisons</p>
        </div>
      )}
    </div>
  );
};

export default Comparison;