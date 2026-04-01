import { useState, useRef, MouseEvent } from 'react';
import { PokemonCard as PokemonCardType } from '@/lib/pokemon';
import { Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist, useCollection } from '@/lib/store';
import { cn } from '@/lib/utils';
import { CardModal } from './CardModal';

interface PokemonCardProps {
  card: PokemonCardType;
}

export function PokemonCard({ card }: PokemonCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isInCollection, addToCollection, removeFromCollection } = useCollection();
  const isWishlisted = isInWishlist(card.id);
  const isOwned = isInCollection(card.id);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [modalOpen, setModalOpen] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 15;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const toggleWishlist = (e: MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(card.id);
    } else {
      addToWishlist(card);
    }
  };

  const toggleCollection = (e: MouseEvent) => {
    e.stopPropagation();
    if (isOwned) {
      removeFromCollection(card.id);
    } else {
      addToCollection(card);
    }
  };

  const handleCardClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="group relative perspective-1000" onClick={handleCardClick}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[0.716] w-full transition-transform duration-200 ease-out transform-style-3d cursor-pointer"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Card Container with Border */}
          <div className={cn(
            "relative h-full w-full rounded-2xl p-[2px] shadow-lg hover:shadow-xl transition-all duration-300",
            isOwned 
              ? "bg-gradient-to-br from-emerald-300 via-green-300 to-emerald-200" 
              : "bg-gradient-to-br from-rose-200 via-pink-200 to-rose-100"
          )}>
            {/* Card Image */}
            <img
              src={card.images.large}
              alt={card.name}
              className={cn(
                "h-full w-full rounded-2xl object-cover transition-opacity duration-300",
                isOwned && "opacity-90"
              )}
              loading="lazy"
            />

            {/* Owned Badge Overlay */}
            {isOwned && (
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 pointer-events-none" />
            )}

            {/* Subtle Holographic Glare Effect */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-overlay"
              style={{
                background: `radial-gradient(
                  circle at ${glare.x}% ${glare.y}%, 
                  rgba(255, 255, 255, 0.4) 0%, 
                  rgba(255, 192, 203, 0.2) 20%,
                  transparent 50%
                )`,
                opacity: glare.opacity,
                transition: 'opacity 0.3s ease',
              }}
            />

            {/* Action Buttons Overlay */}
            <div className="absolute top-3 right-3 z-10 translate-z-20 flex gap-2">
              {/* Collection Button */}
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-md transition-all duration-200",
                  isOwned && "bg-emerald-50 hover:bg-emerald-100"
                )}
                onClick={toggleCollection}
              >
                <Check className={cn(
                  "h-5 w-5 transition-colors",
                  isOwned ? "text-emerald-600 stroke-[3]" : "text-gray-400"
                )} />
              </Button>

              {/* Wishlist Button */}
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-md transition-all duration-200",
                  isWishlisted && "bg-rose-50 hover:bg-rose-100"
                )}
                onClick={toggleWishlist}
              >
                <Heart className={cn(
                  "h-5 w-5 transition-colors",
                  isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"
                )} />
              </Button>
            </div>

            {/* Owned Badge in Bottom Left */}
            {isOwned && (
              <div className="absolute bottom-3 left-3 z-10 translate-z-20">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white shadow-md text-xs font-medium">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Owned</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardModal card={card} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}