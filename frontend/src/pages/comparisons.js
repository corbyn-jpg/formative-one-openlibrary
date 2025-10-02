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
  const [stackedBarData, setStackedBarData] = useState({ 
    labels: [], 
    datasets: [] 
  });
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);

  // Fetch all authors on component mount
  useEffect(() => {
    const fetchAllData = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Helper function to get random items from an array
  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Use only authors for dropdown
  const dropdownOptions = getRandomItems(authors, 8);

  // Fetch data from the Open Library API for authors only
  const fetchData = async (author) => {
    try {
      const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`;
      const response = await axios.get(url);
      return response.data.numFound || 0;
    } catch (error) {
      console.error("Error fetching data:", error);
      return 0;
    }
  };

  // Fetch historical data for the line chart for authors only
  const fetchHistoricalData = async (author) => {
    const years = [1900, 1920, 1940, 1960, 1980, 2000, 2020];
    const data = await Promise.all(
      years.map(async (year) => {
        const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&published_in=${year}`;
        try {
          const response = await axios.get(url);
          return { year, count: response.data.numFound || 0 };
        } catch (error) {
          console.error("Error fetching historical data:", error);
          return { year, count: 0 };
        }
      })
    );

    // Filter out years with no data
    const filteredData = data.filter((item) => item.count > 0);
    return {
      labels: filteredData.map((item) => item.year),
      data: filteredData.map((item) => item.count),
    };
  };

  // Fetch genre data for authors
  const fetchGenreData = async (author) => {
    const genres = ["fiction", "science", "history", "biography", "romance"];
    const genreData = await Promise.all(
      genres.map(async (genre) => {
        try {
          const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&subject=${genre}`;
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
      alert("Please select both authors to compare.");
      return;
    }

    setIsComparing(true);

    try {
      // Fetch data for both authors
      const [firstData, secondData, firstHistoricalData, secondHistoricalData, firstGenreData, secondGenreData] = await Promise.all([
        fetchData(firstSelection),
        fetchData(secondSelection),
        fetchHistoricalData(firstSelection),
        fetchHistoricalData(secondSelection),
        fetchGenreData(firstSelection),
        fetchGenreData(secondSelection)
      ]);

      // Bar Chart Data
      setComparisonData([
        { label: firstSelection, value: firstData },
        { label: secondSelection, value: secondData },
      ]);

      // Line Chart Data - Combine years from both datasets
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
            fill: true,
          },
          {
            label: secondSelection,
            data: allYears.map(year => {
              const index = secondHistoricalData.labels.indexOf(year);
              return index !== -1 ? secondHistoricalData.data[index] : 0;
            }),
            borderColor: "rgb(228, 227, 145)",
            backgroundColor: "rgba(255, 214, 102, 0.2)",
            fill: true,
          },
        ],
      });

      // Pie Chart Data - First author's genre distribution
      setPieChartData(firstGenreData);

      // Stacked Bar Chart Data - Genre comparison
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
            backgroundColor: "rgba(35, 79, 146, 0.8)",
            borderColor: "rgb(144, 160, 255)",
            borderWidth: 1,
          },
          {
            label: secondSelection,
            data: allGenres.map(genre => {
              const found = secondGenreData.find(g => g.label === genre);
              return found ? found.value : 0;
            }),
            backgroundColor: "rgba(75, 192, 137, 0.8)",
            borderColor: "rgb(75, 192, 137)",
            borderWidth: 1,
          },
        ],
      });

    } catch (error) {
      console.error("Error in comparison:", error);
    } finally {
      setIsComparing(false);
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
      <h1>Compare Authors</h1>
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
        <>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "white",
              justifyContent: "center",
              alignItems: "center",
              margin: "20px",
              gap: "20px",
            }}
          >
            <Dropdown
              options={dropdownOptions}
              onSelect={setFirstSelection}
              placeholder="Select first author"
            />
            <Dropdown
              options={dropdownOptions}
              onSelect={setSecondSelection}
              placeholder="Select second author"
            />
            <button
              onClick={handleSubmit}
              disabled={isComparing}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4bc089",
                color: "white",
                fontFamily: "serif",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              {isComparing ? "Comparing..." : "Compare"}
            </button>
          </div>

          {/* Bar Chart - Total Works Comparison */}
          {comparisonData.length > 0 && (
            <div style={{ width: "80%", margin: "20px" }}>
              <BarChart
                data={comparisonData}
                backgroundColor={["rgba(35, 79, 146, 0.8)", "rgba(75, 192, 137, 0.8)"]}
                borderColor={["rgb(144, 160, 255)", "rgb(75, 192, 137)"]}
                fontColor="white"
                chartTitle={`Number of Works for ${firstSelection} vs ${secondSelection}`}
              />
            </div>
          )}

          {/* Line Chart - Historical Trends */}
          {lineChartData.labels.length > 0 && (
            <div style={{ width: "80%", margin: "20px" }}>
              <LineChart
                data={lineChartData}
                borderColors={["rgb(144, 160, 255)", "rgb(228, 227, 145)"]}
                backgroundColors={[
                  "rgba(101, 57, 160, 0.2)",
                  "rgba(255, 214, 102, 0.2)",
                ]}
                fontColor="white"
                chartTitle={`Publication Trends: ${firstSelection} vs ${secondSelection}`}
              />
            </div>
          )}

          {/* Pie Chart and Stacked Bar Chart Side by Side */}
          {(pieChartData.length > 0 || stackedBarData.labels.length > 0) && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "80%",
                margin: "20px",
                gap: "20px",
              }}
            >
              {/* Pie Chart - First Author's Genre Distribution */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    textAlign: "center",
                    color: "white",
                    marginBottom: "20px",
                  }}
                >
                  Genre Distribution - {firstSelection}
                </h3>
                {pieChartData.length > 0 ? (
                  <div style={{ height: "55vh" }}>
                    <PieChart
                      data={pieChartData}
                      backgroundColors={[
                        "rgba(144, 160, 255, 0.8)",
                        "rgba(75, 192, 137, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
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
                      height: "55vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No genre data available for {firstSelection}
                  </div>
                )}
              </div>

              {/* Stacked Bar Chart - Genre Comparison */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    textAlign: "center",
                    color: "white",
                    marginBottom: "20px",
                  }}
                >
                  Genre Comparison
                </h3>
                {stackedBarData.labels.length > 0 ? (
                  <div style={{ height: "55vh" }}>
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
                      height: "55vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No genre comparison data available
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary Metrics */}
          {comparisonData.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "80%",
                margin: "20px",
                backgroundColor: "rgba(81, 53, 44, 0.8)",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <div style={{ textAlign: "center", color: "white" }}>
                <h3>{firstSelection}</h3>
                <p style={{ fontSize: "24px", margin: "10px 0" }}>{comparisonData[0]?.value.toLocaleString()}</p>
                <p>Total Works</p>
              </div>
              <div style={{ textAlign: "center", color: "white" }}>
                <h3>{secondSelection}</h3>
                <p style={{ fontSize: "24px", margin: "10px 0" }}>{comparisonData[1]?.value.toLocaleString()}</p>
                <p>Total Works</p>
              </div>
              <div style={{ textAlign: "center", color: "white" }}>
                <h3>Difference</h3>
                <p style={{ fontSize: "24px", margin: "10px 0", color: "#4bc089" }}>
                  {Math.abs(comparisonData[0]?.value - comparisonData[1]?.value).toLocaleString()}
                </p>
                <p>
                  {comparisonData[0]?.value > comparisonData[1]?.value 
                    ? `${firstSelection} leads by` 
                    : `${secondSelection} leads by`
                  }
                </p>
              </div>
            </div>
          )}

          {!firstSelection && !secondSelection && !isComparing && (
            <div style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
              <p>Select two authors from the dropdown menus to compare their works and publication trends.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comparison;