import HeroSection from '@/components/HeroSection';
import { useQuery } from '@tanstack/react-query';
import DestinationCard from '@/components/DestinationCard';
import FeaturesSection from '@/components/FeaturesSection';
import { Destination } from '@shared/schema';
import ItineraryBuilder from '@/components/ItineraryBuilder';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [viewAllDestinations, setViewAllDestinations] = useState(false);
  
  const { data: destinations, isLoading: isLoadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });
  
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['/api/activities'],
  });
  
  const popularDestinations = destinations 
    ? destinations.filter(dest => dest.type === 'Popular').slice(0, viewAllDestinations ? undefined : 3)
    : [];
    
  return (
    <>
      <HeroSection />
      
      {/* Popular Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
          <button 
            className="text-primary font-medium flex items-center hover:text-blue-600"
            onClick={() => setViewAllDestinations(!viewAllDestinations)}
          >
            {viewAllDestinations ? 'Show Less' : 'View All'} <i className={`ri-arrow-${viewAllDestinations ? 'left' : 'right'}-line ml-1`}></i>
          </button>
        </div>
        
        {isLoadingDestinations ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="aspect-[3/2] w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map(destination => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}
      </section>
      
      {/* Trip Planner Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Build Your Custom Itinerary</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Drag and drop attractions and activities to create your perfect trip schedule.</p>
          </div>
          
          {isLoadingActivities ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </div>
              <div className="lg:col-span-2">
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </div>
            </div>
          ) : (
            <ItineraryBuilder activities={activities || []} />
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <FeaturesSection />
    </>
  );
}
