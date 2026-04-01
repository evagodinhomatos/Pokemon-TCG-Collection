import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardsByPokemon, PokemonCard as PokemonCardType, getSets, SetInfo } from '@/lib/pokemon';
import { PokemonCard } from '@/components/PokemonCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'sonner';

type SortOption = 'rarity' | 'name' | 'number' | 'date';

function formatSetLabel(set: SetInfo) {
  return set.series ? `${set.name} (${set.series})` : set.name;
}

const rarityOrder: { [key: string]: number } = {
  'Common': 1,
  'Uncommon': 2,
  'Rare': 3,
  'Rare Holo': 4,
  'Rare Ultra': 5,
  'Rare Secret': 6,
  'Rare Rainbow': 7,
};

export default function PokemonCards() {
  const { pokemonName } = useParams<{ pokemonName: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<PokemonCardType[]>([]);
  const [sortedCards, setSortedCards] = useState<PokemonCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sets, setSets] = useState<SetInfo[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [setsLoading, setSetsLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setSetsLoading(true);
        const response = await getSets();
        setSets(response.data);
      } catch (error) {
        console.error('Failed to load sets:', error);
      } finally {
        setSetsLoading(false);
      }
    };

    fetchSets();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      if (!pokemonName) return;
      
      try {
        setLoading(true);
        const capitalizedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        const response = await getCardsByPokemon(capitalizedName, 1, selectedSet || undefined);
        setCards(response.data);
        setSortedCards(response.data);
      } catch (error) {
        toast.error('Failed to load cards');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [pokemonName, selectedSet]);

  useEffect(() => {
    const sorted = [...cards];
    
    switch (sortBy) {
      case 'rarity': {
        sorted.sort((a, b) => {
          const rarityA = rarityOrder[a.rarity || ''] || 0;
          const rarityB = rarityOrder[b.rarity || ''] || 0;
          return rarityB - rarityA;
        });
        break;
      }
      
      case 'name': {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      }
      
      case 'number': {
        sorted.sort((a, b) => {
          const numA = parseInt(a.number) || 0;
          const numB = parseInt(b.number) || 0;
          return numA - numB;
        });
        break;
      }
      
      case 'date': {
        sorted.sort((a, b) => {
          const dateA = new Date(a.set.releaseDate).getTime();
          const dateB = new Date(b.set.releaseDate).getTime();
          return dateB - dateA;
        });
        break;
      }
    }
    
    setSortedCards(sorted);
  }, [sortBy, cards]);

  const displayName = pokemonName ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) : '';

  const handleClearSet = () => {
    setSelectedSet('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <div className="fixed top-20 left-10 w-64 h-64 bg-rose-200/10 rounded-full blur-3xl subtle-fade" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl subtle-fade" style={{ animationDelay: '2s' }} />

      <div className="relative container pt-8 pb-12">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/pokedex')}
              className="text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {displayName} Cards
              </h1>
              <p className="text-gray-600 font-light mt-1">
                {cards.length} {cards.length === 1 ? 'card' : 'cards'} found
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Select value={selectedSet} onValueChange={setSelectedSet} disabled={setsLoading}>
                <SelectTrigger className="bg-white border-rose-200 text-gray-900 focus-visible:ring-rose-300 focus-visible:ring-2 shadow-sm">
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
                  className="text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[180px] bg-white border-rose-200 focus:ring-rose-300">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Release Date</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                  <SelectItem value="number">Card Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <p className="text-gray-500 text-sm font-light">Loading cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg text-gray-500 font-light">
              No cards found for {displayName}
              {selectedSet && ' in the selected set'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sortedCards.map((card) => (
              <div key={card.id} className="flex justify-center">
                <div className="w-full max-w-[300px]">
                  <PokemonCard card={card} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
