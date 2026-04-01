import { useState, useEffect } from 'react';
import { getPokedex, PokedexEntry } from '@/lib/pokemon';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Pokedex() {
  const [pokemon, setPokemon] = useState<PokedexEntry[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokedexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokedex = async () => {
      try {
        setLoading(true);
        const data = await getPokedex(1025);
        setPokemon(data);
        setFilteredPokemon(data);
      } catch (error) {
        toast.error('Failed to load Pokédex');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokedex();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = pokemon.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toString().includes(searchQuery)
      );
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemon);
    }
  }, [searchQuery, pokemon]);

  const handlePokemonClick = (pokemonName: string) => {
    navigate(`/pokedex/${pokemonName.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <div className="fixed top-20 left-10 w-64 h-64 bg-rose-200/10 rounded-full blur-3xl subtle-fade" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl subtle-fade" style={{ animationDelay: '2s' }} />

      <div className="relative container pt-16 pb-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
              Pokédex
            </span>
          </h1>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Browse all 1,025 Pokémon and discover their trading cards
          </p>
        </div>

        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-rose-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-rose-300 focus-visible:ring-2 shadow-sm h-12 text-base"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <p className="text-gray-500 text-sm font-light">Loading Pokédex...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredPokemon.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePokemonClick(p.name)}
                className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-rose-100 hover:border-rose-300 cursor-pointer"
              >
                <div className="absolute top-2 left-2 text-xs font-semibold text-gray-400">
                  #{p.id.toString().padStart(4, '0')}
                </div>
                <div className="flex flex-col items-center pt-4">
                  <div className="w-24 h-24 flex items-center justify-center mb-2">
                    <img
                      src={p.sprite}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center">
                    {p.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && filteredPokemon.length === 0 && (
          <div className="text-center py-24">
            <p className="text-lg text-gray-500 font-light">
              No Pokémon found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}