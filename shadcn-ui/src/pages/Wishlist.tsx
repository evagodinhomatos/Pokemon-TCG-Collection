import { useWishlist, useCollection } from '@/lib/store';
import { PokemonCard } from '@/components/PokemonCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Package } from 'lucide-react';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const { collection } = useCollection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      {/* Subtle Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-rose-200/10 rounded-full blur-3xl subtle-fade" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl subtle-fade" style={{ animationDelay: '2s' }} />

      <div className="container py-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900 mb-4">
            My Collection
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Track your owned cards and chase list
          </p>
        </div>

        <Tabs defaultValue="wishlist" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-white border border-rose-200 shadow-sm">
            <TabsTrigger 
              value="wishlist" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Chase List ({wishlist.length})
            </TabsTrigger>
            <TabsTrigger 
              value="collection"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              Owned ({collection.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wishlist" className="mt-0">
            {wishlist.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="h-16 w-16 mx-auto text-rose-300 mb-4" />
                <p className="text-xl text-gray-500 font-light">Your chase list is empty</p>
                <p className="text-sm text-gray-400 mt-2">Add cards you want to collect</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {wishlist.map((card) => (
                  <div key={card.id} className="flex justify-center">
                    <div className="w-full max-w-[300px]">
                      <PokemonCard card={card} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="collection" className="mt-0">
            {collection.length === 0 ? (
              <div className="text-center py-20">
                <Package className="h-16 w-16 mx-auto text-emerald-300 mb-4" />
                <p className="text-xl text-gray-500 font-light">Your collection is empty</p>
                <p className="text-sm text-gray-400 mt-2">Mark cards you already own</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {collection.map((card) => (
                  <div key={card.id} className="flex justify-center">
                    <div className="w-full max-w-[300px]">
                      <PokemonCard card={card} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}