import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import DestinationCard from '@/components/DestinationCard';
import { Destination } from '@shared/schema';

export default function Destinations() {
  const [_, params] = useLocation();
  const searchParams = new URLSearchParams(params);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [sortBy, setSortBy] = useState('popularity');
  const [filterType, setFilterType] = useState('');
  
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a full implementation, this would call an API with the search term
    console.log('Searching for:', searchTerm);
  };
  
  const getSortedAndFilteredDestinations = () => {
    if (!destinations) return [];
    
    let filtered = [...destinations];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(term) || 
        dest.country.toLowerCase().includes(term) ||
        (dest.tags && dest.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Apply type filter
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter(dest => dest.type === filterType);
    }
    
    // Apply sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.pricePerPerson || 0) - (b.pricePerPerson || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.pricePerPerson || 0) - (a.pricePerPerson || 0));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    // default is popularity (we'll use the order they came in)
    
    return filtered;
  };
  
  const filteredDestinations = getSortedAndFilteredDestinations();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Destinations</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Destinations</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <Input
                id="search"
                type="text"
                placeholder="Search by destination, country, or activity"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter By</label>
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger id="filter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Popular">Popular</SelectItem>
                <SelectItem value="Trending">Trending</SelectItem>
                <SelectItem value="Romantic">Romantic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger id="sort">
                <SelectValue placeholder="Popularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>
      
      {/* Results */}
      <div className="mb-4">
        {!isLoading && (
          <p className="text-gray-600">{filteredDestinations.length} destinations found</p>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4"><i className="ri-search-line"></i></div>
          <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map(destination => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}
