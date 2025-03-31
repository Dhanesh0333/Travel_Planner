import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Destination } from '@shared/schema';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [favorite, setFavorite] = useState(false);
  const { toast } = useToast();
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setFavorite(!favorite);
    
    toast({
      title: favorite ? "Removed from favorites" : "Added to favorites",
      description: `${destination.name} has been ${favorite ? "removed from" : "added to"} your favorites.`,
    });
  };
  
  const getBadgeColor = (type: string | undefined) => {
    switch (type) {
      case 'Popular':
        return 'bg-blue-100 text-primary';
      case 'Trending':
        return 'bg-green-100 text-green-600';
      case 'Romantic':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <Card className="overflow-hidden transition duration-300 hover:shadow-lg">
      <div className="relative pb-[66.67%]">
        <img 
          src={destination.imageUrl} 
          alt={`${destination.name}, ${destination.country}`} 
          className="absolute h-full w-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <button 
            className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-red-500 focus:outline-none"
            aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
            onClick={toggleFavorite}
          >
            <i className={favorite ? "ri-heart-fill text-red-500 text-xl" : "ri-heart-line text-xl"}></i>
          </button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{destination.name}</h3>
            <p className="text-gray-600 flex items-center mt-1">
              <i className="ri-map-pin-line mr-1"></i> {destination.country}
            </p>
          </div>
          {destination.type && (
            <div className={`px-2 py-1 rounded-full text-sm font-medium ${getBadgeColor(destination.type)}`}>
              {destination.type}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500 space-x-2">
          <span className="flex items-center">
            <i className="ri-star-fill text-yellow-400 mr-1"></i> {(destination.rating || 0) / 10}
          </span>
          {destination.tags && destination.tags.length > 0 && (
            <>
              <span>•</span>
              <span>{destination.tags[0]}</span>
              
              {destination.tags.length > 1 && (
                <>
                  <span>•</span>
                  <span>{destination.tags[1]}</span>
                </>
              )}
            </>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-700">
            <span className="text-lg font-bold text-gray-900">${destination.pricePerPerson}</span> / person
          </p>
          <Link href={`/destinations/${destination.id}`}>
            <Button size="sm">
              Explore
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
