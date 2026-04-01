# Project Summary
The Pokémon TCG Collection Manager is a React app for browsing Pokémon card sets, searching cards, exploring the Pokédex, and tracking a local wishlist and collection.

# Main Behavior
- **Home Browse Mode**: Loads complete sets from newest to oldest.
- **Search and Filters**: Queries cards directly and groups results by set when appropriate.
- **Pokédex**: Uses PokeAPI names and sprites, then links into per-Pokémon card pages.
- **Card Details**: Opens a modal with larger imagery and metadata.
- **Local Persistence**: Stores wishlist, collection, and short-lived API cache entries in the browser.

# Directory Tree
```
shadcn-ui/
├── README.md                  # Project documentation
├── index.html                 # Main HTML file
├── package.json               # Project metadata and dependencies
├── public/                    # Public assets
│   ├── favicon.svg            # Favicon for the application
├── src/                       # Source files
│   ├── App.tsx                # Main application component
│   ├── components/            # UI components
│   ├── lib/                   # Utility functions and data management
│   ├── pages/                 # Application pages
│   ├── Pokedex.tsx            # Page displaying the Pokédex
│   ├── PokemonCards.tsx       # Page displaying cards for a specific Pokémon
│   └── index.css              # Global styles
├── vite.config.ts             # Vite configuration
```

# Key Files
- **src/App.tsx**: Main application component that sets up routing and context providers.
- **src/pages/Index.tsx**: Home page browsing, grouping, and load-more behavior.
- **src/pages/Pokedex.tsx**: Pokédex grid and search.
- **src/pages/PokemonCards.tsx**: Per-Pokémon card view with sorting and optional set filter.
- **src/lib/pokemon.ts**: API normalization, caching, resilient hydration, and newest-set browsing.
- **src/lib/store.ts**: Wishlist and collection persistence.

# Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
- **State Management**: Zustand for state management and LocalStorage for wishlist and collection persistence
- **API**: TCGdex for card and set data, plus PokeAPI for Pokédex data

# Notes
- API responses are cached in memory and `localStorage` for 5 minutes.
- The home page behaves differently from search mode on purpose: it pages by full sets, not by raw card count.

# Usage
To set up the project, follow these steps:
1. Install dependencies:
   ```
   pnpm install
   ```
2. Run linting:
   ```
   pnpm run lint
   ```
3. Build the project:
   ```
   pnpm run build
   ```
