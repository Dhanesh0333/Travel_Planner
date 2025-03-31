import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ActivityCard from './ActivityCard';
import ItineraryDay from './ItineraryDay';
import { Activity, DayPlan, Trip } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { addDays, format } from 'date-fns';

interface ItineraryBuilderProps {
  activities: Activity[];
  initialTrip?: Trip;
}

export default function ItineraryBuilder({ activities, initialTrip }: ItineraryBuilderProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tripName, setTripName] = useState(initialTrip?.name || 'My Adventure');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [days, setDays] = useState<DayPlan[]>([]);
  
  useEffect(() => {
    if (initialTrip) {
      setTripName(initialTrip.name);
      if (initialTrip.itinerary) {
        setDays(initialTrip.itinerary as DayPlan[]);
      }
      if (initialTrip.startDate) {
        setStartDate(new Date(initialTrip.startDate));
      }
      if (initialTrip.endDate) {
        setEndDate(new Date(initialTrip.endDate));
      }
    } else {
      // Initialize with default days
      initializeDays();
    }
  }, [initialTrip]);
  
  const initializeDays = () => {
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const newDays: DayPlan[] = [];
    
    for (let i = 0; i < dayDiff + 1; i++) {
      const currentDate = addDays(startDate, i);
      newDays.push({
        day: i + 1,
        date: format(currentDate, 'yyyy-MM-dd'),
        activities: []
      });
    }
    
    setDays(newDays);
  };
  
  useEffect(() => {
    initializeDays();
  }, [startDate, endDate]);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = searchTerm.trim() === '' || 
     activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || activity.category === categoryFilter;
    const matchesCategory = categoryFilter === 'all' || categoryFilter === '' || activity.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Moving within a day
    if (source.droppableId === destination.droppableId && source.droppableId.startsWith('day-')) {
      const dayIndex = parseInt(source.droppableId.replace('day-', '')) - 1;
      const dayActivities = [...days[dayIndex].activities];
      const [movedActivity] = dayActivities.splice(source.index, 1);
      dayActivities.splice(destination.index, 0, movedActivity);
      
      const newDays = [...days];
      newDays[dayIndex] = {
        ...days[dayIndex],
        activities: dayActivities
      };
      
      setDays(newDays);
    }
    // Moving from activities list to a day
    else if (source.droppableId === 'activities' && destination.droppableId.startsWith('day-')) {
      const dayIndex = parseInt(destination.droppableId.replace('day-', '')) - 1;
      const activity = activities[source.index];
      
      // Check if activity is already in the day
      const isActivityInDay = days[dayIndex].activities.some(a => a.activityId === activity.id);
      if (isActivityInDay) {
        toast({
          title: "Activity already added",
          description: "This activity is already in your itinerary for this day.",
          variant: "destructive"
        });
        return;
      }
      
      // Create a new activity entry for the day
      const newActivity = {
        activityId: activity.id,
        name: activity.name,
        startTime: '09:00',
        endTime: '12:00',
        duration: activity.duration
      };
      
      const newDays = [...days];
      const dayActivities = [...days[dayIndex].activities];
      dayActivities.splice(destination.index, 0, newActivity);
      
      newDays[dayIndex] = {
        ...days[dayIndex],
        activities: dayActivities
      };
      
      setDays(newDays);
    }
    // Moving between days
    else if (source.droppableId.startsWith('day-') && destination.droppableId.startsWith('day-') && source.droppableId !== destination.droppableId) {
      const sourceDayIndex = parseInt(source.droppableId.replace('day-', '')) - 1;
      const destDayIndex = parseInt(destination.droppableId.replace('day-', '')) - 1;
      
      const sourceActivities = [...days[sourceDayIndex].activities];
      const [movedActivity] = sourceActivities.splice(source.index, 1);
      
      const destActivities = [...days[destDayIndex].activities];
      destActivities.splice(destination.index, 0, movedActivity);
      
      const newDays = [...days];
      newDays[sourceDayIndex] = {
        ...days[sourceDayIndex],
        activities: sourceActivities
      };
      newDays[destDayIndex] = {
        ...days[destDayIndex],
        activities: destActivities
      };
      
      setDays(newDays);
    }
  };
  
  const addDay = () => {
    const lastDay = days[days.length - 1];
    const newDay: DayPlan = {
      day: lastDay.day + 1,
      date: format(addDays(new Date(lastDay.date), 1), 'yyyy-MM-dd'),
      activities: []
    };
    
    setDays([...days, newDay]);
    
    // Also update the end date
    setEndDate(addDays(endDate, 1));
  };
  
  const removeDay = (dayIndex: number) => {
    if (days.length <= 1) {
      toast({
        title: "Cannot remove day",
        description: "Your itinerary must have at least one day.",
        variant: "destructive"
      });
      return;
    }
    
    const newDays = [...days];
    newDays.splice(dayIndex, 1);
    
    // Renumber the days
    for (let i = dayIndex; i < newDays.length; i++) {
      newDays[i] = {
        ...newDays[i],
        day: i + 1
      };
    }
    
    setDays(newDays);
    
    // Update the end date if we removed the last day
    if (dayIndex === days.length - 1) {
      setEndDate(addDays(endDate, -1));
    }
  };
  
  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newDays = [...days];
    const dayActivities = [...days[dayIndex].activities];
    dayActivities.splice(activityIndex, 1);
    
    newDays[dayIndex] = {
      ...days[dayIndex],
      activities: dayActivities
    };
    
    setDays(newDays);
  };
  
  const saveItinerary = async () => {
    try {
      const tripData = {
        name: tripName,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        destination: 'Multiple Destinations', // This would need to be more specific in a real app
        travelers: 2, // This would be user-selected in a real app
        itinerary: days
      };
      
      if (initialTrip) {
        // Update existing trip
        await apiRequest('PUT', `/api/trips/${initialTrip.id}`, tripData);
      } else {
        // Create new trip
        await apiRequest('POST', '/api/trips', tripData);
      }
      
      toast({
        title: "Itinerary saved!",
        description: "Your travel itinerary has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to save itinerary",
        description: "An error occurred while saving your itinerary. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const exportItinerary = () => {
    // This would generate a PDF or other format in a real app
    toast({
      title: "Exporting itinerary",
      description: "Your itinerary is being prepared for export.",
    });
  };
  
  const getUniqueCategories = () => {
    const categories = new Set<string>();
    activities.forEach(activity => {
      categories.add(activity.category);
    });
    return Array.from(categories);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Available Activities */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Available Activities</h3>
            <div className="space-y-3">
              {/* Search and Filter */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400"></i>
                </div>
                <Input 
                  type="text"
                  placeholder="Search activities"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {getUniqueCategories().map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Draggable Activity Cards */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="activities">
                  {(provided) => (
                    <div 
                      className="space-y-3"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {filteredActivities.map((activity, index) => (
                        <Draggable key={activity.id} draggableId={`activity-${activity.id}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ActivityCard activity={activity} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Itinerary Builder */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Your Itinerary</h3>
                <p className="mt-1 text-sm text-gray-500">Drag activities from the left to add them to your daily schedule.</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button variant="outline" onClick={exportItinerary}>
                  <i className="ri-download-line mr-1"></i> Export
                </Button>
                <Button onClick={saveItinerary}>
                  <i className="ri-save-line mr-1"></i> Save
                </Button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="trip-name" className="block text-sm font-medium text-gray-700">Trip Name</label>
                <Input
                  id="trip-name"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="My Adventure"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="trip-dates" className="block text-sm font-medium text-gray-700">Trip Dates</label>
                <Input
                  id="trip-dates"
                  value={`${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`}
                  readOnly
                  className="mt-1"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="space-y-6">
                {days.map((day, index) => (
                  <ItineraryDay
                    key={day.day}
                    day={day}
                    onRemoveDay={() => removeDay(index)}
                    onRemoveActivity={(activityIndex) => removeActivity(index, activityIndex)}
                  />
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full py-6 border-2 border-dashed" 
                  onClick={addDay}
                >
                  <i className="ri-add-line mr-1"></i> Add Another Day
                </Button>
              </div>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}