flowchart TD
    subgraph Layout
        L[Root Layout]
    end
    L --> B[Sign-In Page]
    L --> C[Sign-Up Page]
    L --> F[Dashboard Page]
    B --> D[Submit Sign-In]
    C --> D[Submit Sign-Up]
    D --> E[Auth API Route]
    E -- Success --> F
    E -- Failure --> G[Show Auth Error]
    F --> H[Fetch Airdrop Data]
    H --> I[Display Dashboard Metrics]