import { useState, useEffect } from 'react';
import { searchCards, PokemonCard as PokemonCardType, getSets, SetInfo } from '@/lib/pokemon';
import { PokemonCard } from '@/components/PokemonCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SETS_CACHE_KEY = 'pokemon_tcg_sets_cache_v2';
const SETS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface GroupedCards {
  setId: string;
  setName: string;
  series: string;
  cards: PokemonCardType[];
}

function formatSetLabel(set: SetInfo) {
  return set.series ? `${set.name} (${set.series})` : set.name;
}

export default function Index() {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState<PokemonCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sets, setSets] = useState<SetInfo[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [setsLoading, setSetsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadSets = async () => {
      try {
        setSetsLoading(true);
        
        // Check cache first
        const cached = localStorage.getItem(SETS_CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < SETS_CACHE_DURATION) {
            setSets(data);
            setSetsLoading(false);
            return;
          }
        }
        
        // Fetch fresh data
        const response = await getSets();
        setSets(response.data);
        
        // Cache the results
        localStorage.setItem(SETS_CACHE_KEY, JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Failed to load sets:', error);
        // Don't show error for sets, it's not critical
      } finally {
        setSetsLoading(false);
      }
    };

    loadSets();
  }, []);

  const fetchCards = async (reset = false, searchQuery = query, setFilter = selectedSet) => {
    try {
      setLoading(true);
      setApiError(null); // Clear any previous errors
      const currentPage = reset ? 1 : page;
      const response = await searchCards(searchQuery, currentPage, setFilter || undefined);
      const isBrowsingLatestSets = !searchQuery && !setFilter;
      
      if (reset) {
        setCards(response.data);
        setPage(2);
      } else {
        setCards(prev => [...prev, ...response.data]);
        setPage(currentPage + 1);
      }
      
      setHasMore(isBrowsingLatestSets ? response.data.length > 0 : response.data.length === response.pageSize);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Set a user-friendly error message
      if (errorMessage.includes('Failed to fetch')) {
        setApiError('Unable to connect to the card database service. It may be temporarily down or rate-limited. Please try again in a few minutes.');
      } else {
        setApiError('Failed to load cards from the card database service. Please try again later.');
      }
      
      toast.error('Failed to load cards', {
        description: 'The card database service is currently unavailable.'
      });
      
      // If this is initial load, set empty cards array
      if (reset) {
        setCards([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load initial cards on mount
  useEffect(() => {
    fetchCards(true, '', '');
  }, []);

  // Reload cards when selectedSet changes
  useEffect(() => {
    if (selectedSet) {
      fetchCards(true, query, selectedSet);
    }
  }, [selectedSet]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCards(true, query, selectedSet);
  };

  const handleClearSet = () => {
    setSelectedSet('');
    // Reload cards without filter
    fetchCards(true, query, '');
  };

  const handleLoadMore = () => {
    fetchCards(false, query, selectedSet);
  };

  const handleRetry = () => {
    fetchCards(true, query, selectedSet);
  };

  // Group cards by set only when no search query is active
  const groupedCards: GroupedCards[] = !query ? cards.reduce((acc, card) => {
    const existingGroup = acc.find(g => g.setId === card.set.id);
    if (existingGroup) {
      existingGroup.cards.push(card);
    } else {
      acc.push({
        setId: card.set.id,
        setName: card.set.name,
        series: card.set.series,
        cards: [card]
      });
    }
    return acc;
  }, [] as GroupedCards[]) : [];

  const shouldGroupCards = !query && groupedCards.length > 0;

  // Get current set info when filtering by set
  const currentSetInfo = selectedSet ? sets.find(s => s.id === selectedSet) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      {/* Subtle Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-rose-200/10 rounded-full blur-3xl subtle-fade" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl subtle-fade" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden pt-16 pb-20">
        <div className="relative container flex flex-col items-center justify-center gap-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-gray-900 max-w-4xl leading-tight">
            Organize Your Pokémon
            <span className="block mt-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-transparent leading-normal pb-2">
              Trading Card Collection
            </span>
          </h1>
          
          <div className="flex flex-col w-full max-w-2xl gap-4 mt-4">
            <form onSubmit={handleSearch} className="flex w-full gap-2">
              <Input
                type="text"
                placeholder="Search for cards..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white border-rose-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-rose-300 focus-visible:ring-2 shadow-sm h-12 text-base"
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-sm hover:shadow-md transition-all duration-200 h-12 px-6"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <Select value={selectedSet} onValueChange={setSelectedSet} disabled={setsLoading}>
                <SelectTrigger className="bg-white border-rose-200 text-gray-900 focus-visible:ring-rose-300 focus-visible:ring-2 shadow-sm h-12 text-base">
                  <SelectValue placeholder="Filter by set..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {sets.map((set) => (
                    <SelectItem key={set.id} value={set.id}>
                      {formatSetLabel(set)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSet && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSet}
                  className="h-12 w-12 text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="container py-12">
        {/* API Error Alert */}
        {apiError && (
          <Alert variant="destructive" className="mb-8 border-rose-300 bg-rose-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Connection Error</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-3">
              <p>{apiError}</p>
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="w-fit border-rose-300 text-rose-700 hover:bg-rose-100"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {loading && cards.length === 0 && !apiError ? (
          <>
            {/* Show set header while loading if a set is selected */}
            {selectedSet && currentSetInfo && (
              <div className="border-b border-rose-200 pb-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentSetInfo.name}
                </h2>
                {currentSetInfo.series && (
                  <p className="text-sm text-gray-500 mt-1 font-light">
                    {currentSetInfo.series}
                  </p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex justify-center">
                  <div className="w-full max-w-[300px] space-y-3">
                    <Skeleton className="h-[420px] w-full rounded-xl bg-rose-100/50" />
                    <Skeleton className="h-4 w-3/4 bg-rose-100/50" />
                    <Skeleton className="h-4 w-1/2 bg-rose-100/50" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : cards.length > 0 ? (
          <>
            {shouldGroupCards ? (
              // Grouped by Set View
              <div className="space-y-16">
                {groupedCards.map((group) => (
                  <div key={group.setId} className="space-y-6">
                    {/* Set Header */}
                    <div className="border-b border-rose-200 pb-4">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {group.setName}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 font-light">
                        {group.series} • {group.cards.length} {group.cards.length === 1 ? 'card' : 'cards'}
                      </p>
                    </div>
                    
                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {group.cards.map((card) => (
                        <div key={card.id} className="flex justify-center">
                          <div className="w-full max-w-[300px]">
                            <PokemonCard card={card} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Regular Grid View with Set Header (when filtering by set or searching)
              <div className="space-y-6">
                {selectedSet && currentSetInfo && (
                  <div className="border-b border-rose-200 pb-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {currentSetInfo.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-light">
                      {currentSetInfo.series} • {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {cards.map((card) => (
                    <div key={card.id} className="flex justify-center">
                      <div className="w-full max-w-[300px]">
                        <PokemonCard card={card} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading / Empty States */}
            <div className="mt-16 flex justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                  <p className="text-gray-500 text-sm font-light">Loading more cards...</p>
                </div>
              ) : hasMore ? (
                <Button 
                  onClick={handleLoadMore}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-sm hover:shadow-md transition-all duration-200 px-8"
                >
                  Load More
                </Button>
              ) : (
                <p className="text-gray-400 font-light">All cards loaded</p>
              )}
            </div>
          </>
        ) : !loading && !apiError ? (
          <div className="text-center text-gray-500">
            <p className="text-lg font-light">No cards found. Try a different search.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
