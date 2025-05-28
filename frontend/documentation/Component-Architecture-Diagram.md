```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#C19A84'}}}%%
componentDiagram
    component App {
        component Router
    }
    
    component Router {
        component HomePage
        component ComparisonPage
        component TimelinePage
    }
    
    component HomePage {
        component BookCarousel
        component TrendCharts
    }
    
    component ComparisonPage {
        component AuthorComparison
        component BookComparison
    }
    
    component TimelinePage {
        component GenreFilter
        component YearSlider
        component TimelineChart
    }
    
    component ChartWrapper {
        component LineChart
        component BarChart
        component StackedChart
    }
    
    App --> Router
    Router --> HomePage
    Router --> ComparisonPage
    Router --> TimelinePage
    
    HomePage --> BookCarousel
    HomePage --> TrendCharts
    ComparisonPage --> AuthorComparison
    ComparisonPage --> BookComparison
    TimelinePage --> GenreFilter
    TimelinePage --> YearSlider
    TimelinePage --> TimelineChart
    
    TrendCharts --> ChartWrapper
    AuthorComparison --> ChartWrapper
    BookComparison --> ChartWrapper
    TimelineChart --> ChartWrapper
    
    ChartWrapper --> LineChart
    ChartWrapper --> BarChart
    ChartWrapper --> StackedChart
```