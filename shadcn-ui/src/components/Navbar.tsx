import { Link, useLocation } from 'react-router-dom';
import { Heart, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-rose-100/50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <Heart className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-800">
            Pokémon Collection
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'} 
              className={`gap-2 ${
                location.pathname === '/' 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600' 
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-600'
              } transition-all duration-200`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Browse</span>
            </Button>
          </Link>

          <Link to="/pokedex">
            <Button 
              variant={location.pathname.startsWith('/pokedex') ? 'default' : 'ghost'} 
              className={`gap-2 ${
                location.pathname.startsWith('/pokedex')
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600' 
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-600'
              } transition-all duration-200`}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Pokédex</span>
            </Button>
          </Link>
          
          <Link to="/wishlist">
            <Button 
              variant={location.pathname === '/wishlist' ? 'default' : 'ghost'}
              className={`gap-2 ${
                location.pathname === '/wishlist'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-600'
              } transition-all duration-200`}
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Collection</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}