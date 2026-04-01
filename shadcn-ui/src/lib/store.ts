import { useState, useEffect } from 'react';
import { PokemonCard } from './pokemon';
import { toast } from 'sonner';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<PokemonCard[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pokemon-tcg-wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
  }, []);

  const addToWishlist = (card: PokemonCard) => {
    setWishlist((prev) => {
      if (prev.some((c) => c.id === card.id)) {
        toast.info('Card already in wishlist');
        return prev;
      }
      const newWishlist = [...prev, card];
      localStorage.setItem('pokemon-tcg-wishlist', JSON.stringify(newWishlist));
      toast.success('Added to Chase List');
      return newWishlist;
    });
  };

  const removeFromWishlist = (cardId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.filter((c) => c.id !== cardId);
      localStorage.setItem('pokemon-tcg-wishlist', JSON.stringify(newWishlist));
      toast.success('Removed from Chase List');
      return newWishlist;
    });
  };

  const isInWishlist = (cardId: string) => {
    return wishlist.some((c) => c.id === cardId);
  };

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist };
}

export function useCollection() {
  const [collection, setCollection] = useState<PokemonCard[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pokemon-tcg-collection');
    if (stored) {
      try {
        setCollection(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse collection', e);
      }
    }
  }, []);

  const addToCollection = (card: PokemonCard) => {
    setCollection((prev) => {
      if (prev.some((c) => c.id === card.id)) {
        toast.info('Card already in collection');
        return prev;
      }
      const newCollection = [...prev, card];
      localStorage.setItem('pokemon-tcg-collection', JSON.stringify(newCollection));
      toast.success('Added to Collection');
      return newCollection;
    });
  };

  const removeFromCollection = (cardId: string) => {
    setCollection((prev) => {
      const newCollection = prev.filter((c) => c.id !== cardId);
      localStorage.setItem('pokemon-tcg-collection', JSON.stringify(newCollection));
      toast.success('Removed from Collection');
      return newCollection;
    });
  };

  const isInCollection = (cardId: string) => {
    return collection.some((c) => c.id === cardId);
  };

  return { collection, addToCollection, removeFromCollection, isInCollection };
}