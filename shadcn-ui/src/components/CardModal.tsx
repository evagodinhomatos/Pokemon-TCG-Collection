import { PokemonCard as PokemonCardType } from '@/lib/pokemon';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardModalProps {
  card: PokemonCardType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CardModal({ card, open, onOpenChange }: CardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 bg-white border-0 overflow-hidden">
        <div className="relative flex flex-col md:flex-row gap-8 p-8">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Card Image */}
          <div className="flex-shrink-0 flex items-center justify-center md:w-1/2">
            <img
              src={card.images.large}
              alt={card.name}
              className="w-full max-w-md rounded-2xl shadow-2xl"
            />
          </div>

          {/* Card Details */}
          <div className="flex-1 flex flex-col justify-center space-y-6 md:w-1/2">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{card.name}</h2>
              <p className="text-lg text-gray-600 font-light">{card.supertype}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Set</h3>
                <p className="text-lg text-gray-900">{card.set.name}</p>
                <p className="text-sm text-gray-600">{card.set.series}</p>
              </div>

              {card.rarity && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Rarity</h3>
                  <p className="text-lg text-gray-900">{card.rarity}</p>
                </div>
              )}

              {card.artist && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Artist</h3>
                  <p className="text-lg text-gray-900">{card.artist}</p>
                </div>
              )}

              {card.types && card.types.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Type</h3>
                  <div className="flex gap-2">
                    {card.types.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 text-sm font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {card.hp && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">HP</h3>
                  <p className="text-lg text-gray-900">{card.hp}</p>
                </div>
              )}

              {card.number && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Card Number</h3>
                  <p className="text-lg text-gray-900">
                    {card.number} / {card.set.printedTotal || card.set.total}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}