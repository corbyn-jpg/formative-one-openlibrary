# Open Library Explorer

**To make all published works of humankind available to everyone globally**

<div align="center">
  <img src="https://github.com/user-attachments/assets/d5f5734c-cc27-425b-acad-cf0545f24fb2" alt="Open Library Logo">
</div>

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Documentation](#documentation)
3. [Built With](#built-with)
4. [Getting Started](#getting-started)
5. [Features](#features)
6. [Concept Process](#concept-process)
7. [Development Highlights](#development-highlights)
8. [Final Outcome](#final-outcome)
9. [Roadmap](#roadmap)
10. [License](#license)
11. [Contact](#contact)

---

## About the Project

### Description
Open Library Explorer is an interactive data visualization platform that leverages the Open Library API to compare books, authors, and genres. Designed for bibliophiles, researchers, and casual readers, it offers:

- **Trend Analysis**: Publishing trends via line/stacked charts
- **Comparative Tools**: Side-by-side author/book comparisons
- **Timeline Explorer**: Popular books by genre/year

---

## Documentation

### Technical Description
Application Purpose: Open Library Explorer is a React-based data visualization application that helps users explore and compare book data from the Open Library API. It provides insights into publishing trends, author comparisons, and genre popularity over time.

#### Key Features
- Interactive charts (Line, Bar) showing publishing trends
- Book and author comparison tools
- Timeline explorer for genre/year analysis
- Responsive design with mobile-first approach

#### API Used: Open Library API (https://openlibrary.org/developers/api)
- Provides access to book metadata, author information, and cover images
- Rate-limited public API with JSON responses

#### Visualization Types:
- Line charts for trend analysis over time
- Bar charts for comparison views
- Stacked charts for genre distribution

#### Limitations:
- API has rate limits (unauthenticated requests limited)
- Data completeness depends on Open Library's coverage
- Mobile responsiveness still in development

### Entity-Relationship (ER) Diagram
<div align="center">
  <img src="https://github.com/your-username/your-repo/blob/main/documentation/ER.png?raw=true" alt="ER Diagram">
  <p><em>Entity Relationship Diagram for the Library System</em></p>
</div>
This diagram represents the frontend data model derived from the Open Library API responses. Books are central entities connected to authors, genres, and publication years. The application maintains this structure in its state management.

<div align="center">
### Use Case Diagram

```mermaid
%% Library System Use Case Diagram
useCaseDiagram
    actor User as "Library User"
    
    rectangle "Library Analytics System" {
        (View Publishing Trends) as trend
        (Compare Authors/Books) as compare
        (Explore by Genre/Year) as explore
        (Search Book Metadata) as search
        (Toggle Chart Types) as toggle
        (Filter Data) as filter

        User --> trend
        User --> compare
        User --> explore
        User --> search

        trend ..> toggle : extends
        explore ..> filter : extends
    }
```
<p><em>How users interact with Open Library Explorer's visualization features</em></p>
</div>
#### Key Features:
- View Book Trends: Access line charts showing publishing trends
- Compare Authors: Side-by-side visualization of author productivity
- Explore by Genre: Filter books by genre and publication year
- Search Books: Find specific books by title/author

### Data Flow Diagram (DFD)
<img src="https://github.com/your-username/your-repo/blob/main/documentation/DFD.png?raw=true">
#### Data Flow Process:
1. User interacts with UI components (filters, buttons)
2. Application checks for cached API responses
3. If no cache, fetches fresh data from Open Library API
4. Transforms raw API data into chart-compatible formats
5. Updates React state with processed data
6. Re-renders Chart.js visualizations
6. Displays updated charts to user

<div align="center">

### Component Architecture
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#51352C'}}}%%
componentDiagram
    component App {
        [React Router]
    }
    
    component API_Service {
        [Axios Instance]
        [Data Cache]
    }
    
    component Pages {
        component HomePage
        component ComparisonPage
        component TimelinePage
    }
    
    App --> Pages
    Pages --> HomePage
    HomePage --> (TrendCharts)
    API_Service --> OpenLibraryAPI[(Open Library API)]
```
<p><em>React component structure and data flow</em></p>
</div>
#### Key Components:
- App: Root component with routing
- Router: Handles page navigation
- Page Components: Home, Comparison, Timeline pages
- ChartWrapper: Shared component for all Chart.js integrations
- Visualization Components: Specific chart types with custom configurations

## Built With

| Category       | Technologies                          |
|----------------|---------------------------------------|
| Frontend       | React, Chart.js, Axios                |
| Styling        | CSS Modules, Flexbox/Grid             |
| Routing        | React Router                         |
| API            | [Open Library API](https://openlibrary.org/developers/api) |

---

## Getting Started

### Prerequisites
- Node.js ≥ v16

### Installation
1. Clone the repository:
```bash
git clone https://github.com/corbyn-jpg/formative-one-openlibrary.git
```
2. Install dependencies:
```bash
npm install
```
   
3. Start the dev server:
```bash
npm start
```

## Features
### Home Page
<div align="center"> <img src="https://github.com/user-attachments/assets/4c111c7a-04fe-4c9b-95f0-585f5119b66e" alt="Home Page"> 
   <p><em>Interactive charts (bar/line) and a book carousel</em></p> </div>

### Comparison Page
<div align="center"> <img src="https://github.com/user-attachments/assets/87167a99-0550-4125-9ddd-7d901abd2d05" alt="Comparison Page"> 
   <p><em>Compare authors/books with dynamic visualizations</em></p> </div>

### Timeline Page
<div align="center"> <img src="https://github.com/user-attachments/assets/da13584d-6fd8-4e01-a5e1-43fd4bf4811d" alt="Timeline Page"> 
   <p><em>Filter books by genre/author and find their best books</em></p> </div>
   
## Concept Process
### Ideation
- **Goal:** Simplify complex literary data into digestible visuals.

- **Colour Palette:**

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Primary Colour 1 | ![#Primary1](https://github.com/user-attachments/assets/80d6131f-42e8-424f-8f82-f733decb1b45) <em>#C19A84</em> |
| Primary Colour 2 | ![Primary2](https://github.com/user-attachments/assets/d4c413d8-b04e-41b6-beb8-02ce304ea4b3) <em>#51352C</em> |
| Secondary Colour | ![Secondary](https://github.com/user-attachments/assets/f9fb6174-6d8d-4948-9446-658e9526c6fe) <em>#4bc089</em> | 
| Accent Colour | ![Accent](https://github.com/user-attachments/assets/f406d3b3-249b-4f88-aaad-6e13c9acb027) <em>#fff</em> |

- **Typography:** Serif fonts (e.g., Georgia) for readability and matching the theme.

### Wireframes
<em>Mid-fidelity mockups of the dashboard layout.</em>

<div align="center"> <p><em>Mid-fidelity mockups of the dashboard layout</em></p> 
   <img src="https://github.com/user-attachments/assets/7564b90e-9bd5-40da-a007-469b341afedf" alt="Home Wireframe"> 
   <img src="https://github.com/user-attachments/assets/ad49d183-881f-4274-bdea-87f05701703c" alt="Comparison Wireframe"> 
   <img src="https://github.com/user-attachments/assets/105fafb1-9e6a-4fe9-9480-6ff66dd72a48" alt="Timeline Wireframe"> </div>


## Development Hightlights
### Highlights
**Successfully integrated the Open Library API with multiple endpoints to deliver:**

- Detailed book metadata (titles, authors, publication years)

- Genre statistics and publishing trends

- High-quality cover images

**Designed a clean, accessible interface featuring:**

- Earthy color palette for a "library" aesthetic

- Responsive layouts for all device sizes

- Clear visual hierarchy for easy navigatio

**Implemented robust search functionality with:**

- Real-time results from Open Library's database

- Filterable book cards with key details

- Visual previews of cover artwork

### Challenges
- **API Rate Limits:** Implemented caching for frequent queries and implemented a loading screen for everything to mount.

  ![Loading](https://github.com/user-attachments/assets/0132f3c2-5708-4a5f-a946-ccc57f98c0f5)

- **Chart Customization:** Tailored Chart.js for literary datasets.

## Final Outcome
### Mockup
<div align="center"> <img src="https://github.com/user-attachments/assets/bafe3a76-7540-423b-b4a9-9ea0fe24feb0" alt="Final Mockup"> </div>

### Live Demo

- [Deployed Link](http://localhost:3001/home) (<em>Currently Offline</em>)

## Roadmap
- Add mobile responsiveness.

- Integrate Goodreads API for reviews.

## License
Distributed under the MIT License. See [LICENSE](./LICENSE) for details.  

> **Note**: Book data is provided by [Open Library](https://openlibrary.org), a non-profit project under its own [terms](https://openlibrary.org/terms).

## Contact
- Corbyn Robinson - 241040@virtualwindow.com
- Open Library Explorer - https://github.com/corbyn-jpg/formative-one-openlibrary.git

## Acknowledgements
- [![Open Library API](https://img.shields.io/badge/Powered_by-Open_Library-ff69b4?logo=openlibrary)](https://openlibrary.org/developers/api) for their free API.

- [![Chart.js](https://img.shields.io/badge/Visualization-Chart.js-FF6384?logo=chart.js)](https://www.chartjs.org) for visualization tools.

