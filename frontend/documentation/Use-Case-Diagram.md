```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#C19A84'}}}%%
useCaseDiagram
    actor User as "Library User"
    actor Admin as "System Admin"
    
    User --> (View Book Trends)
    User --> (Compare Authors)
    User --> (Explore by Genre)
    User --> (Search Books)
    
    Admin --> (Monitor API Usage)
    Admin --> (Update Cache)
    
    note right of User: All users can interact with\nthe visualization features
    note left of Admin: Administrative functions\nfor maintenance
```