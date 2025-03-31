import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format, parseISO } from 'date-fns';
import { Link } from 'wouter';

export default function MyTrips() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const { data: trips, isLoading } = useQuery<Trip[]>({
    queryKey: ['/api/trips'],
  });
  
  const deleteTrip = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/trips/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      toast({
        title: "Trip deleted",
        description: "Your trip has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem deleting your trip. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteTrip = (id: number) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      deleteTrip.mutate(id);
    }
  };
  
  const getTripsForTab = () => {
    if (!trips) return [];
    
    const now = new Date();
    
     if (activeTab === 'upcoming') {
      return trips.filter(trip => new Date(trip.startDate) >= now);
    } else if (activeTab === 'past') {
      return trips.filter(trip => new Date(endDate) < now);
      return trips.filter(trip => new Date(trip.endDate) < now);
    } else {
      return trips;
    } 
  const filteredTrips = getTripsForTab();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
        <Link href="/">
          <Button>
            <i className="ri-add-line mr-2"></i> Plan New Trip
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Trips</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Skeleton className="h-20 w-32" />
                      <Skeleton className="h-20 w-32" />
                      <Skeleton className="h-20 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-4"><i className="ri-flight-takeoff-line text-gray-300"></i></div>
              <h3 className="text-xl font-semibold mb-2">No trips found</h3>
              <p className="text-gray-600 mb-6">You don't have any {activeTab} trips yet</p>
              <Link href="/">
                <Button>
                  <i className="ri-add-line mr-2"></i> Start Planning Your Trip
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTrips.map((trip) => (
                <Card key={trip.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{trip.name}</CardTitle>
                        <p className="text-gray-500">
                          {format(parseISO(trip.startDate), 'MMM d, yyyy')} - {format(parseISO(trip.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <i className="ri-edit-2-line mr-1"></i> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteTrip(trip.id)}
                        >
                          <i className="ri-delete-bin-line mr-1"></i> Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm mb-4">
                      <i className="ri-map-pin-line mr-1 text-gray-500"></i>
                      <span className="text-gray-700">{trip.destination}</span>
                      <span className="mx-2">•</span>
                      <i className="ri-user-line mr-1 text-gray-500"></i>
                      <span className="text-gray-700">{trip.travelers} travelers</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Itinerary Overview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(trip.itinerary as any[]).map((day, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="font-medium text-sm">Day {day.day} - {format(parseISO(day.date), 'MMM d')}</div>
                            <div className="text-gray-600 text-sm mt-1">
                              {day.activities.length > 0 
                                ? `${day.activities.length} activities planned` 
                                : 'No activities planned yet'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}