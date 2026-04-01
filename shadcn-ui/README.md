# Pokémon TCG Collection Manager

A modern, feature-rich React application for browsing, searching, and managing your Pokémon Trading Card Game collection. Built with React, Vite, Tailwind CSS, and shadcn/ui components.

## 🎯 Features

- **Card Browsing**: Browse Pokémon trading cards organized by set, sorted by release date (newest first)
- **Smart Search**: Search cards by name with real-time results and grouping by set
- **Pokédex Integration**: Browse all 1,025 Pokémon with sprite images and filter by name or ID
- **Per-Pokémon Card View**: See all card variations for a specific Pokémon with sorting options
- **Collection Tracking**: Add cards to your personal collection or wish list (chase list)
- **Local Persistence**: All data stored locally in browser - no account needed
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Fast & Cached**: API responses cached in memory and localStorage for optimal performance

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Key Features & How They Work](#key-features--how-they-work)
- [API Integration](#api-integration)
- [Local Storage](#local-storage)
- [Development](#development)
- [Building](#building)
- [Project Architecture](#project-architecture)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8.10.0 or higher (or use npm/yarn)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd shadcn-ui
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   The app will open at `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend Framework
- **React 19**: Modern UI library
- **Vite**: Lightning-fast build tool and dev server
- **TypeScript**: Type-safe development

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom animations
- **shadcn/ui**: High-quality, accessible component library
- **Radix UI**: Headless component primitives
- **Lucide React**: Beautiful icon library

### State Management & Storage
- **Zustand**: Lightweight state management
- **localStorage**: Browser-based persistence for collection and wishlist
- **React Router DOM**: Client-side routing

### Data & API
- **TCGdex API**: Card and set information
- **PokeAPI**: Pokédex data and sprites
- **Custom Caching**: Memory + localStorage caching for performance

### Form & Validation
- **React Hook Form**: Efficient form handling
- **Zod**: Runtime type validation

### Animations & UX
- **Framer Motion**: Advanced animations
- **Tailwindcss-animate**: Smooth CSS animations
- **Sonner**: Toast notifications

### Additional Libraries
- **recharts**: Data visualization
- **react-resizable-panels**: Resizable layout components
- **date-fns**: Date manipulation
- **uuid**: Unique ID generation

## 📁 Project Structure

```
shadcn-ui/
├── src/
│   ├── App.tsx                    # Main router and provider setup
│   ├── App.css                    # App-level styles
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles & theme variables
│   ├── vite-env.d.ts              # Vite type definitions
│   │
│   ├── components/
│   │   ├── CardModal.tsx          # Card detail modal
│   │   ├── Navbar.tsx             # Navigation bar
│   │   ├── PokemonCard.tsx        # Card display component
│   │   └── ui/                    # shadcn/ui components
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── tabs.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── skeleton.tsx
│   │       └── ... (40+ UI components)
│   │
│   ├── lib/
│   │   ├── pokemon.ts             # API integration & caching
│   │   ├── store.ts               # Wishlist & collection state
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   │
│   ├── hooks/
│   │   ├── use-toast.ts           # Toast notifications hook
│   │   └── use-mobile.tsx         # Mobile detection hook
│   │
│   └── pages/
│       ├── Index.tsx              # Home - browse cards by set
│       ├── Pokedex.tsx            # Pokédex browser
│       ├── PokemonCards.tsx       # Per-Pokémon card view
│       ├── Wishlist.tsx           # Collection & chase list
│       └── NotFound.tsx           # 404 page
│
├── public/
│   ├── robots.txt
│   ├── assets/
│   └── images/
│
├── index.html                     # HTML entry point
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
├── tsconfig.app.json              # App TypeScript config
├── tsconfig.node.json             # Build tools TypeScript config
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint rules
├── components.json                # shadcn/ui configuration
└── pnpm-lock.yaml                 # Dependency lock file
```

## 🎮 Key Features & How They Work

### 1. **Home Page (Browse Mode)**
**File**: `src/pages/Index.tsx`

- Displays cards grouped by set, sorted by newest release date first
- Automatically loads complete sets (unlike search mode)
- Supports pagination with "Load More" button
- Can be filtered by set using dropdown
- Search queries show ungrouped results

**Key Features**:
- Set-based grouping for better organization
- API caching (5 minutes) to reduce calls
- Responsive grid layout (1-5 columns depending on screen size)
- Set headers with series and card count

### 2. **Card Search**
**File**: `src/pages/Index.tsx`

- Search cards by name in real-time
- Results are automatically grouped by set
- Supports set filtering alongside search
- Shows all matching cards without pagination limits

**Behavior**:
- Browse mode: Loads full sets by release date
- Search mode: Queries cards directly, groups by set
- Filter mode: Both search and set filter work together

### 3. **Pokédex Browser**
**File**: `src/pages/Pokedex.tsx`

- Grid of all 1,025 Pokémon with official sprites
- Search by Pokémon name or Pokédex number
- Click any Pokémon to see all their card variants
- Fetches from PokeAPI with caching

### 4. **Per-Pokémon Card View**
**File**: `src/pages/PokemonCards.tsx`

- Shows all trading card variations for a specific Pokémon
- Multiple sorting options:
  - **Release Date**: Newest first (default)
  - **Rarity**: Rarest first
  - **Alphabetical**: A-Z by card name
  - **Card Number**: By card number in set

- Optional set filtering to narrow results
- Breadcrumb navigation back to Pokédex

### 5. **Collection Management**
**File**: `src/lib/store.ts` & `src/pages/Wishlist.tsx`

- Two separate tracking systems:
  - **Chase List (Wishlist)**: Cards you want to collect
  - **Collection**: Cards you already own
- Persistent storage in localStorage
- Toast notifications on add/remove
- View as tabbed interface

### 6. **Card Detail Modal**
**File**: `src/components/CardModal.tsx`

- Click any card to see details
- Shows:
  - High-quality card image
  - Card name and set information
  - HP, types, rarity
  - Illustrator and card number
  - Pokédex numbers (if applicable)
- Quick-add buttons for collection/wishlist

## 🔌 API Integration

### **TCGdex API**
Primary source for Pokémon Trading Cards

**Endpoints Used**:
- `/sets` - Browse all card sets with pagination
- `/cards` - Search and filter cards
- `/cards/{id}` - Get specific card details

**Features**:
- Card images in two resolutions (small/large)
- Complete card metadata (rarity, illustrator, etc.)
- Set information and hierarchy
- Normalized date formats

**Pagination**:
- Home/Browse: `pageSize=1` (full sets)
- Search: `pageSize=20` (card search)
- Pokémon Cards: `pageSize=50` (per-Pokémon)

### **PokeAPI**
Pokédex data source

**Endpoints**:
- `/pokemon?limit=1025&offset=0` - Get all Pokémon names
- Image sprites sourced from official repositories

**Caching**:
- 5-minute TTL for both APIs
- In-memory cache
- localStorage backup for persistence

## 💾 Local Storage

All user data stored in browser localStorage with keys:

| Key | Purpose | Persistence | Format |
|-----|---------|-------------|--------|
| `pokemon-tcg-wishlist` | Chase list | ♾️ Indefinite | JSON array of PokemonCard objects |
| `pokemon-tcg-collection` | Owned cards | ♾️ Indefinite | JSON array of PokemonCard objects |
| `pokemon_tcg_sets_cache_v2` | Sets metadata (for dropdown) | 24 hours | JSON with timestamp |
| `pokemon_tcg_api_cache:v3:*` | API responses | 5 minutes | JSON with timestamp |

**Important Notes**:
- ✅ **Your saved cards (collection & wishlist) persist forever** - they are never deleted automatically
- ⏰ Only the **sets list** (for the set filter dropdown) and **API responses** are cached with TTLs
- 🔄 Caches are only refreshed when expired - your data is never affected
- 🌐 No cloud sync - all data is stored locally in your browser
- 🗑️ To delete all data: Clear browser localStorage or press Ctrl/Cmd + Shift + Delete

## 🔧 Development

### Available Scripts

**Development Server**:
```bash
pnpm dev
```
Starts Vite dev server with hot module replacement (HMR), usually on `http://localhost:5173`

**Linting**:
```bash
pnpm lint
```
Runs ESLint with quiet output to check code quality

**Build**:
```bash
pnpm build
```
Creates optimized production build in `dist/` folder

**Preview**:
```bash
pnpm preview
```
Serves the production build locally for testing

### Code Style & Quality

- **ESLint**: Configured for React and React Hooks
- **Type Safety**: TypeScript enabled with strict options disabled for flexibility
- **Formatting**: Tailwind classes use `cn()` utility for merging

## 🏗️ Building

### Production Build

```bash
pnpm build
```

Creates optimized output:
- Minified JavaScript and CSS
- Code splitting for route-based bundles
- Asset optimization
- Source maps (optional)

**Output**: `dist/` directory ready for deployment

### Deployment Options

- **Vercel**: Zero-config deployment (recommended for Vite)
- **Netlify**: Drag & drop or git integration
- **GitHub Pages**: Branch deployment with proper base path
- **Traditional Hosting**: Serve `dist/` folder as static content

## 🏛️ Project Architecture

### Component Hierarchy

```
App (Router)
├── Navbar
├── Routes
│   ├── Index (Home/Browse)
│   ├── Pokedex
│   ├── PokemonCards
│   ├── Wishlist
│   └── NotFound
└── CardModal (Global)
```

### Data Flow

1. **User Action** → Component
2. **Component** → API/Storage via lib functions
3. **lib/pokemon.ts** → Handle caching & normalization
4. **lib/store.ts** → Manage local persistence
5. **Component** → Update UI with results

### Caching Strategy

```
Request
  ↓
Check Memory Cache (5min TTL)
  ↓ Miss
Check localStorage (5min TTL)
  ↓ Miss
Fetch from API
  ↓
Store in Memory + localStorage
  ↓
Return to Component
```

## 📝 Notes & Best Practices

### Performance
- API responses cached for 5 minutes to minimize calls
- localStorage used for larger datasets (sets cache: 24h)
- Lazy loading of images via Tailwind's object-fit
- Efficient grid layouts with CSS Grid

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES2020+ support
- localStorage required for full functionality

### Error Handling
- User-friendly error messages for API failures
- Fallback to cached data when available
- Toast notifications for user feedback
- Graceful degradation if API is temporarily unavailable

## 🎨 Styling

- **Color Scheme**: Rose/Pink gradient theme
- **Responsive**: Mobile-first design, 5 breakpoints (sm, md, lg, xl, 2xl)
- **Animations**: Subtle fades, card hovers, smooth transitions
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.


## 📞 Support

For issues or questions:
1. Check the project structure and how components work
2. Review the API documentation in `src/lib/pokemon.ts`
3. Check browser console for error messages
4. Review localStorage contents for debugging

---

Built with ❤️ for Pokémon TCG enthusiasts
